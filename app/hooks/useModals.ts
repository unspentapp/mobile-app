import CategoryModel from "../../db/models/CategoryModel"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useCallback, useRef, useState } from "react"
import { TextInput } from "react-native"

interface ModalState {
  isOpen: boolean
  type: 'new' | 'edit'
  category: Partial<CategoryModel> | null
}

export const useModals = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'new',
    category: null
  })

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const confirmationSheetRef = useRef<BottomSheetModal>(null)
  const addCategorySheetRef = useRef<BottomSheetModal>(null)
  const addCategoryInputRef = useRef<TextInput>(null)

  const openConfirmationSheet = useCallback((category: Partial<CategoryModel>) => {
    setModalState(prev => ({ ...prev, category }))
    confirmationSheetRef.current?.present()
  }, [])

  const openAddCategorySheet = useCallback((type: 'new' | 'edit' = 'new', category: Partial<CategoryModel> | null = null) => {
    setModalState({ isOpen: true, type, category })
    addCategorySheetRef.current?.present()

    setTimeout(() => {
      addCategoryInputRef.current?.focus()
    }, 100)
  }, [])

  const closeAddCategorySheet = useCallback(() => {
    addCategorySheetRef.current?.dismiss()
    confirmationSheetRef.current?.dismiss()
    setModalState({ isOpen: false, type: 'new', category: null })
  }, [])

  const closeConfirmationSheet = useCallback(() => {
    confirmationSheetRef.current?.dismiss()
    setModalState(prev => ({ ...prev, category: null }))
  }, [])

  return {
    modalState,
    refs: {
      bottomSheetModalRef,
      confirmationSheetRef,
      addCategorySheetRef,
      addCategoryInputRef
    },
    actions: {
      openConfirmationSheet,
      openAddCategorySheet,
      closeAddCategorySheet,
      closeConfirmationSheet
    }
  }
}
