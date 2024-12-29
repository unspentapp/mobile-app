import React from "react"
import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import { Category } from "app/models/Category"
import { useExpensesStore } from "app/store/ExpensesStore"
import { ExpenseCard } from "app/screens/ExpensesScreen/ExpenseCard"
import { AccordionItem } from "app/components/AccordionItem"
import { useSharedValue } from "react-native-reanimated"

type Props = {
  key: string,
  category: Category,
}

const CategoryCard = (props: Props) => {
const { expenses } = useExpensesStore()
  const open = useSharedValue(false);
  const onPress = () => {
    open.value = !open.value;
  };

  return (
    <TouchableOpacity style={$cardContainer} onPress={onPress}>
      <Text style={$title}>
        {props.category.label}
      </Text>
      <AccordionItem isExpanded={open} viewKey="Accordion">
        {expenses
          .filter(expense => expense.categoryId === props.category.id)
          .map(expense => (
            <ExpenseCard expense={expense} key={expense.id} category={props.category} />
          ))}
      </AccordionItem>
    </TouchableOpacity>
  )
}

export default CategoryCard


const $cardContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  marginTop: spacing.xs,
  marginBottom: spacing.sm,
  borderRadius: spacing.xxs,
}

const $title: TextStyle = {
  fontSize: 16,
  fontFamily: typography.fonts.spaceGrotesk.bold,
  color: colors.palette.neutral700,
}