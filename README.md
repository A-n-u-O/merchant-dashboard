# 🏦 Apex Merchant Ledger (Full-Stack)
**An Enterprise-Grade Settlement Dashboard with Real-Time Data Persistence.**

[![Deployment Status](https://img.shields.io/badge/Vercel-Deployed-success?style=flat&logo=vercel)](https://merchant-dashboard-umber.vercel.app/)

> **Live Demo:** [https://merchant-dashboard-umber.vercel.app/](https://merchant-dashboard-umber.vercel.app/)

---

## 💎 Design Philosophy
Built with a focus on **High-Fidelity UX**, moving away from standard utility layouts to a custom-depth interface.
- **Glassmorphism UI:** Utilizing backdrop blurs and custom elevation for a modern "Apple-esque" feel.
- **Mobile-Responsive Architecture:** Engineered with a mobile-first approach, featuring responsive data tables and stacked layout grids for seamless merchant access on the go.
- **Fluid Motion:** Powered by `Framer Motion` for layout transitions and micro-interactions.
- **Dynamic Type-Scale:** Professional typography focusing on financial readability and "Bank-Grade" aesthetics.

## 🏗️ Backend Architecture & Features
A robust **PostgreSQL-backed infrastructure** designed to handle real-world financial logic.
- **Dual-Sync Settlement:** Implemented a failsafe payment flow using both Paystack Frontend Callbacks and Secure Webhooks for 100% data integrity.
- **Identity-Aware Ledger:** Transactions are strictly tied to a `User` entity via Supabase Auth and Row Level Security (RLS).
- **Merchant Profiles:** Dynamic business identity management, allowing merchants to sync their brand name across the platform.
- **Optimistic UI:** State managed via **Zustand**, providing instant feedback while syncing with the cloud in the background.

## 🚀 Advanced Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS, Framer Motion
- **State Management:** Zustand (with Persist Middleware)
- **Database:** Supabase (PostgreSQL)
- **Payments:** Paystack API Integration
- **Notifications:** Sonner (High-fidelity Toast system)

---

## 🧪 Development Note (Test Phase)
This application is currently in **Sandbox/Test Mode**. 
- **Testing Payments:** Use [Paystack Test Cards](https://paystack.com/docs/payments/test-cards/) to simulate successful transactions without real money.
- **Environment:** Ensure both Public and Secret keys are configured for the automated webhook flow to function correctly.

---

## 🛠️ Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/A-n-u-O/merchant-dashboard.git](https://github.com/A-n-u-O/merchant-dashboard.git)
   cd merchant-dashboard