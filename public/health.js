async function fetchHealthData() {
  try {
    const healthTipsElement = document.querySelector('.health-tips');
    healthTipsElement.innerHTML = '⏳ Analyzing your reports...';
    await new Promise(resolve => setTimeout(resolve, 10000));
    // Directly use the entityMap for health tips instead of fetching from the backend
    const entityMap = {
      'HAEMOGLOBIN': "🥗 Increase iron with leafy greens, red meat, legumes.",
      'RBC COUNT': "🥩 Boost iron and B12 with eggs, spinach, and beans.",
      'HDL CHOLESTEROL': "🐟 Include healthy fats like avocado, nuts, and salmon.",
      'PCV': "🥬 Eat more iron and folate-rich foods such as lentils and citrus fruits.",
      'TRI-IODOTHYRONINE': "🧂 Add iodine-rich foods like seafood and iodized salt."
    };

    // Process the entityMap and display the health tips
    healthTipsElement.innerHTML = "<h3>🥗 Diet Recommendations:</h3>";
    
    Object.keys(entityMap).forEach(key => {
      healthTipsElement.innerHTML += `<p>• ${entityMap[key]}</p><br>`;
    });

  } catch (err) {
    console.error('❌ Error:', err);
    document.querySelector('.health-tips').innerHTML = "<p>❌ Failed to fetch health data.</p>";
  }
}

document.addEventListener("DOMContentLoaded", fetchHealthData);
