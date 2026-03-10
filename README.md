# Project Expense Tracker (User App) — Hybrid (React Native + Expo)

This repository contains the **Hybrid User application** for Coursework 1.
The User app allows users to **browse projects from Firebase Realtime Database**, **search by name/date**, **favourite projects**, and **add expenses** to projects.

---

## Features

### Feature (g) — Browse Projects from Cloud

* Fetch project list from **Firebase Realtime Database**
* Display projects in a list

### Feature (g) — Search

* Search projects by:

  * **Project name / description**
  * **Date** (supports partial input like `2026-03`)

### Feature (h) — Favourite Projects

* Favourite (⭐) projects for quick access
* Favourites are stored in Firebase RTDB under the signed-in user:
  `userFavourites/<uid>/<projectId> = true`
* Favourites appear in the **Favorites** tab

### Add Expense (User submits expenses)

* Users can add expenses to:
  `projects/<projectId>/expenses/<expenseId>`

---

## Tech Stack

* **React Native (Expo)**
* **Expo Router** (file-based routing)
* **Firebase JS SDK**

  * Realtime Database
  * Anonymous Authentication

---

## Firebase Setup

### 1) Create / use the same Firebase project as the Admin app

In Firebase Console enable:

* **Realtime Database**
* **Authentication → Anonymous**

### 2) Add a Web App (to get `firebaseConfig`)

Firebase Console → Project Settings → **Your apps** → **Add app → Web**
Copy the provided `firebaseConfig` object.

### 3) Realtime Database Rules (recommended)

```json
{
  "rules": {
    "projects": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "userFavourites": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

---

## Local Config File (Required)

For security/clean GitHub repo, **`constants/firebase.ts` is ignored** and not committed.

### Step A: Create config file

1. Copy:

* `constants/firebase.example.ts`

2. Paste as:

* `constants/firebase.ts`

### Step B: Paste your Firebase Web config

Open `constants/firebase.ts` and replace the placeholder values with your real `firebaseConfig`.

---

## Install & Run

### Install dependencies

```bash
npm install
```

### Run (Web)

```bash
npx expo start
```

### Run (iOS via Expo Go)

If LAN connection fails, use tunnel:

```bash
npx expo start --tunnel --clear
```

Scan the QR code using **Expo Go**.

### Run (Android Emulator)

1. Start Android emulator from Android Studio Device Manager
2. Run:

```bash
npx expo start --clear
```

Press `a` to open Android

---

## App Routes (Expo Router)

* `app/(Projects)/index.tsx` — Projects list + search + favourite toggle
* `app/(Projects)/explore.tsx` — Favorites tab
* `app/project/[projectId].tsx` — Project details + expenses list
* `app/project/[projectId]/add-expense.tsx` — Add expense form

---

## Demo Flow (Suggested)

1. Upload projects from Admin app to Firebase RTDB
2. Open User app → browse projects
3. Search by name/date
4. Favourite a project → check Favorites tab
5. Add an expense to a project
6. Admin app can use “Sync from Cloud” to pull user expenses into SQLite (optional enhancement)

---

## Author

**Kaung Set Linn**
