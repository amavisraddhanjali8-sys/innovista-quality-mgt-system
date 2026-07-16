
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database if not exists
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    projects: [],
    standards: [],
    ncrs: [],
    cars: [],
    inspections: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// Database Helpers
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// --- API Endpoints ---

// Projects
app.get('/api/projects', (req, res) => res.json(readDB().projects));
app.post('/api/projects', (req, res) => {
  const db = readDB();
  const newProject = { ...req.body, id: `P-${Date.now()}` };
  db.projects.push(newProject);
  writeDB(db);
  res.json(newProject);
});

// NCRs (Nonconformance Reports)
app.get('/api/ncrs', (req, res) => res.json(readDB().ncrs));
app.post('/api/ncrs', (req, res) => {
  const db = readDB();
  const newNcr = { ...req.body, id: `NCR-${new Date().getFullYear()}-${db.ncrs.length + 1}` };
  db.ncrs.unshift(newNcr);
  writeDB(db);
  res.json(newNcr);
});

// AI Analysis (Gemini Integration)
app.post('/api/ai/analyze-root-cause', async (req, res) => {
  try {
    const { problemDescription } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this quality issue for Innovista Metal Fabriconix: ${problemDescription}. Provide 5-Whys and a corrective action plan in JSON.`,
      config: { responseMimeType: "application/json" }
    });
    res.json(JSON.parse(response.text));
  } catch (error) {
    res.status(500).json({ error: "AI Analysis Failed", details: error.message });
  }
});

// Serve static assets in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Serve index.html for any SPA routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Innovista QMS Backend running at http://localhost:${PORT}`);
});
