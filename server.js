// server.js
const express = require("express");
const fetch = require("node-fetch"); // v3 works with require
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Weather endpoint
app.get("/weather", async (req, res) => {
  const city = req.query.city || "Addis Ababa";
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not set" });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});