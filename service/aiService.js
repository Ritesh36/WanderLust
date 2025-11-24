const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getTravelRecommendations(budget, season, people) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const prompt = `I am planning a trip for ${people} people. My budget is ${budget} and the preferred season/time is ${season}. 
  Please suggest 3-5 travel destinations that would be perfect for this budget, group size, and season. 
  
  Strictly output the result as a JSON array of objects. Do not include any markdown formatting (like \`\`\`json).
  Each object should have the following keys:
  - "name": Name of the destination
  - "description": A brief, catchy description (2-3 sentences)
  - "cost": Estimated cost breakdown (e.g., "Flights: $X, Stay: $Y")
  - "reason": Why it's good for this season
  
  Example format:
  [
    {
      "name": "Paris",
      "description": "The city of lights...",
      "cost": "Flights: $500, Stay: $100/night",
      "reason": "Spring is beautiful..."
    }
  ]`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}

module.exports = { getTravelRecommendations };
