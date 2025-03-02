/*
import { colors, spacing, typography } from "app/theme"
import { Animated, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Text } from "app/components/Text"
import React, { useMemo } from "react"
import profilePic from "assets/images/profile-pic.jpg"

interface DynamicHeaderProps {
  value: Animated.Value,
  name: string,
  totalExpenses: number,
  topInset: number
}

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export const DynamicHeader = ({ value, name, totalExpenses, topInset }: DynamicHeaderProps) => {
  const ADJUSTED_MAX_HEIGHT = HEADER_MAX_HEIGHT + topInset
  const ADJUSTED_MIN_HEIGHT = HEADER_MIN_HEIGHT + topInset
  const ADJUSTED_SCROLL_DISTANCE = ADJUSTED_MAX_HEIGHT - ADJUSTED_MIN_HEIGHT

  const animatedHeaderHeight = value.interpolate({
    inputRange: [0, ADJUSTED_SCROLL_DISTANCE],
    outputRange: [ADJUSTED_MAX_HEIGHT, ADJUSTED_MIN_HEIGHT],
    extrapolate: 'clamp',
  })

  const animatedHeaderColor = value.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [colors.palette.primary500, colors.elevatedBackground],
    extrapolate: 'clamp',
  });

  const animatedBorderRadius = value.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [spacing.sm, 0],
    extrapolate: 'clamp',
  })

  const showPreHeader = useMemo(() =>
    value.interpolate({
      inputRange: [SCROLL_DISTANCE - 50, SCROLL_DISTANCE],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }), []);

  return (
    <Animated.View
      style={[
        $header,
        {
          height: animatedHeaderHeight,
          backgroundColor: animatedHeaderColor,
          paddingTop: topInset,
          borderBottomRightRadius: animatedBorderRadius,
          borderBottomLeftRadius: animatedBorderRadius,
        },
      ]}>
      <Animated.View
        style={[$headerContainerPre, { opacity: showPreHeader }]}>
        <Text preset="subheading" style={$headerTitle}>
          Spent this month:
        </Text>
        <Text
          style={$headerTotalExpense}
        >
          {totalExpenses} €
        </Text>
      </Animated.View>

      <Animated.View
        style={[$topContainer, {
          opacity: value.interpolate({
            inputRange: [SCROLL_DISTANCE - 50, SCROLL_DISTANCE],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })
        }]}>
        <View style={$profileHeaderContainer}>
          <View style={$profilePictureContainer}>
            <Image source={profilePic} style={$profilePicture} />
          </View>
          <View style={$textHeaderContainer}>
            <Text style={$profileHeadingText} preset="default">Welcome back,</Text>
            <Text style={$profileSubheadingText} preset="subheading">{name}</Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const $headerContainerPre: ViewStyle = {
  position: "absolute",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: spacing.md,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
}

const $headerTitle: TextStyle = {
  color: colors.palette.neutral100,
  fontFamily: typography.fonts.spaceGrotesk.medium,
  fontSize: 20,
}

const $header: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
}

const $topContainer: ViewStyle = {
  position: "absolute",
  width: "100%",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
}

const $profileHeaderContainer: ViewStyle = {
  flexDirection: "row",
  gap: spacing.sm,
}

const $textHeaderContainer: ViewStyle = {
  justifyContent: "center",
  marginRight: spacing.xs,
}

const $headerTotalExpense: TextStyle = {
  color: colors.palette.neutral100,
  fontFamily: typography.fonts.spaceGrotesk.medium,
  fontSize: 56,
  lineHeight: 56,
}

const $profilePictureContainer: ViewStyle = {
  width: 50,
  height: 50,
  borderRadius: 25,
  overflow: 'hidden',
}

const $profilePicture: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $profileHeadingText: TextStyle = {
  color: colors.palette.neutral600,
}

const $profileSubheadingText: TextStyle = {
}*/
