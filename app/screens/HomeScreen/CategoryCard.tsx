import React from "react"
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import { AccordionItem } from "app/components/AccordionItem"
import ArrowIconAnimated from "app/components/ArrowIconAnimated"
import RowItem from "app/components/RowItem"
import { useSharedValue } from "react-native-reanimated"
import CategoryModel from "../../../db/models/CategoryModel"
import TransactionModel from "../../../db/models/TransactionModel"
import { CircularProgressBar } from "app/components/CircularProgressBar"

type Props = {
  categoryId: string
  transactions: TransactionModel[]
  totalExpenses: number
  totalExpensesPerCategory: number
  animationDelay?: number
  presentConfirmationModal: (category: Partial<CategoryModel>) => void
  category: Partial<CategoryModel>
}

const CategoryCard = ({
    categoryId,
    transactions,
    totalExpenses,
    totalExpensesPerCategory,
    animationDelay,
    presentConfirmationModal,
    category
  }: Props) => {

  const numerator = totalExpensesPerCategory;
  const percentage = Math.round((numerator / totalExpenses) * 100)

  const isExpanded = useSharedValue(false)

  const onPress = () => {
    isExpanded.value = !isExpanded.value
  }

  const handleLongPress = () => {
    presentConfirmationModal(category)
  }

  return (
    <View style={$cardContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={$labelContainer}
        onLongPress={handleLongPress}
      >
        <View style={$progressBarContainer}>
          <CircularProgressBar
            percentage={percentage}
            delay={animationDelay}
            innerCircleColor={
              category?.color && (category.color in colors.custom)
                ? category.color : undefined
            }
          />
        </View>
        <View style={$cardDescriptionContainer}>
          <Text style={[$title, categoryId === "unknown" ? { color: colors.textDim } : null]}>
            {category.name}
          </Text>
          <Text>
            <Text style={$percentageText}>{numerator} € / {percentage}%</Text>
          </Text>
        </View>
        <ArrowIconAnimated value={isExpanded}/>
      </TouchableOpacity>

      <AccordionItem
        isExpanded={isExpanded}
        viewKey="Accordion"
        springConfig={{
          damping: 15,
          stiffness: 160,
          mass: 0.8
        }}
      >
        {transactions.length > 0 ? (
          transactions.map(transaction => (
            <RowItem
              transaction={transaction}
              key={transaction.id}
            />
          ))) : (
          <Text style={$normalText}>
            No expenses found.
          </Text>
        )}
      </AccordionItem>
    </View>
  )
}

export default CategoryCard

const $cardContainer: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'flex-start',
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral100,
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


const $normalText: TextStyle = {
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.md,
  fontSize: 14,
  fontFamily: typography.fonts.spaceGrotesk.normal,
}

const $progressBarContainer: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  paddingRight: spacing.md,
}

const $cardDescriptionContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  gap: spacing.xxs,
}

const $title: TextStyle = {
  fontSize: 16,
  lineHeight: 18,
  fontFamily: typography.primary.semiBold,
  color: colors.text,
}

const $percentageText: TextStyle = {
  fontSize: 14,
  color: colors.textDim,
  lineHeight: 16,
}
