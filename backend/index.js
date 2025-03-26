const express = require("express");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/api/scrape", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: "Keyword is required" });

    try {
        const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
        const { data } = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
        });

        const dom = new JSDOM(data);
        const document = dom.window.document;
        const products = [];

        document.querySelectorAll(".s-main-slot .s-result-item").forEach((item) => {
            const title = item.querySelector(".s-title-instructions-style span")?.textContent.trim() || "No title";
            const rating = item.querySelector(".a-icon-alt")?.textContent.split(" ")[0] || "No rating"; // Pega apenas a nota
            const reviews = item.querySelector(".a-size-small .a-size-base")?.textContent.trim() || "No reviews"; // Alterado para pegar o número de avaliações
            const image = item.querySelector("img.s-image")?.getAttribute("src") || item.querySelector("img.s-image")?.getAttribute("data-src") || "No image"; // Ajustado para pegar src ou data-src

            products.push({ title, rating, reviews, image });
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to scrape Amazon", details: error.message });
    }
});

// ✅ Express usa `app.listen`, não `Bun.serve`
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

