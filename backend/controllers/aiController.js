const { getTravelRecommendations } = require("../service/aiService");

module.exports.renderAssistForm = (req, res) => {
    res.render("ai/assist.ejs", { recommendations: null });
};

module.exports.getRecommendations = async (req, res) => {
    try {
        const { budget, season, people } = req.body;
        const recommendationsText = await getTravelRecommendations(budget, season, people);

        // Clean up the text in case it contains markdown code blocks
        let cleanText = recommendationsText.replace(/```json/g, '').replace(/```/g, '').trim();

        let recommendations;
        try {
            recommendations = JSON.parse(cleanText);
        } catch (e) {
            console.error("Failed to parse AI response:", cleanText);
            // Fallback if parsing fails - pass as raw text wrapped in an object or just handle gracefully
            // For now, let's just pass an empty array and flash an error, or maybe try to show the raw text?
            // Let's try to show the raw text if parsing fails, but the view expects an array.
            // We'll treat it as a single "error" item or just throw.
            throw new Error("Invalid AI response format");
        }

        res.render("ai/assist.ejs", { recommendations, budget, season });
    } catch (error) {
        console.error("Error getting recommendations:", error);
        req.flash("error", "Failed to get recommendations. Please try again later.");
        res.redirect("/ai-assist");
    }
};
