# LITTLE ROSES ACADEMY 🌹
> **LITTLE ROSES ACADEMY NAKURU • CBC EduHub: Teach, Assess, Excel**

A comprehensive, offline-first Progressive Web App (PWA) and complete educational management platform engineered for teachers, learners, parents, and administrative leadership at **Little Roses Academy** under the Kenyan Competency-Based Curriculum (CBC / CBE).

---

## 🌟 Key Features & Modules

### 1. Teacher Workstation
- **Automated CAT & Summative Assessment Entry**:
  - Continuous Assessment Test (CAT 1, CAT 2) and End-Term examination grading with instant calculation.
  - Automated 4-tier CBC performance rubric:
    - **EE** (Exceeding Expectation: 80–100%)
    - **ME** (Meeting Expectation: 65–79%)
    - **AE** (Approaching Expectation: 50–64%)
    - **BE** (Below Expectation: 0–49%)
- **Dynamic Assessment Remarks**:
  - Context-aware automated teacher remarks based on competency strengths and improvement recommendations.
- **Weekly Timetable Engine**:
  - Visual period schedule with live current-period indicators and subject navigation.
- **Schemes of Work & Notes**:
  - Lesson plan outlines and revision materials aligned to KICD designs.

---

### 2. Learner & Parent Portal
- **Learner Dashboard**:
  - Comprehensive subject performance breakdowns and competency level tracking.
- **Interactive Revision Quizzes**:
  - Real-time quiz challenges across CBE learning areas with instant answer evaluations.
- **Digital CBC Curriculum Library**:
  - Offline-accessible textbooks, revision past papers, and study guides.
- **Official Circulars & Notices**:
  - School announcements, term opening/closing dates, and event schedules.

---

### 3. Executive Administrative Dashboard (100% Offline Enabled)
- **Learner Management**:
  - Complete offline enrollment directory: add, edit, and search learners across Playgroup to Grade 6 with parental contacts and admission numbers.
- **Staff & Faculty Roster**:
  - Teacher subject allocation and workstation credentials management.
- **CBE Curriculum Structure Configuration**:
  - Edit and manage Lower Primary (Grades 1–3) and Upper Primary (Grades 4–6) learning areas.
  - KPSEA Grade 6 examination scheduling and Targeter/Jesma exam series coordination.
- **School Profile & Metadata**:
  - Update school motto, postal address (P.O. Box 3443 Nakuru), official phone numbers, and email.
- **Offline Data Engine & Backups**:
  - Instant synchronization between in-memory state, Web Storage, and local SQLite/database persistence.
  - Full JSON export and one-click database restore capability.

---

### 4. Security & Role-Based Access Control (RBAC)
- **Administrator**: Complete administrative rights across official curriculum designs, master records, fee structures, and school configurations.
- **Teacher**: Personalized faculty login with assigned learning areas and grade assessments.
- **Learner / Parent**: Direct access to personalized academic progress, learning materials, and official circulars.
- **Zero Exposed Secrets**: All sensitive credentials and administrative passcodes are masked in the UI.

---

### 5. Multi-Platform PWA & Offline Support
- **Full Offline Operations**: Operates continuously without active internet connection via Service Worker caching.
- **Installable Desktop & Mobile App**: Install directly from Chrome, Edge, Safari, or mobile browsers as a standalone application.
- **Android APK Package**: Bundled ready-to-install Android APK (`LittleRosesEduHub.apk`) located in `public/`.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- `npm` or `pnpm` or `yarn`

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/kiiruelvis4/LITTLE-ROSES-ACADEMY.git

# 2. Navigate to the project directory
cd LITTLE-ROSES-ACADEMY

# 3. Install project dependencies
npm install

# 4. Launch the local development server
npm run dev
```

Open `http://localhost:3000` in your web browser to view the application.

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

This compiles all TypeScript assets and bundles client files into the `dist/` directory.

---

## 🔗 Pushing to GitHub

To push your repository to GitHub under **LITTLE-ROSES-ACADEMY**:

```bash
# 1. Initialize git if not already present
git init

# 2. Add all project files
git add .

# 3. Commit changes
git commit -m "feat: Initial commit for LITTLE ROSES ACADEMY educational portal"

# 4. Set default branch to main
git branch -M main

# 5. Add your GitHub remote repository (replace with your exact GitHub URL)
git remote add origin https://github.com/kiiruelvis4/LITTLE-ROSES-ACADEMY.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📥 Exporting / Downloading Options

1. **Google AI Studio Direct Export**:
   - In Google AI Studio, click on **Settings / Export** in the top navigation.
   - Select **Export to GitHub** to sync directly with your repository, or choose **Download ZIP** to save the full source archive.
2. **Direct Download from the App**:
   - Within the running app, access the top-right menu **(⋮)** and select **Download Source Code (ZIP)**.

---

## 🏫 Little Roses Academy
*P.O. Box 3443 Nakuru • Teach • Assess • Excel*
