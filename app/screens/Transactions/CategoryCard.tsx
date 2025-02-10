import React, { useCallback, useState } from "react"
import { LayoutChangeEvent, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import { AccordionItem } from "app/components/AccordionItem"
import ArrowIconAnimated from "app/screens/Transactions/ArrowIconAnimated"
import { ProgressBar } from "app/components/ProgressBar"
import { TransactionDataI } from "../../../db/useWmStorage"
import RowItem from "app/components/RowItem"

type Props = {
  categoryId: string,
  categoryName: string,
  transactions: TransactionDataI[],
  totalExpenses: number,
  onHeightChange: any,
  animationDelay?: number,
}

const CategoryCard = ({ categoryId, categoryName, transactions, totalExpenses, onHeightChange, animationDelay }: Props) => {

  const totalExpensesPerCategory = transactions.reduce((total, transaction) => total + transaction.amount, 0)
  const [isExpanded, setExpanded] = useState(false)

  const onLayout = useCallback((event : LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    onHeightChange(height);
  }, [onHeightChange]);

  

  return (
    <View onLayout={onLayout} style={$cardContainer}>
      <TouchableOpacity  onPress={() => setExpanded(!isExpanded)} style={$labelContainer}>
        <View style={$cardDescriptionContainer}>
          <Text style={[$title, categoryId === "unknown" ? { color: colors.textDim } : null]}>
            {categoryName}
          </Text>
          <View style={$progressBarContainer}>
            <ProgressBar numerator={totalExpensesPerCategory} denominator={totalExpenses} animationDelay={animationDelay} />
          </View>
        </View>
        <ArrowIconAnimated  value={isExpanded}/>
      </TouchableOpacity>
      {isExpanded ? (
        <AccordionItem
          isExpanded={isExpanded}
          viewKey="Accordion"
          springConfig={{
            damping: 15,
            stiffness: 200,
            mass: 0.8
          }}
        >
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <RowItem
                data={transaction}
                key={transaction.id}
              />
            ))) : (
              <Text style={$normalText}>
                No expenses found.
              </Text>
          )}
        </AccordionItem>
      ) : null}
    </View>
  )
}

export default CategoryCard

const $cardContainer: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'flex-start',
  backgroundColor: colors.elevatedBackground,
  borderWidth: 1,
  borderColor: colors.border,
  marginBottom: spacing.sm,
  borderRadius: spacing.xxs,
}

const $labelContainer: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
}

const $title: TextStyle = {
  fontSize: 20,
  fontFamily: typography.primary.medium,
  color: colors.text,
}

const $normalText: TextStyle = {
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.md,
  fontSize: 14,
  fontFamily: typography.fonts.spaceGrotesk.normal,
}

const $progressBarContainer: ViewStyle = {
  width: "100%",
  paddingRight: spacing.md,
}

const $cardDescriptionContainer: ViewStyle = {
  flex: 1

}
