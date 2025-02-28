import React, { useCallback, useState, useEffect } from 'react'
import {
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  ScrollView,
  Keyboard,
  Modal, Platform,
} from "react-native"
import {
  withTiming,
  useSharedValue,
} from 'react-native-reanimated'
import { colors, spacing, typography } from "app/theme"
import ArrowIconAnimated from "app/components/ArrowIconAnimated"

export type DropdownOption = {
  label: string
  value: string
}

type DropdownProps = {
  options: DropdownOption[]
  selectedOption?: DropdownOption
  onSelect: (option: DropdownOption) => void
  placeholder?: string
  disabled?: boolean
  maxHeight?: number
}

const AnimatedDropdown: React.FC<DropdownProps> = ({
                                                     options,
                                                     selectedOption,
                                                     onSelect,
                                                     placeholder = 'Select an option',
                                                     disabled = false,
                                                     maxHeight = 240,
                                                   }) => {
  const [isOpenState, setIsOpenState] = useState(false)
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const heightAnimation = useSharedValue(0)
  const isOpen = useSharedValue(false)

  const closeDropdown = useCallback(() => {
    setIsOpenState(false)
    isOpen.value = false
    heightAnimation.value = withTiming(0, {
      duration: 200
    })
  }, [])

  useEffect(() => {
    if (disabled && isOpenState) {
      closeDropdown()
    }
  }, [disabled])

  const toggleDropdown = useCallback(() => {
    if (disabled) return

    const newValue = !isOpenState
    setIsOpenState(newValue)
    isOpen.value = newValue
    Keyboard.dismiss()
    heightAnimation.value = withTiming(newValue ? 1 : 0, {
      duration: 200
    })
  }, [isOpenState, disabled])

  const handleSelect = useCallback((option: DropdownOption) => {
    onSelect(option)
    closeDropdown()
  }, [onSelect])

  const measureDropdown = useCallback(() => {
    if (dropdownRef.current) {
      dropdownRef.current.measureInWindow((x, y, width, height) => {
        setDropdownLayout({ x, y, width, height })
      })
    }
  }, [])

  const dropdownRef = React.useRef(null)

  return (
    <View
      ref={dropdownRef}
      style={[$container, disabled && $containerDisabled]}
      onLayout={measureDropdown}
    >
      <TouchableOpacity
        style={[$trigger, disabled && $triggerDisabled]}
        onPress={() => {
          measureDropdown()
          toggleDropdown()
        }}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text
          style={[
            $selectedText,
            disabled && $textDisabled
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ArrowIconAnimated value={isOpen} />
      </TouchableOpacity>

      <Modal
        visible={isOpenState}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
        statusBarTranslucent={true}
        hardwareAccelerated={true}
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={$modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[
                $modalContent,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  position: 'absolute',
                  top: dropdownLayout.y + dropdownLayout.height,
                  left: dropdownLayout.x,
                  width: dropdownLayout.width,
                  maxHeight: maxHeight,
                }
              ]}>
                <ScrollView
                  scrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                  keyboardShouldPersistTaps="handled"
                >
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        $option,
                        selectedOption?.value === option.value && $selectedOption,
                      ]}
                      onPress={() => handleSelect(option)}
                    >
                      <Text
                        style={[
                          $optionText,
                          selectedOption?.value === option.value && $selectedOptionText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default AnimatedDropdown

const $container: ViewStyle = {
  position: 'relative',
  zIndex: 1,
  minWidth: "50%",
  alignSelf: 'flex-end',
}

const $containerDisabled: ViewStyle = {
  opacity: 0.5,
}

const $trigger: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: spacing.xs,
  paddingVertical: spacing.xs,
}

const $triggerDisabled: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
}

const $selectedText: TextStyle = {
  fontSize: 16,
  fontFamily: typography.primary.bold,
  color: colors.text,
  textAlign: 'right',
}

const $textDisabled: TextStyle = {
  color: colors.textDim,
}

const $modalOverlay: ViewStyle = {
  flex: 1,
  backgroundColor: 'transparent',
  ...(Platform.OS === 'android' ? {
    windowBackground: 'transparent',
    navigationBarColor: 'transparent',
  } : {}),
}

const $modalContent: ViewStyle = {
  backgroundColor: colors.elevatedBackground,
  borderRadius: spacing.xs,
  shadowColor: colors.palette.neutral900,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  overflow: 'hidden',
}

const $option: ViewStyle = {
  padding: spacing.md,
  borderTopWidth: 1,
  borderTopColor: colors.palette.neutral200,
}

const $selectedOption: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
}

const $optionText: TextStyle = {
  fontSize: 16,
  fontFamily: typography.primary.normal,
  color: colors.text,
  textAlign: 'right',
}

const $selectedOptionText: TextStyle = {
  color: colors.palette.primary500,
  fontFamily: typography.primary.bold,
}