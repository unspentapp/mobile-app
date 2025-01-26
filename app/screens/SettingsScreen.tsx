import React, { FC } from "react"
import * as Application from "expo-application"
import { Platform, TextStyle, View, ViewStyle } from "react-native"
import { Button, ListItem, Screen, Text } from "app/components"
import { colors, spacing } from "app/theme"
import { MainTabScreenProps } from "app/navigators/MainNavigator"
import { useAuth } from "app/services/auth/useAuth"
import database from "../../db"
import { logger } from "@nozbe/watermelondb/utils/common"

/**
 * @returns {void} - No return value.
 * @param _props
 */
// function openLinkInBrowser(url: string) {
//   Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
// }

export const SettingsScreen: FC<MainTabScreenProps<"Settings">> = function SettingsScreen(_props) {

  const { signOut } = useAuth()

  const wipeDB = async () => {
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
  }
  const fetchAuthSessionRecords = async () => {
    const results = await database.collections.get('auth_session').query().fetch()
    const sessionData = JSON.parse(results[0]._raw.session)
    logger.log(sessionData)
  }

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
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      {/*      <Text
        style={$reportBugsLink}
        tx="demoDebugScreen.reportBugs"
        onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite/issues")}
      /> */}
      <Text style={$title} preset="heading" tx="settingsScreen.title" />
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
        <Button style={$button} tx="common.logOut" onPress={signOut} />
      </View>
      <View style={$buttonContainer}>
        <Button preset="reversed" text="Fetch Auth Data" onPress={fetchAuthSessionRecords} />
      </View>
      <View style={$buttonContainer}>
        <Button preset="filled" text="Wipe Database Data" onPress={wipeDB} />
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.xxl,
}

const $item: ViewStyle = {
  marginBottom: spacing.md,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.xl,
}

const $button: ViewStyle = {
  marginBottom: spacing.xs,
}

const $buttonContainer: ViewStyle = {
  marginBottom: spacing.md,
}

const $hint: TextStyle = {
  color: colors.palette.neutral600,
  fontSize: 12,
  lineHeight: 15,
  paddingBottom: spacing.lg,
}
