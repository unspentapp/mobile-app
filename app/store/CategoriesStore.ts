import { create } from "zustand"
import { Category } from "app/models/Category"
import { getCategories } from "assets/data"

export interface CategoriesState {
  categories: Category[];
  addCategory: (category: Category) => void;
  removeCategory: (category: Category) => void;
  // editCategory: (category: Category) => void;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: getCategories(),
  addCategory: (newCategory: Category) => set((state) => {
    return {
      categories: [...state.categories, newCategory],
    }
  }),
  removeCategory: (category: Category) => set((state) => {
    return {
      categories: state.categories.filter((categoryToBeRemoved) => categoryToBeRemoved.id !== category.id),
    }
  }),
  /* editCategory: (updatedCategory: Category) => set((state) => {
    const oldCategory = state.categories.find((e) => e.id === updatedCategory.id);

    return {
      categories: state.categories.map((e) =>
        e.id === updatedCategory.id ? updatedCategory : e
      ),
    };
  }), */
}))