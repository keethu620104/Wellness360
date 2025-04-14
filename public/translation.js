document.querySelector('.language-dropdown').addEventListener('change', async function() {
    const selectedLanguage = this.value;
    await translateContent(selectedLanguage);
});

async function translateContent(lang) {
    const elementsToTranslate = [
        { class: 'no-upcoming-appointments', text: "No upcoming Reminders" },
        { class: 'upcoming-appointments', text: "Upcoming Reminders" },
        { class: 'upcoming-appointments2', text: "Upcoming Reminders" },
        { class: 'prescriptions', text: "Prescriptions" },
        { class: 'prescriptions2', text: "Prescriptions" },
        { class: 'ai-assistant', text: "AI Assistant" },
        { class: 'ai-assistant2', text: "AI Assistant" },
        { class: 'emergency-help', text: "Emergency Help" },
        { class: 'find-doctor', text: "Find Doctor" },
        { class: 'health-tips', text: "Health Tips" },
        { class: 'need-help', text: "Need help?" },
        { class: 'welcome', text: "Welcome !" },
        { class: 'main-menu', text: "Main Menu" },
        { class: 'dashboard', text: "Dashboard" },
        { class: 'upload-report', text: "Upload Report" },
        { class: 'upload-report2', text: "Upload Report" },
        { class: 'appointments', text: "Reminders" },
        { class: 'emergency', text: "Emergency" },
        { class: 'logout', text: "Logout" },

        { class: 'upload-your-reports', text: "Upload Your Reports" },
        { class: 'your-reports', text: "Your Reports" },
        { class: 'upload-your-medical-reports', text: "Upload Your Medical Reports" },



        { class: 'chat-here', text: "Chat Here"},
        { class: 'recent-prescriptions', text: "Recent Prescriptions" },
        { class: 'no-active-prescriptions', text: "No active prescriptions" },
        { class: 'book-appointment', text: "Set Reminder" },
        { class : 'search-hospitals-btn', text: "Find Hospitals Near Me"},
        { class : 'search-diagnostics-btn', text: "Find Diagnostics Centers Near Me"},
        { class: 'pregnancy', text: "pregnancy" },
        { class: 'cardiology', text: "cardiology" },
        { class: 'orthopedics', text: "orthopedics" },
        { class: 'pediatrics', text: "pediatrics" },
        { class: 'neurology', text: "neurology" },
        { class: 'covid-19', text: "COVID-19" }, 
        {class : 'upload-a-pdf-for-better-results', text: "Upload a PDF for better results "},
        { class: 'upload-file', text: "Upload File" }, 
        { class: 'upload-your-prescription', text: "Upload Your Prescription" }, 
        { class: 'rectangle-4380', text: "Uploaded Files You can view and Download files" }, 
    ];

    for (const element of elementsToTranslate) {
        const translatedText = await fetchTranslation(element.text, lang);
        const targetElement = document.querySelector(`.${element.class}`);
        
        if (targetElement) {
            targetElement.innerHTML = translatedText;
            
            // Adjust font size dynamically
            adjustFontSize(targetElement, element.text, translatedText);
        }
    }
}
function adjustFontSize(element, originalText, translatedText) {
    const originalLength = originalText.length;
    const translatedLength = translatedText.length;

    if (translatedLength > originalLength ) {
        element.style.fontSize = "1em";  // Reduce size for longer text
    } 
     else {
        element.style.fontSize = "1em";  // Keep default size
    }
}

async function fetchTranslation(text, lang) {
    const translationUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURI(text)}`;
    
    try {
        const response = await fetch(translationUrl);
        const data = await response.json();
        return data[0][0][0]; // Returns the translated text
    } catch (error) {
        console.error("Translation API error: ", error);
        return "error"; // Fallback to original text on error
    }
}
