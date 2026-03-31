# 🏦 Apex Merchant Ledger (Full-Stack)
**An Enterprise-Grade Settlement Dashboard with Real-Time Data Persistence.**

[![Deployment Status](https://img.shields.io/badge/Vercel-Deployed-success?style=flat&logo=vercel)](https://merchant-dashboard-umber.vercel.app/)

> **Live Demo:** [https://merchant-dashboard-umber.vercel.app/](https://merchant-dashboard-umber.vercel.app/)

---

## 💎 Design Philosophy
Built with a focus on **High-Fidelity UX**, moving away from standard utility layouts to a custom-depth interface.
- **Glassmorphism UI:** Utilizing backdrop blurs and custom elevation for a modern "Apple-esque" feel.
- **Marketing Carousel:** A high-conversion onboarding flow with animated value propositions.
- **Fluid Motion:** Powered by `Framer Motion` for layout transitions and micro-interactions.
- **Dynamic Type-Scale:** Professional typography focusing on financial readability and "Bank-Grade" aesthetics.

## 🏗️ Backend Architecture & Features
Transitioned from a client-side prototype to a robust **PostgreSQL-backed infrastructure**.
- **Identity-Aware Ledger:** Transactions are strictly tied to a `User` entity via Supabase Auth and Row Level Security (RLS).
- **Merchant Profiles:** Dynamic business identity management, allowing merchants to sync their brand name across the platform.
- **Optimistic UI:** State managed via **Zustand**, providing instant feedback while syncing with the cloud in the background.
- **Settlement Logic:** Automated reference generation (`MNP-XXXX`) and status tracking (Pending/Success/Failed).

## 🚀 Advanced Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS, Framer Motion
- **State Management:** Zustand (with Persist Middleware)
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide-React
- **Notifications:** Sonner (High-fidelity Toast system)

---

## 🛠️ Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/A-n-u-O/merchant-dashboard.git](https://github.com/A-n-u-O/merchant-dashboard.git)
   cd merchant-dashboard