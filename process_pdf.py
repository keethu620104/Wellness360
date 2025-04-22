import pdfplumber
import re
import sys
import json
import os

# Function to extract test results that exceed reference ranges
def extract_exceeding_tests(pdf_path):
    exceeded_tests = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()

            for table in tables:
                for row in table:
                    if len(row) < 4:
                        continue

                    test_name, result, unit, bio_ref, *_ = [cell.strip() if cell else "" for cell in row]

                    range_match = re.search(r"(\d+\.?\d*)\s*-\s*(\d+\.?\d*)", bio_ref)
                    less_than_match = re.search(r"<\s*(\d+\.?\d*)", bio_ref)

                    try:
                        result_value = float(result)

                        if range_match:
                            ref_min, ref_max = map(float, range_match.groups())
                            if result_value < ref_min or result_value > ref_max:
                                exceeded_tests.append(f"{test_name}: {result_value} (Range: {ref_min}-{ref_max})")

                        elif less_than_match:
                            ref_max = float(less_than_match.group(1))
                            if result_value >= ref_max:
                                exceeded_tests.append(f"{test_name}: {result_value} (Max: {ref_max})")

                    except ValueError:
                        continue

    return exceeded_tests

# ----------- MAIN EXECUTION ----------

if __name__ == "__main__":
    try:
        input_paths = json.loads(sys.argv[1])  # List of PDF paths
        all_abnormalities = []

        for path in input_paths:
            exceeded = extract_exceeding_tests(path)
            all_abnormalities.extend(exceeded)

        # Write abnormalities to a text file
        with open("abnormalities.txt", "w") as file:
            for abnormality in all_abnormalities:
                file.write(abnormality + "\n")

        # Prepare the result as a dictionary
        result = {
            "abnormalities": all_abnormalities,
            "recommendations": []  # No recommendations as API call is removed
        }

        # Print the result as a valid JSON string
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
