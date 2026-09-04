# Little Roses EduHub (v2.0.0) 🌹
> **Little Roses Academy Nakuru • CBC EduHub: Teach, Assess, Excel**

A comprehensive, offline-first Progressive Web App (PWA) and educational platform built for teachers, learners, and administrators at Little Roses Academy under the Kenyan Competency-Based Curriculum (CBC).

---

## 🌟 Key Features

1. **Teacher Workstation**:
   - Automated Continuous Assessment Test (CAT) entry and real-time grading.
   - 4-Tier CBC Rubric scoring:
     - **EE** (Exceeding Expectation 80–100%)
     - **ME** (Meeting Expectation 65–79%)
     - **AE** (Approaching Expectation 50–64%)
     - **BE** (Below Expectation 0–49%)
   - Automated remarks generation and class performance analytics.
   - Dynamic weekly timetable and period tracking.
   - Schemes of work & lesson notes organizer.

2. **Learner & Parent Portal**:
   - Learner progress dashboard with subject breakdown.
   - Interactive revision quizzes with instant feedback and answer explanations.
   - CBC curriculum digital library & downloadable revision materials.
   - Weekly timetable schedule with active period highlight.

3. **Executive Admin Dashboard**:
   - Master school records, staff allocation, and student roster management.
   - Curriculum resource management with role-based WRITE protection.
   - Term calendar and examination date scheduling.
   - Full JSON database backup and restoration engine.

4. **Security & Role-Based Access Control (RBAC)**:
   - **Administrator**: Full WRITE clearance across official textbooks, curriculum repositories, timetable overrides, and school settings.
   - **Teachers**: Individual faculty logins with allocated subjects. READ-ONLY clearance on school-wide master materials and READ-WRITE on personal teaching modules.
   - **Zero On-Screen Credential Exposure**: All master keys and passwords are encrypted and masked in the user interface.

5. **PWA & Offline Capability**:
   - Service Worker caching for complete offline functionality in classrooms.
   - Installable on Android, iOS, Windows, and macOS directly from the browser.
   - Bundled Android APK package included in the repository (`LittleRosesEduHub.apk`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your computer
- npm or bun

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/kiiruelvis4/little-roses-eduhub.git

# 2. Enter project folder
cd little-roses-eduhub

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` (or the port specified by Vite) in your browser.

---

## 📦 Building for Production & GitHub Pages

To create an optimized production build:

```bash
npm run build
```

This compiles all assets into the `dist/` directory.

### Deploying to GitHub Pages
If deploying under a GitHub repository subpath (e.g. `https://kiiruelvis4.github.io/little-roses-eduhub/`):

```bash
# Set your repository name as the base URL during build
VITE_BASE_URL=/little-roses-eduhub/ npm run build
```

---

## 🔗 Connecting & Pushing to GitHub

All files in this workspace are organized into a single unified repository. To push to your GitHub account:

```bash
# 1. Check git status
git status

# 2. Stage all files
git add .

# 3. Commit your changes
git commit -m "feat: Little Roses EduHub v2.0.0 with secure authentication and offline PWA"

# 4. Set the main branch
git branch -M main

# 5. Connect your remote GitHub repository
git remote add origin https://github.com/kiiruelvis4/little-roses-eduhub.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📥 How to Download the Project Files

You can download the entire application using either of these convenient methods:

### Method 1: Google AI Studio Direct Export (Recommended)
1. In the upper-right corner of the **Google AI Studio** workspace, click on the **Export** / **Settings** menu.
2. Select **Export to ZIP** to download the complete codebase directly to your computer.
3. Alternatively, choose **Export to GitHub** to link and sync directly with your GitHub account.

### Method 2: Git Clone
Once pushed to your GitHub repository:
```bash
git clone https://github.com/kiiruelvis4/little-roses-eduhub.git
```

---

## 🏫 Little Roses Academy Nakuru
*Teach • Assess • Excel*
