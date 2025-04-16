import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import multer from "multer";
import session from 'express-session';
// Remove incorrect default import
// import File from "./models/file.model.js";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(session({
    secret: 'wellness360-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

app.use(cors());
app.use(express.json());

dotenv.config();

app.use(express.static("public"));
// app.use("/uploads", express.static("uploads"));

// Define routes
app.get("/", (req, res) => {
   
        res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/map", (req, res) => {
  // Render maps.html and pass the API key to the template
  res.render('map', {
      mapApiKey: process.env.MAP_API_KEY // Pass the API key to maps.html
  });
});


app.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    if (username === "admin" && password === "pp123") {
      req.session.isAuthenticated = true;
      return res.json({ success: true });
    }
    
    res.status(401).json({ error: "Invalid credentials" });
});

// Add logout route
app.get("/logout", (req, res) => {
    res.redirect('/');
});



const API_KEY = process.env.HF_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    //console.log("✅ Received message:", userMessage);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }],
                generationConfig: {
                    max_output_tokens: 100, 
                    temperature: 0.1 // Controls randomness (0.1 = strict, 1.0 = creative)
                }
            })
        });

        const data = await response.json();
        console.log("✅ API Response:", JSON.stringify(data, null, 2));

        if (!data.candidates || data.candidates.length === 0) {
            return res.json({ response: "No response from AI." });
        }

        // ✅ Extract AI response
        const aiResponse = data.candidates[0]?.content?.parts[0]?.text || "No response from AI.";
        res.json({ response: aiResponse });

    } catch (error) {
        console.error("🚨 Server Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


import { default as File } from './models/file.model.js';
import { default as Report } from './models/report.model.js';

// MongoDB Atlas connection (if different from local)
mongoose.connect(process.env.MONGO_ATLAS_URI_TEST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// -------------for files------------------

// Route for uploading a PDF file
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;

    const file = new File({
      name: originalname,
      data: buffer,
      contentType: mimetype,
    });

    await file.save();
    res.status(201).send('File uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading the file.');
  }
});


// Route to display a list of uploaded files
app.get('/files', async (req, res) => {
  try {
    const files = await File.find();
    res.send(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving files from the database.');
  }
});

// Route to display an individual file based on its ID
app.get('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).send('File not found');
    }

    // Send the file data as a response
    res.contentType(file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving the file from the database.');
  }
});
app.delete('/files/:id', async (req, res) => {
  try {
    const result = await File.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).send('File not found');
    }

    res.send('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Error deleting the file');
  }
});

// --------------------------------for report------------------------------
app.post('/upload-report', upload.single('pdf'), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;

    const file = new Report({
      name: originalname,
      data: buffer,
      contentType: mimetype,
    });

    await file.save();
    res.status(201).send('File uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading the file.');
  }
});


// Route to display a list of uploaded files
app.get('/reports', async (req, res) => {
  try {
    const files = await Report.find();
    res.send(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving files from the database.');
  }
});

// Route to display an individual file based on its ID
app.get('/reports/:id', async (req, res) => {
  try {
    const file = await Report.findById(req.params.id);

    if (!file) {
      return res.status(404).send('File not found');
    }

    // Send the file data as a response
    res.contentType(file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving the file from the database.');
  }
});
app.delete('/reports/:id', async (req, res) => {
  try {
    const result = await Report.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).send('File not found');
    }

    res.send('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Error deleting the file');
  }
});
