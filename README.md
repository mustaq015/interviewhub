<div align="center">

# 🎯 InterviewHub

### Your All-in-One Interview Preparation Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-mustaq015.github.io/interviewhub-blue?style=for-the-badge)](https://mustaq015.github.io/interviewhub)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-181717?style=for-the-badge&logo=github)](https://pages.github.com)
[![No Backend](https://img.shields.io/badge/No_Backend-100%25_Frontend-10B981?style=for-the-badge)]()
[![Free](https://img.shields.io/badge/Cost-Free_Forever-F59E0B?style=for-the-badge)]()

*Organize companies, track rounds, write notes, practice flashcards — all in one place. Syncs across every device via GitHub.*

![InterviewHub Banner](https://img.shields.io/badge/Data_Engineering-Interview_Prep-8B5CF6?style=for-the-badge)

</div>

---

## ✨ Features

### 🏢 Company Tracker
- Add and manage multiple companies you're interviewing at
- Track interview rounds, dates, and progress
- Color-coded urgency badges (🟢 upcoming · 🟡 soon · 🔴 urgent)
- Per-company notes and Q&A bank with code snippets

### 📝 Smart Notes
- Organized by categories and topics
- Full **Markdown editor** with live preview
- Attach external files — PDFs, images, CSVs, code files, videos
- Embed URLs, YouTube videos, and Google Docs inline
- Import/export notes in `.md` and other formats

### 📚 Study Resources
- Organize PDFs and links by category (SQL, ETL, DWH, Manual Testing, etc.)
- Browse and upload local files directly
- Mark resources as ⭐ Important for quick access
- One-click open for external links

### 📓 Notebooks
- Quick-launch links to Colab, Jupyter, and other notebooks
- Organize by tags (Python, SQL, ETL, PySpark, AWS, DWH)
- Add, edit, and delete notebook cards

### ✅ Interview Checklist
- Pre-loaded checklist covering Prep, Technical, and Logistics
- Progress bar tracking
- Add custom items and filter by category

### 🃏 Flashcards
- 12 built-in cards covering SCD, SQL, ETL, DWH concepts
- Flip animation, shuffle, add/delete cards
- Perfect for last-minute revision

### ⏱️ Study Timer
- Pomodoro-style Focus / Break / Long Break modes
- Session tracking with color-coded countdown

### 🔄 GitHub Sync
- All data syncs to your GitHub repo as `data.json`
- Works across every device — phone, tablet, laptop
- Auto-saves 3 seconds after any change
- One-time token setup per device

### 🔗 Google Integration *(optional)*
- **Calendar** — Add interview events with reminders
- **Drive** — Backup and restore your data
- **Gmail** — Draft follow-up and thank-you emails
- **Sheets** — Export application tracker

---

## 🚀 Live Demo

👉 **[mustaq015.github.io/interviewhub](https://mustaq015.github.io/interviewhub)**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Markdown | [marked.js](https://marked.js.org/) |
| Sync | GitHub Contents API |
| Hosting | GitHub Pages (Free) |
| Storage | localStorage + GitHub `data.json` |
| Auth | GitHub Personal Access Token |

> 🔒 No server. No database. No cost. Everything runs in your browser.

---

## 📦 Setup & Installation

### Option 1 — Use the live site directly
Just open 👉 [mustaq015.github.io/interviewhub](https://mustaq015.github.io/interviewhub) — no installation needed.

### Option 2 — Run locally
```bash
# Clone the repo
git clone https://github.com/mustaq015/interviewhub.git

# Open in browser
cd interviewhub
open index.html
```

---

## 🔄 Enable Cross-Device Sync

To sync your data across all your devices:

**Step 1** — Generate a GitHub token at [github.com/settings/tokens/new](https://github.com/settings/tokens/new)
- Note: `interviewhub-sync`
- Expiration: `No expiration`
- Scope: ✅ `repo`

**Step 2** — Click the **☁️ Sync** button in the app header

**Step 3** — Paste your token → click **Connect & Sync**

**Step 4** — Repeat on every new device (token is saved locally, never in the repo)

> ✅ After setup, every change auto-syncs to `data.json` in your repo within 3 seconds.

---

## 📁 Repository Structure

```
interviewhub/
├── index.html          # Complete single-file app
├── data.json           # Your synced data (auto-generated)
├── files/              # Upload your PDFs and study materials here
│   ├── ETL/
│   ├── SQL/
│   ├── manual/
│   └── project/
└── README.md           # This file
```

---

## 📸 Screenshots

| Companies View | Notes Editor | Study Resources |
|---|---|---|
| Track all your interviews | Write markdown notes | Organize all PDFs & links |

| Flashcards | Checklist | GitHub Sync |
|---|---|---|
| Practice key concepts | Pre-interview checklist | Sync across devices |

---

## 🎯 Who is this for?

This project is built for **Data Engineering / ETL / Analytics job seekers** preparing for technical interviews covering:

- 🗄️ SQL — DDL, DML, Joins, Window Functions, Aggregates
- 🔄 ETL — Informatica, Transformations, Data Pipeline
- 🏗️ Data Warehousing — Star/Snowflake Schema, SCD Types, Fact & Dimension Tables
- 🧪 Manual Testing — STLC, Test Cases, Bug Life Cycle, JIRA
- ☁️ Cloud — AWS Glue, Airflow, PySpark

---

## 🙌 Acknowledgements

- [marked.js](https://marked.js.org/) — Markdown parsing
- [GitHub Pages](https://pages.github.com/) — Free hosting
- [GitHub REST API](https://docs.github.com/en/rest) — Cross-device sync

---

<div align="center">

Made with ❤️ for interview success

⭐ Star this repo if it helped you!

</div>
