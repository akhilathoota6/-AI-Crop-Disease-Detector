# 🌶️ ChilliTrack — AI Crop Disease Detector

> An offline-first mobile app that detects crop diseases instantly from a leaf photo using on-device AI. Built with React Native and TensorFlow Lite.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TensorFlow Lite](https://img.shields.io/badge/TensorFlow_Lite-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

---

## 📱 About

ChilliTrack started as a solution for my family's chilli farm in India — where crop diseases spread faster than help arrives. Rural farmers often have **no internet access** in their fields, making cloud-based solutions useless.

So I built an AI that lives entirely on the phone.

**No internet. No server. No cost per scan. Just point and detect.**

---

## ✨ Features

- 📷 **Live camera scanning** — point at any crop leaf and tap scan
- 🧠 **On-device AI** — TensorFlow Lite model runs entirely on the phone
- 🌿 **38 disease classes** across 14 crops
- 💊 **Treatment recommendations** — actionable advice for each disease
- 📶 **Works offline** — no internet connection required
- ⚡ **Fast detection** — results in under 2 seconds
- 🌙 **Dark theme** — optimised for outdoor use in sunlight

---

## 🌱 Supported Crops & Diseases

| Crop | Diseases Detected |
|------|------------------|
| 🌶️ Pepper | Bacterial Spot, Healthy |
| 🍅 Tomato | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Mosaic Virus, Yellow Leaf Curl Virus, Healthy |
| 🌽 Corn | Gray Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| 🍎 Apple | Scab, Black Rot, Cedar Rust, Healthy |
| 🍇 Grape | Black Rot, Esca, Leaf Blight, Healthy |
| 🥔 Potato | Early Blight, Late Blight, Healthy |
| 🍑 Peach | Bacterial Spot, Healthy |
| 🍓 Strawberry | Leaf Scorch, Healthy |
| 🫐 Blueberry | Healthy |
| 🫘 Soybean | Healthy |
| 🍊 Orange | Citrus Greening |
| 🍒 Cherry | Powdery Mildew, Healthy |
| 🥒 Squash | Powdery Mildew |
| 🫐 Raspberry | Healthy |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React Native | Cross-platform mobile app (iOS + Android) |
| TypeScript | Type-safe development |
| Expo | Build tooling and deployment |
| TensorFlow Lite | On-device AI inference |
| expo-camera | Live camera access |
| expo-image-manipulator | Image preprocessing for AI model |
| EAS Build | Cloud build pipeline |

---

## 🧠 How the AI Works

```
Farmer taps "Scan Leaf"
        ↓
Camera captures photo
        ↓
Image resized to 224×224px
        ↓
Normalized to Float32Array
        ↓
TFLite model runs inference (on-device)
        ↓
Softmax probabilities across 38 classes
        ↓
Highest confidence = detected disease
        ↓
Treatment recommendation shown
```

**Model:** MobileNetV2 trained on PlantVillage dataset (54,000+ leaf images)
**Model size:** ~4MB (bundled in app)
**Inference time:** ~1-2 seconds on mid-range Android

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- EAS CLI (for building)

### Installation

```bash
# Clone the repo
git clone https://github.com/akhilathoota6/ChilliTrack.git
cd ChilliTrack

# Install dependencies
npm install

# Start development server
npx expo start --dev-client
```

### Building the app

```bash
# Login to Expo
eas login

# Build for Android
eas build --profile development --platform android
```

---

## 📁 Project Structure

```
ChilliTrack/
├── app/
│   ├── (tabs)/
│   │   └── index.tsx          # Main tab screen
│   └── _layout.tsx            # App layout
├── components/
│   ├── ScanScreen.tsx         # Camera + results UI
│   └── inference.ts           # TFLite model + disease logic
├── assets/
│   └── models/
│       └── plant_disease.tflite  # AI model (4MB)
└── app.json                   # Expo config
```

---

## 💡 Why Offline-First?

Rural farmers in India often work in areas with **zero mobile signal**. Traditional AI apps that send photos to a cloud server are completely useless in these conditions.

By running the TensorFlow Lite model directly on the device:
- ✅ Works with zero internet
- ✅ No per-scan cost
- ✅ Instant results
- ✅ Privacy — photos never leave the device
- ✅ Works anywhere on the farm

---

## 🗺️ Roadmap

- [ ] Real-time video scanning (no tap needed)
- [ ] Scan history with field tagging
- [ ] GPS-based disease spread mapping
- [ ] Support for more crops (rice, wheat, sugarcane)
- [ ] Multi-language support (Hindi, Telugu, Tamil)
- [ ] Weather-based disease risk alerts

---

## 👨‍💻 Author

**Akhil Athota**
Masters Student | Full Stack Developer | AgriTech enthusiast

Built this to help my family's farm in India — and every other farmer who deserves better tools.

---

## 📄 License

MIT License — free to use, modify and distribute.

---

*Built with ❤️ for farmers who deserve better technology*
