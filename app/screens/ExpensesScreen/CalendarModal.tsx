import { BlurView } from '@react-native-community/blur';
import { Modal, Platform, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import React from "react"
import { Calendar } from "react-native-calendars"
import { Icon } from "app/components"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}

export const CalendarModal = ({ visible, onClose, date, setDate }: CalendarModalProps) => {

  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

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
          <Calendar
            theme={{
              backgroundColor: "red", // todo not working
              arrowColor: colors.palette.primary500,
              todayTextColor: colors.palette.primary500,
              textDayFontFamily: typography.fonts.spaceGrotesk.normal,
              textDayHeaderFontFamily: typography.fonts.spaceGrotesk.normal,
              textMonthFontFamily: typography.fonts.spaceGrotesk.normal,
            }}
            enableSwipeMonths={true}
            firstDay={1}
            markedDates={{[date]: { selected: true, selectedColor: colors.palette.primary500}}}
            current={date}
            // Calendar day format: YYYY-MM-DD
            onDayPress={(day) => {
              setDate(day.dateString)
              onClose();
            }}
          />
          <TouchableOpacity
            onPress={onClose}
            style={$closeButton}
          >
            <Icon icon={"check"} color={colors.palette.neutral100} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

// Styles
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
  height: '60%',
  paddingBottom: 100,
  // todo cannot set calendar to backgroundColor: colors.background
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

const $closeButton: ViewStyle = {
  position: "absolute",
  right: spacing.lg,
  bottom: spacing.lg,
  height: 56,
  width: 56,
  padding: 20,
  borderRadius: 50,
  backgroundColor: colors.palette.primary500,
  alignItems: "center",
  justifyContent: "center",
}