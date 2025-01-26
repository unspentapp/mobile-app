# Unspent: Build in Public!

[![Development Status](https://img.shields.io/badge/Status-In%20Development-yellow)]()

Welcome to the Unspent App build in public. This repository documents the development journey and major updates as they happen.

## Tech Stack (for now)
- [React Native](https://reactnative.dev/)
- [Ignite](https://github.com/infinitered/ignite): React Native + Expo boilerplate
- [WatermelonDB](https://github.com/Nozbe/WatermelonDB): local database + sync
- [Supabase](https://supabase.com): authentication and data persistence
- ~~[Zustand](https://github.com/pmndrs/zustand)~~

## Build Journey

**Next Steps:**
- [ ] Internationalization (i18n): Replace hardcoded text with dynamic translation keys to support multiple languages
- [ ] persist session data with watermelondb (WIP)
- [x] ~~Implement the app basic logic and local storage for temporary persistence~~
- [x] ~~Polish the expense input screen~~
- [x] ~~Implement the home screen (expenses list view)~~

### January 26th, 2025
- Just squashed some bugs 🐛 and conquered Typescript's tricky terrain  
- Watermelon DB is now fully operational, with user sessions encrypted and decrypted like a secret agent's diary! 🕵️‍♀️
- We've implemented the full transaction lifecycle - saving, updating, and deleting on WMdb.
- Android emulator debugging? Total nightmare 😭 After two days of digital detective work, Android Studio App Inspector emerged as our debugging superhero. 🦸‍♂️

<img src="docs%2Fresources%2F2025-01-26.png" width="500"/>


### January 18th, 2025
- Bumped Expo to v52 and cleaned up all deps 📦

- Finally got WatermelonDB up and running 🎉 I must say, this was quite a journey! This task took several days due to unclear documentation and complex setup requirements

- Dropped Zustand from the codebase ⚡️ Plot twist: turns out WatermelonDB's observables are all we need for state management. It handles re-renders like a boss when props update. Kinda sad to let Zustand go (was hyped to try it), but hey - saving it for the web app (spoiler? 👀)

- Shipped auth flow with Supabase 🔐 Got basic signin/signup screens working. They're pretty barebones right now and need some UI love, but the core functionality is solid

- Last but not least, decided to spice up these build-in-public updates with a more fun tone - as you can probably tell from this post! 🎨 No more dry tech updates, let's keep it real and enjoyable!

<img src="docs%2Fresources%2F2025-01-18.png" width="200"/>

### January 13th, 2025
Added home screen functionality with categorized expense tracking. The current implementation includes a progress bar showing each category's percentage of total expenses. In future updates, this will be updated to display spending against allocated category budgets. While the basic functionality is in place, the UI/UX will be further refined.

_Note. The screenshots show dummy data for demonstration purposes._

<div style="display: flex; flex-direction: row; gap: 10px">
    <img src="docs%2Fresources%2F2025-01-13.png" width="200"/>
    <img src="docs%2Fresources%2F2025-01-13%20%282%29.png" width="200"/>
</div>

### December 24nd, 2024
Added hard coded category tabs (and logic to select a category) in _Add new expense modal_ and implemented the state management logic with [Zustand](https://github.com/pmndrs/zustand). I also optimize the flow for adding a new expense as I want the user to perform as little effort as possible in this action.

### December 22nd, 2024
Added date picker to the Add new expense modal thanks to [react-native-calendars](https://github.com/wix/react-native-calendars) module.

<div style="display: flex; flex-direction: row; gap: 10px">
    <img src="docs%2Fresources%2F2024-12-22.png" width="200"/>
    <img src="docs%2Fresources%2F2024-12-22%281%29.png" width="200"/>
</div>

### December 21st, 2024
Completed initial project setup using [Ignite boilerplate](https://github.com/infinitered/ignite), chosen to accelerate development despite being new to React Native and mobile development.

Key modifications to the boilerplate:
- Migrated from MobX to [Zustand](https://github.com/pmndrs/zustand) for state management
- Added [WatermelonDB](https://github.com/Nozbe/WatermelonDB) for local-first data management
- Attempted Nativewind integration (reverted to Ignite's theming system due to compatibility issues)

Achievements:
- Created the core expense input modal, which will be the primary interface for adding expenses (and future income entries)
- Gained foundational knowledge in React Native and mobile development

**Next Steps:**
- Polish the expense input screen
- Implement the home screen (expenses list view)

