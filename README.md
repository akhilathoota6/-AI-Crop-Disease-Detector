# 🌶️ ChilliTrack — AI Crop Disease Detector

> A full-stack platform that detects crop diseases instantly from a leaf photo using AI vision — available as a mobile app, a web app, and a REST API, all sharing one backend and database.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 📱 About

ChilliTrack started as a solution for my family's chilli farm in India — where crop diseases spread faster than help arrives. What began as an offline mobile prototype has grown into a full-stack platform: farmers can diagnose a leaf from their phone camera or from a browser, get a real AI-generated diagnosis with treatment advice, and have their scan history saved to their account.

---

## ✨ Features

- 📷 Live camera scanning (mobile) and photo upload (web) — same AI, two entry points
- 🧠 Real AI vision diagnosis — powered by Groq's vision model, not a fixed lookup table
- 🌍 Works for any crop — not limited to a pre-trained dataset; the AI reasons from what it sees
- 🔐 User accounts — JWT authentication, farmers' scans are tied to their profile
- 💊 Treatment, organic option, and prevention advice for every diagnosis
- 🗄️ Scan history saved to MongoDB — every scan is logged with crop, disease, and confidence
- ☁️ Deployed backend — live REST API on Render, works from any network

---

## 🛠️ Tech stack

| Layer | Technology |
|---|---|
| Mobile app | React Native + Expo |
| Web app | React.js (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| AI | Groq (vision-capable LLM) |
| Auth | JWT + bcrypt |
| Deployment | Render (backend) |

---

## 🧠 How it works

Farmer opens the mobile app or web app, logs in (JWT issued and stored), then takes a photo or uploads a leaf image. That image is sent to the backend API on Render, which forwards it to Groq AI along with an expert-agronomist prompt. The AI returns a structured diagnosis — crop, disease, confidence, severity, treatment, organic option, and prevention. The backend saves that scan to MongoDB, tied to the farmer's account, and the result is displayed on whichever app made the request.

If the photo isn't a plant leaf at all, the AI returns `isLeaf: false` and the app tells the farmer to try again — rather than guessing a fake diagnosis.

---

## 📸 Sample output

Input: photo of a diseased grape leaf

| Field | Value |
|---|---|
| Crop | Grape |
| Disease | Anthracnose |
| Confidence | High |

**Description:** Irregular brown to reddish-brown necrotic spots on leaves, some showing light centers typical of bird's eye spots.

**Treatment:** Spray with Bordeaux mixture or Mancozeb fungicide

**Organic option:** Neem oil spray or Pseudomonas fluorescens

**Prevention:** Prune and burn infected plant debris to prevent carryover

---

## 🚀 Getting started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string
- A Groq API key
- Expo CLI (for mobile)

### Backend
Navigate to the `backend` folder, run `npm install`, create a `.env` file with `PORT`, `MONGODB_URI`, `GROQ_API_KEY`, and `JWT_SECRET`, then run `node server.js`.

### Web app
Navigate to the `web` folder, run `npm install`, then `npm run dev`.

### Mobile app
From the project root, run `npm install`, then `npx expo start --dev-client`.

---

## 📁 Project structure

- `app/` — Expo Router entry point (mobile)
- `components/` — Mobile screens: Login, Register, Scan
- `backend/server.js` — Express server entry point
- `backend/routes/` — auth.js, scan.js
- `backend/models/` — User.js, Scan.js
- `backend/middleware/auth.js` — JWT verification
- `web/src/` — Login.jsx, Register.jsx, Scan.jsx, App.jsx

---

## 🗺️ Roadmap

- [ ] Scan history screen (view past diagnoses)
- [ ] Photo storage via Cloudinary
- [ ] Deploy web app to Vercel
- [ ] Field/location tagging per scan
- [ ] Multi-language support (Hindi, Telugu, Tamil)
- [ ] Weather-based disease risk alerts

---

## 👨‍💻 Author

**Akhil Athota**
Full Stack Developer | AgriTech enthusiast

Built this to help my family's farm in India — and every other farmer who deserves better tools.

---

## 📄 License

MIT License — free to use, modify and distribute.