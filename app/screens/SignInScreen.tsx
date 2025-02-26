import React, { ComponentType, FC, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
// import { useStore, validationErrorSelector } from "app/store"
import { useAuth } from "app/services/auth/useAuth"
import { log } from "../utils/logger"
interface SignInScreenProps extends AppStackScreenProps<"Login"> {}

export const SignInScreen: FC<SignInScreenProps> = () => {
  const authPasswordInput = useRef<TextInput>(null)
  const { signIn } = useAuth()

  const [email, setEmail] = useState("test4@test.com")
  const [password, setPassword] = useState("testtest")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)

  // we can also use multiple hooks
  // const validationError = useStore(validationErrorSelector);

  /*useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setEmail("ignite@infinite.red")
    setPassword("ign1teIsAwes0m3")

    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setPassword("")
      setEmail("")
    }
  }, [])*/

  // const error = isSubmitted ? validationError : ""

  const login = async () => {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    // if (validationError) return

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    const result = await signIn({ email, password })
    if (result.data.session !== null ) {
      // todo test!!
      log.info("SIGNED IN with email " + result.data.session.user.email)
      setPassword("")
      setEmail("")
      setIsSubmitted(false)
    }

  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx={"signInScreen.title"} preset="heading" style={$logIn} />
      <Text tx="signInScreen.enterDetails" preset="subheading" style={$enterDetails} />
      {/*{attemptsCount > 2 && <Text tx="signInScreen.hint" size="sm" weight="light" style={$hint} />}*/}

      <TextField
        value={email}
        onChangeText={setEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="signInScreen.emailFieldLabel"
        placeholderTx="signInScreen.emailFieldPlaceholder"
        // helper={error}
        // status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={password}
        onChangeText={setPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="signInScreen.passwordFieldLabel"
        placeholderTx="signInScreen.passwordFieldPlaceholder"
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <TouchableOpacity
        // todo: implement forgot password screen
        onPress={() => log.info("Forgot password")}
      >
        <Text tx="signInScreen.forgotPassword" preset="formHelper" style={$forgotPassword} />
      </TouchableOpacity>

      <Button
        testID="signIn-button"
        tx={isSubmitted ? "signInScreen.loading" : "signInScreen.tapToLogIn"}
        style={$tapButton}
        preset="filled"
        onPress={login}
      />
    </Screen>
  )
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $logIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.md,
}

const $forgotPassword: TextStyle = {
  marginBottom: spacing.xl,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
