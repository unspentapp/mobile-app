import { BlurView } from '@react-native-community/blur';
import { Modal, Platform, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import React, { useState } from "react"
import { Calendar } from "react-native-calendars"
import { Icon, Text } from "app/components"
import Animated, {
  FadeIn,
  FadeOut,
  withSpring,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import { isThisMonth } from "date-fns"
import format from "date-fns/format"

type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export const CalendarModal = ({ visible, onClose, date, setDate }: CalendarModalProps) => {
  const [isBackButtonVisible, setIsBackButtonVisible] = useState<boolean>(false)

  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const backButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isBackButtonVisible ? 1 : 0, { duration: 100 }), // Faster fade
      transform: [
        {
          scale: withSpring(isBackButtonVisible ? 1 : 0.8, {
            damping: 5, // Lower damping for more bounce
            stiffness: 180, // Higher stiffness for faster initial movement
            mass: 0.2, // Lower mass for quicker response
          }),
        },
      ],
    };
  });

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent={true}
      statusBarTranslucent={true}

    >
      <Animated.View
        style={$modalOverlay}
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
      >
        {Platform.OS === 'ios' ? (
          <AnimatedBlurView
            style={$absoluteFill}
            blurType="light"
            blurAmount={5}
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
          />
        ) : (
          <Animated.View
            style={[$absoluteFill, $androidBlur]}
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
          />
        )}
        <View style={$calendarView}>
          <View style={$dragIndicator} />
          {date ? (
          <Calendar
            key={date.toString()}
            theme={{
              backgroundColor: "red",
              arrowColor: colors.palette.primary500,
              todayTextColor: colors.palette.primary500,
              textDayFontFamily: typography.fonts.spaceGrotesk.normal,
              textDayHeaderFontFamily: typography.fonts.spaceGrotesk.normal,
              textMonthFontFamily: typography.fonts.spaceGrotesk.normal,
            }}
            enableSwipeMonths={true}
            firstDay={1}
            markedDates={{[date.toString()]: { selected: true, selectedColor: colors.palette.primary500}}}
            current={date.toString()}
            onDayPress={(day) => {
              setDate(new Date(day.dateString))
              onClose();
            }}
            onMonthChange={current => setIsBackButtonVisible(!isThisMonth(new Date(current.dateString)))}
          />
          ) : null}
          <View style={$buttonContainer}>
            <Animated.View style={backButtonAnimatedStyle}>
              <TouchableOpacity
                onPress={() => {
                  setDate(new Date())
                  setIsBackButtonVisible(false)
                }}
                style={$goTodayButtonContent}
              >
                <Icon icon={"reload"} size={typography.iconSize} />
                <Text
                  style={$goTodayText}
                  text="Back to today"
                />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity
              onPress={onClose}
              style={$closeButton}
            >
              <Icon icon={"check"} color={colors.palette.neutral100} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const $absoluteFill: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

const $modalOverlay: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-end',
}

const $androidBlur: ViewStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
}

const $calendarView: ViewStyle = {
  minHeight: '58%',
  paddingBottom: 80,
  backgroundColor: "white",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  overflow: 'hidden',
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: -2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
}

const $dragIndicator: ViewStyle = {
  width: 40,
  height: 4,
  backgroundColor: colors.palette.primary500,
  borderRadius: 2,
  alignSelf: 'center',
  marginTop: 8,
  marginBottom: 8,
}


const $buttonContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: spacing.lg,
  position: 'absolute',
  bottom: spacing.lg,
  left: 0,
  right: 0,
}

const $goTodayButtonContent: ViewStyle = {
  flexDirection: "row",
  gap: spacing.xs,
  alignItems: "center",
  justifyContent: "flex-start",
  padding: spacing.xs,
}

const $goTodayText: TextStyle = {
  fontFamily: typography.primary.bold,
  color: colors.text,
}

const $closeButton: ViewStyle = {
  height: 56,
  width: 56,
  padding: spacing.md,
  borderRadius: 50,
  backgroundColor: colors.palette.primary500,
  alignItems: "center",
  justifyContent: "center",
}