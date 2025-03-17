
const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
    today: "Today",
    yesterday: "Yesterday",
  },
  welcomeScreen: {
    exciting: "(ohh, this is exciting!)",
    welcome: "Welcome!",
    description: "Managing your finances has never been so easy",
    name: "How should I call you?"
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "It's not you, it's us :(",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },

  errors: {
    invalidEmail: "Invalid email address.",
  },
  signInScreen: {
    title: "Welcome back",
    enterDetails:
      "Enter your details below",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Email",
    passwordFieldPlaceholder: "Password",
    tapToLogIn: "Login",
    loading: "Logging in...",
    forgotPassword: "Forgot your password?",
  },
  signUpScreen: {
    title: "Create an account",
    enterDetails:
      "Enter your details below",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    confirmPasswordFieldLabel: "Confirm password",
    emailFieldPlaceholder: "Email",
    passwordFieldPlaceholder: "Password",
    loading: "Creating account...",
    tapToSignUp: "Create account",
    goToSignIn: "Already have an account? Log in",
  },
  mainNavigator: {
    expensesTab: "Expenses",
    analyticsTab: "Analytics",
    settingsTab: "Settings",
  },
  homeScreen: {
    title: "Hello",
    seeAll: "See all",
    addCategory: "Add new category",
    monthReview: {
      title: "Spent this month",
    }
  },
  settingsScreen: {
    howTo: "HOW TO",
    title: "Settings",
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  addExpenseModal: {
    title: "Add expense",
    noteInputPlaceholder: "Add a note",
    categoryLabel: "Select category",
    addExpenseButton: "Add Expense",
  },
  analyticsScreen: {
    title: "Analytics",
  },
  allTransactionsScreen: {
    title: "Transactions",
    noItems: "No transaction found."
  },
  addNewCategoryModal: {
    title: "Add new category",
    noteInputPlaceholder: "Category name",
    selectColor: {
      title: "Select a color",
      hint: "",
    },
  },
  transactionDetails: {
    title: "Transaction Details",
    note: "Note",
    amount: "Amount",
    type: "Transaction Type",
    category: "Category",
    date: "Date",
    expenseType: "Expense",
    incomeType: "Income",
  }
}

export default en
export type Translations = typeof en
