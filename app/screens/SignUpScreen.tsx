import React, { ComponentType, FC, useMemo, useRef, useState } from "react"
import { Dimensions, ImageStyle, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { AutoImage, Button, Icon, Text, TextField, TextFieldAccessoryProps } from "../components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
// import { useStore, validationErrorSelector } from "app/store"
import { useAuth } from "app/services/auth/useAuth"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"


const { width } = Dimensions.get("screen")


interface SignUpScreenProps extends AppStackScreenProps<"Signup"> {}

export const SignUpScreen: FC<SignUpScreenProps> = () => {
  const { top } = useSafeAreaInsets()
  const navigation = useNavigation()

  const authPasswordInput = useRef<TextInput>(null)
  const { signUp } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // const validationError = useStore(validationErrorSelector);

  // const error = isSubmitted ? validationError : ""


  /*
  * todo:
  *  1. input validation
  *  2. fix: keyboard not shifting content above
  *  3. Show password on the single input, not both
  * */
  const signup = async () => {

    setIsSubmitted(true)
    console.log("SIGNIN UP")
    if (password.trim() !== confirmPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Password and confirm password do not match",
      })
      setConfirmPassword("")
      return
    }

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    const result = await signUp({ email, password })
    console.log(JSON.stringify(result))
    if (result.data.session !== null ) {
      Toast.show({
        type: "success",
        text1: "Account created successfully",
        text2: "Welcome to Unspent!"
      })

      setIsSubmitted(false)
      setPassword("")
      setEmail("")

    } else if (result.error) {
      Toast.show({
        type: "error",
        text1: "Oh no, there was an error",
        text2: result.error.message
      })
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
    <View style={$screenContainer}>
      <View style={[$container, { paddingTop: top }]}>
        <View style={$imageContainer}>
          <AutoImage source={require("../../assets/images/onboarding/signup.png")} style={$image}/>
        </View>
        <View style={$bottomContainer}>
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
          {/* {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />} */}

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
            onSubmitEditing={() => authPasswordInput.current?.focus()}
            RightAccessory={PasswordRightAccessory}
          />

          <TextField
            ref={authPasswordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            secureTextEntry={isAuthPasswordHidden}
            labelTx="signUpScreen.confirmPasswordFieldLabel"
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

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text tx="signUpScreen.goToSignIn" preset="formHelper" style={$goToSignInLink} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $container: ViewStyle = {
  flex: 1,
}

const $imageContainer: ViewStyle = {
  flex: 0.4,
  alignItems: "center",
  justifyContent: "center",
}

const $image: ImageStyle = {
  width: width / 1.5,
  height: width / 1.5,
  resizeMode: "contain",
}

const $bottomContainer: ViewStyle = {
  flex: 0.6,
  paddingHorizontal: spacing.md,
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

const $goToSignInLink: TextStyle = {
  marginVertical: spacing.xs,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
