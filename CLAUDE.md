# 🧠 CLAUDE.md — Personal Hub Platform

## 🎯 Project Definition

This is NOT a portfolio website.

This is a **personal hub platform** designed to:

- Showcase production-grade systems
- Present real-world work as case studies
- Publish technical writing
- Document experimental labs
- Scale over time with new content types

---

## 🧭 Positioning

The owner is:

> A product engineer who builds real systems by combining AI and backend engineering.

Core signals:

- System thinking (architecture, decisions)
- Product mindset (not just code)
- Continuous builder

---

## 🏗️ Architecture Principles

### 1. Content-first system

- The platform is built around structured content
- NOT page-first, NOT component-first

### 2. Strong separation

- content layer ≠ UI layer
- parsing logic ≠ rendering logic

### 3. Typed content

- All content must follow strict TypeScript schemas
- No untyped data

---

## 📦 Content Domains

- projects → productized systems
- work → real-world engagements
- writing → technical/editorial content
- labs → experimental work

Each domain:
- has its own schema
- shares base fields

---

## 🎨 Design Philosophy

**Editorial Minimalism × Technical Precision**

Rules:

- Typography > decoration
- Space defines structure
- Avoid unnecessary UI components
- No visual noise
- No template-like design

---

## 🚫 Strict Anti-Patterns

- Overengineering early
- Creating unnecessary abstractions
- Building UI before content system is ready
- Adding features without clear purpose
- Generic component libraries

---

## ⚙️ Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind
- MDX
- Vercel

---

## 🧱 Development Order (IMPORTANT)

1. Content system
2. Layout system
3. Domain pages
4. Homepage
5. Polish

DO NOT change this order.

---

## 🧠 Decision Rule

Always ask:

> Does this improve clarity, or add complexity?

If complexity > value → reject