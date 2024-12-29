import React, { useCallback } from "react"
import { Animated, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import { Category } from "app/models/Category"
import { useExpensesStore } from "app/store/ExpensesStore"
import { ExpenseCard } from "app/screens/ExpensesScreen/ExpenseCard"
import { AccordionItem } from "app/components/AccordionItem"
import { Icon } from "app/components"
import { useAnimatedStyle, withTiming } from "react-native-reanimated"
import ArrowIconAnimated from "app/screens/ExpensesScreen/ArrowIconAnimated"

type Props = {
  category: Category,
  onHeightChange: any,
}

const CategoryCard = ({ category, onHeightChange }: Props) => {
  const { expenses } = useExpensesStore()
  const filtredExpenses = expenses.filter((expense) => expense.categoryId === category.id)
  const [isExpanded, setExpanded] = React.useState(false)

  const onLayout = useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    onHeightChange(height);
  }, [onHeightChange]);

  

  return (
    <View onLayout={onLayout} style={$cardContainer}>
      <TouchableOpacity  onPress={() => setExpanded(!isExpanded)} style={$labelContainer}>
        <Text style={$title}>
          {category.label}
        </Text>
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
          {filtredExpenses.length > 0 ? (
            filtredExpenses.map(expense => (
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

