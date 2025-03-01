import React from 'react'
import { View, TouchableOpacity, ViewStyle } from "react-native"
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Reanimated, { SharedValue, useAnimatedStyle } from "react-native-reanimated"
import { Icon } from 'app/components/Icon'
import RowItem from 'app/components/RowItem'
import { colors, spacing, typography } from 'app/theme'
import TransactionModel from "../../db/models/TransactionModel"

interface SwipeableTransactionRowProps {
  item: TransactionModel
  index: number
  sectionLength: number
  categoryColor: keyof typeof colors.custom
  onDelete: (transaction: TransactionModel) => void
}

const DeleteAction = ({
                        drag,
                        item,
                        onDelete
                      }: {
  prog: SharedValue<number>
  drag: SharedValue<number>
  item: TransactionModel
  onDelete: (transaction: TransactionModel) => void
}) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 56 }],
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
};

export const SwipeableTransactionRow = ({
                                          item,
                                          index,
                                          sectionLength,
                                          categoryColor,
                                          onDelete
                                        }: SwipeableTransactionRowProps) => {

  const renderRightActions = (prog: SharedValue<number>, drag: SharedValue<number>) => (
    <DeleteAction prog={prog} drag={drag} item={item} onDelete={onDelete} />
  );

  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightActions}
      containerStyle={$container}
    >
      <View style={[
        $itemWrapper,
        index === 0 && $itemWrapperFirst,
        index === sectionLength - 1 && $itemWrapperLast,
        { borderColor: colors.custom[categoryColor] }]}
      >
        <RowItem transaction={item} />
      </View>
    </ReanimatedSwipeable>
  );
};

const $container: ViewStyle = {
  marginHorizontal: spacing.md
}

const $itemWrapper: ViewStyle = {
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
  marginHorizontal: "auto",
  marginVertical: "auto",
  justifyContent: "center",
  alignItems: "center",
}

const $deleteAction : ViewStyle = {
  width: 56,
  height: 56,
  backgroundColor: colors.error,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: spacing.xxs,
}