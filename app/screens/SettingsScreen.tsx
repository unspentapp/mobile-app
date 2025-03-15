import React, { FC } from "react"
import * as Application from "expo-application"
import { Platform, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Icon, ListItem, Text } from "app/components"
import { colors, spacing } from "app/theme"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import { useAuth } from "app/services/auth/useAuth"
import database from "../../db"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"
import { goBack } from "app/navigators"

/**
 * @returns {void} - No return value.
 * @param _props
 */
// function openLinkInBrowser(url: string) {
//   Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
// }

export const SettingsScreen: FC<MainTabScreenProps<"Settings">> = function SettingsScreen(_props) {
  const { top } = useSafeAreaInsets()

  const { signOut } = useAuth()

  const wipeDB = async () => {
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
  }
/*  const fetchAuthSessionRecords = async () => {
    const results = await database.collections.get('auth_session').query().fetch()
    const sessionData = JSON.parse(results[0]._raw.session)
    // logger.log(sessionData)
  } */

  const usingHermes = typeof HermesInternal === "object" && HermesInternal !== null
  // @ts-expect-error
  const usingFabric = global.nativeFabricUIManager != null

  const reactotron = React.useMemo(
    () => async () => {
      if (__DEV__) {
        console.tron.display({
          name: "DISPLAY",
          value: {
            appId: Application.applicationId,
            appName: Application.applicationName,
            appVersion: Application.nativeApplicationVersion,
            appBuildVersion: Application.nativeBuildVersion,
            hermesEnabled: usingHermes,
          },
          important: true,
        })
      }
    },
    [],
  )

  return (
    <View style={$screenContainer}>
      <View style={[$container, { paddingTop: top }]}>
        <View style={$topContainer}>
          <TouchableOpacity
            style={$goBackButton}
            onPress={goBack}
          >
            <Icon icon={"back"} />
          </TouchableOpacity>
          <Text testID="transactions-heading" tx={"allTransactionsScreen.title"} preset="heading" />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={$itemsContainer}>
            <ListItem
              LeftComponent={
                <View style={$item}>
                  <Text preset="bold">App Id</Text>
                  <Text>{Application.applicationId}</Text>
                </View>
              }
            />
            <ListItem
              LeftComponent={
                <View style={$item}>
                  <Text preset="bold">App Name</Text>
                  <Text>{Application.applicationName}</Text>
                </View>
              }
            />
            <ListItem
              LeftComponent={
                <View style={$item}>
                  <Text preset="bold">App Version</Text>
                  <Text>{Application.nativeApplicationVersion}</Text>
                </View>
              }
            />
            <ListItem
              LeftComponent={
                <View style={$item}>
                  <Text preset="bold">App Build Version</Text>
                  <Text>{Application.nativeBuildVersion}</Text>
                </View>
              }
            />
            <ListItem
              LeftComponent={
                <View style={$item}>
                  <Text preset="bold">Hermes Enabled</Text>
                  <Text>{String(usingHermes)}</Text>
                </View>
              }
            />
            <ListItem
              LeftComponent={
                <View style={$item}>
                  <Text preset="bold">Fabric Enabled</Text>
                  <Text>{String(usingFabric)}</Text>
                </View>
              }
            />
          </View>
          <View style={$buttonContainer}>
            <Button style={$button} tx="settingsScreen.reactotron" onPress={reactotron} />
            <Text style={$hint} tx={`settingsScreen.${Platform.OS}ReactotronHint` as const} />
          </View>
          <View style={$buttonContainer}>
            <Button style={$button} text={"Toast error"} onPress={ () =>
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "This is text 2 example",
              })
            } />

            <Button style={$button} text={"Toast success"} onPress={ () =>
              Toast.show({
                type: "success",
                text1: "Success!",
                text2: "This is text 2 example",
              })
            } />

            <Button style={$button} text={"Toast info"} onPress={ () =>
              Toast.show({
                type: "info",
                text1: "Info!",
                text2: "This is text 2 example",
              })
            } />
          </View>
          <View style={$buttonContainer}>
            <Button style={$button} tx="common.logOut" onPress={signOut} />
          </View>
          <View style={$buttonContainer}>
            <Button preset="filled" text="Wipe Database Data" onPress={wipeDB} />
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
}

const $topContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
  justifyContent: "flex-start",
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.sm,
}

const $goBackButton: ViewStyle = {
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xs,
}

const $item: ViewStyle = {
  marginBottom: spacing.md,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $button: ViewStyle = {
  marginBottom: spacing.xs,
}

const $buttonContainer: ViewStyle = {
  marginBottom: spacing.md,
  paddingHorizontal: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.palette.neutral600,
  fontSize: 12,
  lineHeight: 15,
  paddingBottom: spacing.lg,
}
