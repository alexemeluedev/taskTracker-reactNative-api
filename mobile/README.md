# Expense Tracker 📱

A modern mobile expense-tracking application built with **React Native and Expo**, designed to help users manage, record, and monitor their personal expenses from an Android device.

The application uses a production backend hosted on **Render** and is configured for Android builds through **Expo Application Services (EAS)**.

---

## 🚀 Features

- 🔐 User authentication with Clerk
- 💰 Create and record expenses
- 📊 View expense and transaction history
- 🔎 View individual transaction details
- 🗂️ Organize and manage financial records
- 🔄 Real-time communication with the production backend
- 📱 Android APK distribution
- ☁️ Production backend hosted on Render
- ⚡ Built with Expo SDK 54

---

## 🛠️ Tech Stack

### Mobile

- React Native
- Expo SDK 54
- Expo Router
- JavaScript
- EAS (Expo Application Services)

### Authentication

- Clerk

### Backend

- Node.js
- Express.js
- REST API
- Render

### Data & Infrastructure

- Neon PostgreSQL
- Upstash Redis

---

## 📁 Project Structure

```text
ExpenseTracker_App/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── mobile/
│   ├── app/
│   ├── components/
│   ├── constants/
│   ├── assets/
│   ├── app.json
│   ├── eas.json
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Expo CLI / EAS CLI
- Git

You will also need the required environment variables for Clerk and any other services used by the application.

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/alexemeluedev/taskTracker-reactNative-api.git
```

Navigate to the mobile application:

```bash
cd taskTracker-reactNative-api/mobile
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run the Development App

Start the Expo development server:

```bash
npx expo start
```

You can then run the application using:

- Android emulator
- iOS simulator
- Physical device
- Development build

> The production application is configured to communicate with the deployed Render backend.

---

## 🌐 Production API

The mobile application is configured to use the production API:

```text
https://expensetracker-hpi4.onrender.com/api
```

The backend is hosted on Render.

---

## 📱 Android APK

A production Android APK has been built using **EAS Build**.

### Download the latest APK

The APK can be downloaded from the project's EAS build page:

**[Download / Install Expense Tracker APK](https://expo.dev/accounts/alexemelue.dev/projects/nova-ledger/builds/88577e5e-7228-47da-9075-04a44a1b0dcf)**

Open the link on an Android device and follow the installation instructions.

### Installing the APK

1. Download the APK to your Android device.
2. Open the downloaded `.apk` file.
3. If Android asks for permission to install from an unknown source, allow it for the application you're using to open the APK.
4. Tap **Install**.
5. Open **Expense Tracker**.

---

## 🏗️ Building the Android APK

The project uses EAS Build.

From the `mobile` directory:

```bash
eas build --platform android --profile preview
```

The `preview` profile is configured to generate an installable Android APK.

---

## 🔑 Environment Variables

The mobile application uses environment variables for configuration.

Create a `.env` file inside the `mobile` directory and configure the required values.

Example:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

> **Important:** Never commit `.env` files containing private credentials, API secrets, database passwords, or other sensitive information to GitHub.

---

## 🧪 Project Health

The project currently passes Expo's dependency validation:

```text
18/18 checks passed. No issues detected!
```

The Android release build has also been successfully completed through EAS.

---

## 🔄 Development Workflow

Typical development workflow:

```bash
cd mobile
npm install
npx expo start
```

For an Android APK:

```bash
eas build --platform android --profile preview
```

---

## 📚 Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [Clerk Documentation](https://clerk.com/docs)

---

## 👨‍💻 Author

**Alex Emelue**

Web & Mobile Developer

---

## 📄 License

This project is currently intended for personal and educational development purposes.
