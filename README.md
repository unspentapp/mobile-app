# Unspent: Build in Public!

[![Development Status](https://img.shields.io/badge/Status-In%20Development-yellow)]()

Welcome to the Unspent App build in public. This repository documents the development journey and major updates as they happen.

## Tech Stack (for now)
- [React Native](https://reactnative.dev/)
- [Ignite](https://github.com/infinitered/ignite)
- [Zustand](https://github.com/pmndrs/zustand)
- [WatermelonDB](https://github.com/Nozbe/WatermelonDB)

## Build Journey

**Next Steps:**
- Remove that awful black space at the bottom of the calendar
- Polish the expense input screen
- Implement the home screen (expenses list view)

### December 22nd, 2024
Added date picker to the Add new expense modal thanks to [react-native-calendars](https://github.com/wix/react-native-calendars) module.

<img src="docs%2Fresources%2F2024-12-22.png" width="200"/>
<img src="docs%2Fresources%2F2024-12-22%281%29.png" width="200"/>

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

