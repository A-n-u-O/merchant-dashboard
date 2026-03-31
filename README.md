# 🏦 Apex Merchant Ledger (Full-Stack)
**An Enterprise-Grade Settlement Dashboard with Real-Time Data Persistence.**

> **Note:** This project has been evolved from a client-side prototype to a full-stack financial tool.

---

## 💎 Design Philosophy
Built with a focus on **High-Fidelity UX**, moving away from standard utility layouts to a custom-depth interface.
- **Glassmorphism UI:** Utilizing backdrop blurs and custom elevation for a modern "Apple-esque" feel.
- **Fluid Motion:** Powered by `Framer Motion` for layout transitions and micro-interactions.
- **Dynamic Type-Scale:** Professional typography focusing on financial readability.

## 🏗️ Backend Architecture
Transitioned from mock-latency to a **PostgreSQL-backed infrastructure**.
- **Data Persistence:** Integrated **Supabase/Prisma** for permanent ledger storage.
- **Server-Side Integrity:** Validation shifted from the client to **Next.js Server Actions** for enhanced security.
- **Relational Mapping:** Transactions are now tied to a `User` entity, allowing for multi-merchant account management.

## 🚀 Advanced Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS, Framer Motion
- **State:** Zustand (Synchronized with DB via TanStack Query)
- **Backend:** Supabase (PostgreSQL) / Prisma
- **Security:** Zod-validated Server Actions

---

## 🛠️ Installation (Full-Stack)

1. **Clone & Install:**
   ```bash
   git clone [https://github.com/A-n-u-O/merchant-dashboard.git](https://github.com/A-n-u-O/merchant-dashboard.git)
   npm install