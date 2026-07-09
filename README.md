# RN Task Tracker App

A polished React Native finance and task-tracking experience built with Expo, Clerk authentication, Zustand state management, and a clean mobile-first UI.

## Overview

This app helps users capture transactions, review account activity, and manage money in a simple, modern experience. The product has been refined beyond a basic starter app with a more premium visual system, structured flow, and clearer product feel.

## Architecture Overview

```text
User Interface
  └─ Expo Router screens (auth, dashboard, create, transaction detail)
       └─ App state layer
            └─ Zustand store
                 └─ Data hooks / services
                      └─ Backend API
                           └─ Transaction and summary data
```

### Data flow

1. The mobile UI renders screens through Expo Router.
2. The app loads transaction and summary data through the data hook.
3. State is managed with Zustand for a simple, predictable client-side flow.
4. Create, update, and delete actions call the backend API.
5. The UI updates from the refreshed data and current state.

## Modern Tech Stack

- React Native + Expo
- Expo Router
- Zustand
- Clerk authentication
- React Native Gesture Handler + Reanimated
- Expo Secure Store
- Node.js / Express backend

## Key Enhancements Beyond MVP

Some of the custom product improvements implemented include:

- A more premium visual identity with polished auth, dashboard, and entry screens.
- Stronger transaction experience with clearer detail views and better formatting.
- Improved entry flow for faster task and money capture.
- Cleaner app organization with separate UI, data, and service layers.
- A more professional developer experience through structured screens, reusable components, and documentation.

## Getting Started

### Mobile app

```bash
cd mobile
npm install
npx expo start
```

### Backend

```bash
cd backend
npm install
node src/server.js
```

## Project Structure

```text
mobile/
  app/              # screens and route-based pages
  components/       # reusable UI elements
  hooks/            # data fetching and app logic
  services/         # API and helper services
  store/            # Zustand state
  assets/           # styles, images, and fonts
backend/
  src/              # server, routes, controllers, and config
```
