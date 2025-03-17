
export type OnboardingItem = {
  key: number,
  title: string,
  description: string,
  image: string,
}

const DATA: OnboardingItem[] = [
  {
    key: 1,
    title: "End Money Stress for Good",
    description: "Stop wondering where your money went. Unspent transforms financial anxiety into confidence with tracking that actually feels good.",
    image: require("../assets/images/onboarding/welcome.png")
  },
  {
    key: 2,
    title: "Start Your Journey",
    description: "Begin with lightning-fast expense logging, customizable categories, and monthly budgets that fit your real life.",
    image: require("../assets/images/onboarding/journey.png")
  },
  {
    key: 3,
    title: "Grow & Master Your Finances",
    description: "Watch your progress through visual insights, celebrate savings milestones, and develop money habits that last.",
    image: require("../assets/images/onboarding/rocket.png")
  },
  {
    key: 4,
    title: "",
    description: "How should we call you?",
    image: require("../assets/images/onboarding/username.png")
  }
]

export default DATA