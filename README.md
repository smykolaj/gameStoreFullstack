GameStore

GameStore is a React-based web application designed with multi-language support and built using modern frontend tools and libraries.

Features

Built with React 18
Internationalization (i18n) support with i18next
Language detection and backend loading
Client-side routing with react-router-dom
API communication using axios
Configured with Vite for fast development and build
ESLint integration for code linting
Tech Stack

React – UI Library
Vite – Build tool and dev server
React Router DOM – Client-side routing
Axios – HTTP client
i18next – Internationalization framework
react-i18next – React bindings for i18next
i18next-http-backend – Backend plugin to load translations
i18next-browser-languagedetector – Auto-detect user's language
ESLint – JavaScript linter
Getting Started

Prerequisites
Make sure you have Node.js and npm installed.

Installation
cd frontend
npm install
Development
npm run dev
Build
npm run build
Preview Production Build
npm run preview
Lint the Code
npm run lint
Project Structure

tinpro/
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── public/
    │   └── locales/     # Translation files for pl and en
    ├── assets/          # Static assets like flags and logos
    ├── .env             # Environment variables
    └── .idea/           # IDE config (e.g., for WebStorm or IntelliJ)
