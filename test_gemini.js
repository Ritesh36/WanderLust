require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Error: GEMINI_API_KEY is not set in .env file.");
            return;
        }
        console.log("API Key loaded: " + apiKey.substring(0, 5) + "...");

        const genAI = new GoogleGenerativeAI(apiKey);

        // For newer SDK versions, we might need to use the model directly to test, 
        // but let's try to list models if possible, or just try a simple generation with a known stable model.
        // The SDK doesn't always expose listModels easily in the high-level client, 
        // but we can try a simple generation with 'gemini-1.5-flash'.

        console.log("Attempting to generate content with 'gemini-2.5-pro'...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Success! Response:", response.text());

    } catch (error) {
        console.error("Error details:");
        console.error(error);
    }
}

testGemini();
