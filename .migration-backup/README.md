# 🌍 3D Planet Hero

A stunning, high-performance hero section featuring a realistic 3D planet rendered with WebGL/Three.js, enhanced with custom shaders, GSAP animations, and ultra-smooth scrolling.

<img width="1920" height="1080" alt="Screenshot (246)" src="https://github.com/user-attachments/assets/f1e1e29d-7d75-48e8-86bc-41586df84eb9" />

## ✨ Features

- **Realistic 3D Planet**: Built using `Three.js` with high-quality textures and atmosphere effects.
- **Custom GLSL Shaders**: Advanced lighting and atmospheric scattering for a cinematic look.
- **Interactive Experience**: Smooth mouse interaction and scroll-driven animations.
- **GSAP Animations**: Fluid transitions and entry effects for UI elements.
- **Lenis Smooth Scroll**: Modern, ultra-smooth scrolling experience.
- **Next.js 15+**: Optimized performance and modern React patterns.
- **Biome Toolchain**: Extremely fast linting and formatting for a clean codebase.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **3D Engine**: [Three.js](https://threejs.org/)
- **Animation**: [GSAP](https://gsap.com/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Styling**: Vanilla CSS (Next.js CSS Modules)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Language**: TypeScript

## 📂 Project Structure

```text
3D_hero-main/
├── app/                 # Next.js App Router (Pages and Layouts)
├── components/          # React Components
│   └── 3D/             # Three.js & WebGL logic
│       ├── planet.ts   # Main 3D initialization
│       └── shaders/    # GLSL shader files
├── public/              # Static assets (images, fonts, etc.)
├── styles/              # Global and component styles
├── biome.json           # Biome configuration
└── tsconfig.json        # TypeScript configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Thakuma07/3D-Earth.git
   cd 3D-Earth
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📜 Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Runs the built app in production mode.
- `npm run lint` - Checks code for errors and style issues using Biome.
- `npm run format` - Automatically formats all files using Biome.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is licensed under the MIT License.
