import React from 'react'
import { View, TouchableOpacity, ViewStyle } from 'react-native'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Reanimated, { SharedValue, useAnimatedStyle } from "react-native-reanimated"
import { Icon } from 'app/components/Icon'
import RowItem from 'app/components/RowItem'
import { TransactionDataI } from '../../db/useWmStorage'
import { colors, spacing, typography } from 'app/theme'

interface SwipeableTransactionRowProps {
  item: TransactionDataI
  index: number
  sectionLength: number
  categoryColor: string
  onDelete: (transaction: TransactionDataI) => void
}

export const SwipeableTransactionRow = ({
    item,
    index,
    sectionLength,
    categoryColor,
    onDelete
  }: SwipeableTransactionRowProps) => {

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {

    const styleAnimation = useAnimatedStyle(() => {

      return {
        transform: [{ translateX: drag.value + 50 }],
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <View style={$rightAction}>
          <TouchableOpacity
            style={$deleteAction}
            onPress={() => onDelete(item)}
          >
            <Icon icon={"delete"} size={typography.iconSize} color={colors.palette.neutral000}/>
          </TouchableOpacity>
        </View>
      </Reanimated.View>
    );
  }

  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={RightAction}
    >
      <View style={[
        $itemWrapper,
        index === 0 && $itemWrapperFirst,
        index === sectionLength - 1 && $itemWrapperLast,
        { borderColor: categoryColor }
      ]}>
        <RowItem data={item} />
      </View>
    </ReanimatedSwipeable>
  );
};

const $itemWrapper: ViewStyle = {
  marginHorizontal: spacing.md,
  backgroundColor: "white",
  borderLeftWidth: 5,
};

const $itemWrapperFirst: ViewStyle = {
  borderTopRightRadius: spacing.xxs,
  borderTopLeftRadius: spacing.xxs,
};

const $itemWrapperLast: ViewStyle = {
  borderBottomRightRadius: spacing.xxs,
  borderBottomLeftRadius: spacing.xxs,
};

const $rightAction: ViewStyle = {
  flexDirection: "row",
}

const $deleteAction : ViewStyle = {
  width: 50,
  height: 50,
  backgroundColor: colors.error,
  alignItems: "center",
  justifyContent: "center",
  borderTopRightRadius: spacing.xxs,
  borderBottomRightRadius: spacing.xxs,
}