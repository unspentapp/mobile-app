import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
// import { useStore, validationErrorSelector } from "app/store"
import { useAuth } from "app/services/auth/useAuth"
import { logger } from "@nozbe/watermelondb/utils/common"
interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const SignUpScreen: FC<LoginScreenProps> = () => {
  const authPasswordInput = useRef<TextInput>(null)
  const { signUp } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)

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

  const signup = async () => {
    setIsSubmitted(true)

    // if (validationError) return

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    const result = await signUp({ email, password })
    if (result.data.session !== null ) {
      // todo test!!
      logger.log("[SIGNED UP] Token: " + result.data.session.access_token)
      setIsSubmitted(false)
      setPassword("")
      setEmail("")
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
      <Text
        testID="login-heading"
        tx="signUpScreen.title"
        preset="heading"
        style={$logIn} />
      <Text
        tx="signUpScreen.enterDetails"
        preset="subheading"
        style={$enterDetails}
      />
      {/*{attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />}*/}

      <TextField
        value={email}
        onChangeText={setEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="signUpScreen.emailFieldLabel"
        placeholderTx="signUpScreen.emailFieldPlaceholder"
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
        labelTx="signUpScreen.passwordFieldLabel"
        placeholderTx="signUpScreen.passwordFieldPlaceholder"
        onSubmitEditing={signup}
        RightAccessory={PasswordRightAccessory}
      />

       <Button
        testID="login-button"
        tx="signUpScreen.tapToSignUp"
        style={$tapButton}
        preset="filled"
        onPress={signup}
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
