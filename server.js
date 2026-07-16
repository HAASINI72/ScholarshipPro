import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, 'users.json');
let users = [];

// Load users from file if exists
try {
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  }
} catch (err) {
  console.error('Error loading users:', err);
}

const saveUsers = () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving users:', err);
  }
};

const JWT_SECRET = process.env.JWT_SECRET || 'scholarship-pro-secret-key-123';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Auth Middleware
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { 
        id: Date.now().toString(),
        name, 
        email, 
        password: hashedPassword,
        profile: {
          nationality: '',
          eduLevel: '',
          cgpa: '',
          income: '',
          techSkills: '',
          college: '',
          major: ''
        },
        documents: {
          resume: null,
          incomeCert: null,
          marksheets: null,
          idProof: null,
          lor: null
        }
      };
      users.push(newUser);
      saveUsers();

      const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = users.find(u => u.email === email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      const { password: _, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.get('/api/auth/me', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.sendStatus(404);
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.put('/api/auth/profile', authenticateToken, (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) return res.sendStatus(404);
    
    users[userIndex].profile = { ...users[userIndex].profile, ...req.body.profile };
    saveUsers();
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/recommendations', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ error: 'AI Service is temporarily unavailable (API Key missing)' });
      }

      const { profile } = req.body;
      if (!profile) {
        return res.status(400).json({ error: 'Profile is required' });
      }
      
      const prompt = `Act as an expert scholarship recommendation engine. 
      Analyze this student profile precisely:
      - Academic: CGPA ${profile.cgpa}, Level ${profile.eduLevel}, Course/Branch: ${profile.course || profile.major || 'Not specified'}
      - Background: Gender ${profile.gender || 'Not specified'}, Income ₹${profile.income}, Category ${profile.category}, State/City: ${profile.city || profile.state || 'Not specified'}
      - Skills: ${profile.techSkills || profile.skills || 'Not specified'}
      - Interests/Goals: ${profile.careerGoal || profile.interests || 'Not specified'}
      - Other: First Gen: ${profile.firstGen}, Disability: ${profile.disability}, Minority: ${profile.minority}

      Based on these variables, provide the top 6 most relevant real-world scholarship opportunities available in India or Globally for this specific profile.
      If the student's gender is Female, please actively search for and prioritize prestigious real-world women-specific scholarships and fellowships (e.g. "L'Oréal India For Young Women in Science", "Adobe Research Fellowship for Women", "Santoor Women's Scholarship", "Pragati Scholarship for Girls", etc.) in the matches list.
      
      Requirements:
      1. Provide accurate scholarship names (e.g., "NSP Merit Scholarship", "HDFC Badhte Kadam", etc.)
      2. matchScore should be a percentage based on eligibility criteria met.
      3. eligibilityReason must explain WHY it matches their specific profile (e.g., "Matched because your CGPA is above 8.5, you are female and you are from Karnataka").
      4. Include real-world documentation requirements.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Merit-based", "Need-based", "Research", "Women-specific"] },
                amount: { type: Type.STRING },
                deadline: { type: Type.STRING },
                eligibility: { type: Type.STRING },
                description: { type: Type.STRING },
                link: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                eligibilityReason: { type: Type.STRING },
                requiredDocuments: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["name", "type", "amount", "deadline", "eligibility", "description", "matchScore", "eligibilityReason", "requiredDocuments", "link"]
            }
          }
        },
      });

      const recommendations = JSON.parse(response.text);
      res.json(recommendations);
    } catch (error) {
      console.error('Gemini error:', error);
      res.status(500).json({ error: 'Failed to generate recommendations. Please ensure your profile is fully complete.' });
    }
  });

  app.post('/api/predict-eligibility', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ error: 'AI Service is temporarily unavailable (API Key missing)' });
      }

      const { profile } = req.body;
      if (!profile) {
        return res.status(400).json({ error: 'Profile is required' });
      }
      
      const prompt = `Based on the following student profile, predict the probability (0-100) of qualifying for these scholarship categories: Merit-based, Need-based, Research, and Minority/Special. 
      Also provide a 1-sentence tip for each.
      Student Profile: ${JSON.stringify(profile)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                probability: { type: Type.NUMBER },
                tip: { type: Type.STRING }
              },
              required: ["category", "probability", "tip"]
            }
          }
        },
      });

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error('Prediction error:', error);
      res.status(500).json({ error: 'Failed to predict' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ error: 'AI Service is temporarily unavailable (API Key missing)' });
      }

      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages are required' });
      }

      const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      const lastMessage = messages[messages.length - 1].content;

      const chat = ai.chats.create({ 
        model: "gemini-3-flash-preview",
        config: {
          history: history 
        }
      });
      const result = await chat.sendMessage({ message: lastMessage });
      
      res.json({ reply: result.text });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to chat' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
