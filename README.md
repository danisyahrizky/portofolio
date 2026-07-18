# DR. | Spatial Archive & Digital Portfolio

> Investigating the tension between computational logic and fluid digital experiences.

A spatial archive of digital artifacts and procedural experiments. This repository houses the frontend architecture of Danisyah Rizky's portfolio, built with a focus on raw logic, modular component design, and highly optimized 3D environments.

## 📐 Design Philosophy
The visual system is anchored in strict grid constraints, intentional structural exposure, and rigid typographic hierarchy. It prioritizes clarity, performance, and mechanical precision over superficial decoration, treating the interface as a functional architecture rather than a static canvas.

## ⚙️ Tech Stack
* **Core:** React 19, TypeScript, Vite
* **3D & Graphics:** Vanilla Three.js, Custom GLSL Shaders
* **Styling:** Tailwind CSS
* **Content Management:** Sanity (Headless CMS)
* **Animation:** Framer Motion (Targeted DOM transitions)

## 🏗️ Architecture
This project utilizes a strictly decoupled architecture to ensure scalability and rendering performance:
* **Frontend:** A React SPA optimized with dynamic imports (`lazy` / `Suspense`) to split heavy WebGL chunks from the initial DOM load. This prevents rendering bottlenecks caused by 3D computational logic.
* **Backend (CMS):** Powered by Sanity's Content Lake. Project data is fetched dynamically via GROQ, and image payloads are strictly controlled and compressed on-the-fly using Sanity's Image API to maintain Core Web Vitals.