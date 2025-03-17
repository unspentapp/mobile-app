import { NavigatorScreenParams } from "@react-navigation/native"
import { MainTabParamList } from "app/navigators"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type AuthStackParamList = {
  Onboarding: undefined
  Login: undefined
  Signup: undefined
  ForgotPassword?: undefined
}

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>
  App: NavigatorScreenParams<AppStackParamList>
}


export type AppStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>
  TransactionDetails: {
    itemId: string | undefined;
  };
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>