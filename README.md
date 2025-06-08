# CursorAI Landing Page

A modern, animated landing page for CursorAI - an AI-powered startup idea validation tool.

## Features

- Fully responsive design
- Dark/Light mode toggle
- Modern UI with smooth animations
- SEO optimized
- Built with Next.js, React, Tailwind CSS, and Framer Motion

## Project Structure

```
CursorAI/
├── app/                  # Next.js app directory
│   ├── layout.js         # Root layout component
│   ├── page.js           # Homepage component
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── Header.jsx        # Navigation header
│   ├── HeroSection.jsx   # Hero section
│   ├── ProblemSolutionSection.jsx
│   ├── HowItWorksSection.jsx
│   ├── FeaturesSection.jsx
│   ├── TestimonialsSection.jsx
│   ├── FAQSection.jsx
│   ├── CTASection.jsx
│   └── ThemeToggle.jsx   # Dark/light mode toggle
├── public/               # Static assets
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Project dependencies
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build and Deploy

To build the project for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
