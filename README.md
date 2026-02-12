# 🚀 PC Builder AI

PC Builder AI is a **Next.js web application** that generates complete PC builds based on user preferences.  
It first uses AI to give the best build using the restrictions. Then, it uses a dataset from **PCPartPicker** to verify if the pieces recommended by the AI exists.

Dataset source: [PC Part Dataset](https://github.com/docyx/pc-part-dataset/tree/main)

---

## 🌟 Features

- Generate PC builds by specifying **usage, budget, resolution, and performance goals**  
- Instant **total price calculation** for your build  
- AI-powered build generation using **OpenRouter API**  
- Copy builds easily for sharing  
- Smooth animations powered by **Framer Motion**  
- Responsive, modern UI built with **Tailwind CSS**

---

## 🛠️ Getting Started

Before following these steps, make sure you have Node.js and a package manager installed between npm, yarn, pnpm or bun.

### 1️⃣ Navigate to the projer

```bash
cd app
```
### 2️⃣ Install dependencies
```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### 3️⃣ Set up environment variables

You have to create a .env file inside the ./app folder and create OPENROUTER_KEY=your_api_key_here. So, you have to create an account at [OpenRouter](https://openrouter.ai/) and create an API key.

### 4️⃣ Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then visit the app at: http://localhost:3000