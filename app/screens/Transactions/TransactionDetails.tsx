import React, { useCallback, useEffect, useRef, useState } from "react"
import { BackHandler, Keyboard, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AppStackParamList, goBack } from "app/navigators"
import { useRoute, RouteProp, useFocusEffect } from "@react-navigation/native"
import { Icon, Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
import database from "../../../db"
import TransactionModel from "../../../db/models/TransactionModel"
import CategoryModel from "../../../db/models/CategoryModel"
import { CalendarModal } from "app/screens/Transactions/CalendarModal"
import format from "date-fns/format"
import { isToday } from "date-fns"
import AnimatedDropdown, { DropdownOption } from "app/components/AnimatedDropdown"

type TransactionDetailsRouteProp = RouteProp<AppStackParamList, 'TransactionDetails'>;
type TransactionType = Partial<TransactionModel>

const TransactionDetails = () => {
  const route = useRoute<TransactionDetailsRouteProp>()
  const { itemId } = route.params

  const inputRefs = {
    description: useRef<TextInput>(null),
    amount: useRef<TextInput>(null),
  }

  const [focusedInput, setFocusedInput] = useState<keyof typeof inputRefs | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [transaction, setTransaction] = useState<TransactionType>()
  const [categories, setCategories] = useState<DropdownOption[]>([])
  const [category, setCategory] = useState<CategoryModel>()
  const [isEditing, setIsEditing] = useState(false)

  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { top } = useSafeAreaInsets()

  const transactionCollection = database.get<TransactionModel>("transactions")

  const handleEdit = () => {
    setIsEditing(true)

    setTimeout(() => {
      inputRefs.description.current?.focus()
    }, 100)
  }

  const handleSave = async () => {
    if (!transaction || !itemId) return

    try {
      const transaction = await transactionCollection.find(itemId)

      const updatedTransaction = {
        amount: parseFloat(amount),
        description,
        categoryId: category?.id,
      }

      await transaction.updateWithCategory(updatedTransaction)

      // Update the local state
      setTransaction({
        ...transaction,
        description,
        amount: parseFloat(amount),
        categoryId: category?.id,
      })

      setIsEditing(false)
    } catch (e) {
      console.error("Failed to save transaction:", e)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = database.get<CategoryModel>("categories")
        const allCategories = await categoryCollection.query().fetch()

        // Map categories to dropdown options
        const categoryOptions = allCategories.map(category => ({
          label: category.name,
          value: category.id
        }))

        setCategories(categoryOptions)
      } catch (e) {
        console.error("Failed to fetch categories:", e)
      }
    }

    fetchCategories()
  }, [])

  const handleCategorySelect = (option: DropdownOption) => {
    setCategory({
      id: option.value,
      name: option.label,
    } as CategoryModel)
  }

  useEffect(() => {
    if (!itemId) return

    const fetchTransaction = async () => {
      try {
        const transaction = await transactionCollection.find(itemId)

        if (transaction) {
          const category = await transaction.category

          setTransaction(transaction)
          setDescription(transaction.description || "")
          setAmount(transaction.amount.toString())
          setDate(transaction.transactionAt || "")

          if (category) {
            setCategory(category)
          }
        }
      } catch (e) {
        console.error(e) // todo
      }
    }

    fetchTransaction()
  }, [itemId])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (focusedInput) {
          // Blur the currently focused input
          inputRefs[focusedInput].current?.blur()
          setIsEditing(false)
          setFocusedInput(null)
          return true // Prevent default back behavior
        }
        return false
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [focusedInput])
  )

  const handleFocus = (inputName: keyof typeof inputRefs) => {
    setFocusedInput(inputName)
  }

  const handleBlur = () => {
    setIsEditing(false)
    setFocusedInput(null)
  }


  return (
    <View style={$screenContainer}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
      />

      <CalendarModal
        visible={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        date={date}
        setDate={setDate}
      />

      <View style={[$container, { paddingTop: top }]}>
        <View style={$topContainer}>
          <View style={$leftWrapper}>
            <TouchableOpacity
              style={$goBackButton}
              onPress={goBack}
            >
              <Icon icon={"back"} />
            </TouchableOpacity>
            <Text testID="transactions-heading" tx={"transactionDetails.title"} preset="heading" />
          </View>
          {!isEditing ? (
            <TouchableOpacity
              style={$goBackButton}
              onPress={handleEdit}
            >
              <Icon icon={"edit"} size={typography.iconSize} color={colors.textDim}/>
            </TouchableOpacity>
          ) : (
            <View style={$actionButtons}>
              <TouchableOpacity
                style={[$goBackButton, $saveButton]}
                onPress={handleSave}
              >
                <Icon icon={"check"} size={typography.iconSize} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={$formContainer}>
          <View style={$fieldContainer}>
            <Text preset="formLabel" tx={"transactionDetails.note"} style={$label} />
            <TextInput
              ref={inputRefs.description}
              value={description}
              onChangeText={setDescription}
              editable={isEditing}
              cursorColor={colors.palette.primary500}
              style={[
                $textInput,
                isEditing && $editableInput,
              ]}
              placeholder="Enter description"
              submitBehavior={"blurAndSubmit"}
              returnKeyType="next"
              onFocus={() => handleFocus('description')}
              onSubmitEditing={() => inputRefs.amount.current?.focus()}
            />
          </View>

          <View style={$fieldContainer}>
            <Text preset="formLabel" tx={"transactionDetails.amount"} style={$label} />
            <View style={$amountInputWrapper}>
            <TextInput
              ref={inputRefs.amount}
              value={amount}
              onChangeText={setAmount}
              onFocus={() => handleFocus('amount')}
              editable={isEditing}
              cursorColor={colors.palette.primary500}
              style={[
                $textInput,
                isEditing && $editableInput,
              ]}
              keyboardType="numeric" // todo decimals?
              placeholder="Enter amount"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
              {!isEditing && (
                <Text
                  text={"€"}
                  style={{ fontFamily: typography.primary.bold }}
                />
              )}
            </View>
          </View>

          <View style={$fieldContainer}>
            <Text preset="formLabel" tx={"transactionDetails.date"} style={$label} />
            <TouchableOpacity
              disabled={!isEditing}
              onPress={() => setIsCalendarOpen(true)}
              style={$calendarInput}
            >
              <Text
                style={[
                  $textInput,
                  isEditing && $editableInput,
                ]}
                text={isToday(new Date(date)) ? 'Today' : format(new Date(date), 'eee do MMM, yyyy')}
              />
            </TouchableOpacity>
          </View>

          <View style={$fieldContainer}>
            <Text preset="formLabel" tx={"transactionDetails.type"} style={$label} />
            {transaction?.type === 'expense' ? (
              <View style={$typeExpenseWrapper}>
                <Icon icon={"expense"} size={typography.iconSize} color={colors.error}/>
                <Text tx={"transactionDetails.expenseType"} style={$typeExpenseText}/>
              </View>
            ) : (
              <View style={$typeIncomeWrapper}>
                <Icon icon={"income"} size={typography.iconSize} color={colors.palette.green500}/>
                <Text tx={"transactionDetails.incomeType"} style={$typeIncomeText}/>
              </View>
            )}
          </View>

          {category ? (
            <View style={$fieldContainer}>
              <Text preset="formLabel" tx={"transactionDetails.category"} style={$label} />
              {isEditing ? (
              <AnimatedDropdown
                options={categories}
                selectedOption={category ? {
                  label: category.name,
                  value: category.id
                } : undefined}
                onSelect={handleCategorySelect}
                disabled={!isEditing}
                maxHeight={300}
              />
              ) : (
                <Text
                  text={category.name}
                  style={$textInput}
                />
              )}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  )
}

export default TransactionDetails

const $screenContainer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingHorizontal: spacing.lg,
}

const $topContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: spacing.md,
}

const $leftWrapper: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
}

const $goBackButton: ViewStyle = {
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xs,
}

const $formContainer: ViewStyle = {
  padding: spacing.md,
  gap: spacing.md,
  backgroundColor: colors.elevatedBackground,
  borderRadius: spacing.xs,
}

const $fieldContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: spacing.xs,
}

const $label: TextStyle = {
  color: colors.textDim,
  marginBottom: spacing.xs / 2,
}

const $textInput: TextStyle = {
  color: colors.text,
  textAlign: "right",
  fontSize: 16,
  fontFamily: typography.primary.bold,
  paddingVertical: spacing.xs,
  paddingHorizontal: 0,
  textDecorationLine: "none",
  minWidth: "50%",
}

const $editableInput: TextStyle = {
  backgroundColor: colors.palette.neutral200,
  paddingHorizontal: spacing.xs,
  borderRadius: 4,
}

const $textValue: TextStyle = {
  color: colors.text,
  fontSize: 16,
  paddingVertical: spacing.xs,
}

const $amountInputWrapper: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: spacing.xs,

}

const $typeExpenseWrapper: ViewStyle = {
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  backgroundColor: colors.palette.angry100,
  borderRadius: spacing.xxs,
  flexDirection: "row",
  gap: spacing.xs,
}

const $typeExpenseText: TextStyle = {
  color: colors.error,
  fontFamily: typography.primary.bold,
}

const $typeIncomeWrapper: ViewStyle = {
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  backgroundColor: colors.palette.green100,
  borderRadius: spacing.xxs,
  flexDirection: "row",
  gap: spacing.xs,
}

const $typeIncomeText: TextStyle = {
  color: colors.palette.green500,
  fontFamily: typography.primary.bold,
}

const $calendarInput: ViewStyle = {

}

const $actionButtons: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $saveButton: ViewStyle = {
}