async function fetchHealthData() {
  try {
    const healthTipsElement = document.querySelector('.health-tips');
    healthTipsElement.innerHTML = '⏳ Analyzing your reports...';

    // 1. Trigger backend to fetch all PDFs, extract abnormalities, and get diet tips
    const response = await fetch('/api/health-check');  // Combined call to fetch all PDFs, analyze and get diet tips
    if (!response.ok) throw new Error('Failed to process health data');

    const data = await response.json();

    // 2. Process the analysis results (abnormalities and recommendations)
    if (data.abnormalities.length === 0) {
      healthTipsElement.innerHTML = "<p>✅ All test results are within the normal range.</p>";
    } else {
      healthTipsElement.innerHTML = "<h3>🥗 Diet Recommendations:</h3>";
      data.recommendations.forEach(rec => {
        healthTipsElement.innerHTML += `<p>• ${rec}</p><br>`;  // Assuming 'rec' is just the tip
      });
    }
  } catch (err) {
    console.error('❌ Error:', err);
    document.querySelector('.health-tips').innerHTML = "<p>❌ Failed to fetch health data.</p>";
  }
}

document.addEventListener("DOMContentLoaded", fetchHealthData);
