import React, { useCallback, useMemo } from "react"
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import { Category } from "app/models/Category"
import { useExpensesStore } from "app/store/ExpensesStore"
import { ExpenseCard } from "app/screens/ExpensesScreen/ExpenseCard"
import { AccordionItem } from "app/components/AccordionItem"
import ArrowIconAnimated from "app/screens/ExpensesScreen/ArrowIconAnimated"
import { ProgressBar } from "app/components/ProgressBar"

type Props = {
  category: Category,
  totalExpenses: number,
  onHeightChange: any,
  animationDelay?: number,
}

const CategoryCard = ({ category, onHeightChange, totalExpenses, animationDelay }: Props) => {
  const { expenses } = useExpensesStore()
  const filteredExpenses = expenses.filter((expense) => expense.categoryId === category.id)
  const totalExpensesPerCategory = filteredExpenses.reduce((total, expense) => total + expense.value, 0)
  const [isExpanded, setExpanded] = React.useState(false)

  const onLayout = useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    onHeightChange(height);
  }, [onHeightChange]);

  

  return (
    <View onLayout={onLayout} style={$cardContainer}>
      <TouchableOpacity  onPress={() => setExpanded(!isExpanded)} style={$labelContainer}>
        <View style={$cardDescriptionContainer}>
          <Text style={$title}>
            {category.label}
          </Text>
          <View style={$progressBarContainer}>
            <ProgressBar numerator={Math.round(totalExpensesPerCategory)} denominator={4000} animationDelay={animationDelay} />
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
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map(expense => (
              <ExpenseCard expense={expense} key={expense.id} category={category} />
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
  paddingHorizontal: spacing.lg,
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
  paddingVertical: spacing.md,
}

const $title: TextStyle = {
  fontSize: 20,
  fontFamily: typography.fonts.spaceGrotesk.medium,
  color: colors.text,
}

const $normalText: TextStyle = {
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
