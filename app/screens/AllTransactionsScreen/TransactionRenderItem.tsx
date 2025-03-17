import React from "react";
import { SwipeableTransactionRow } from "app/components";
import TransactionModel from "../../../db/models/TransactionModel";
import CategoryModel from "../../../db/models/CategoryModel";
import { CustomColorType } from "app/theme/colors";

interface CategoriesMap {
  [categoryId: string]: CategoryModel;
}

interface TransactionItemRendererProps {
  item: TransactionModel;
  index: number;
  section: {
    data: TransactionModel[];
  };
  categoriesMap: CategoriesMap;
  onDelete: (transaction: TransactionModel) => void;
  isLastItemInList: boolean
}

export const TransactionItemRenderer = ({
    item,
    index,
    section,
    categoriesMap,
    onDelete,
    isLastItemInList
  }: TransactionItemRendererProps) => {
  // Get category color with type safety
  let categoryColor: CustomColorType = "color1";
  if (item.categoryId && categoriesMap[item.categoryId]) {
    const color = categoriesMap[item.categoryId].color;
    // Check if the color is a valid CustomColorType
    if (color && color.startsWith("color") && /^color(10|[1-9])$/.test(color)) {
      categoryColor = color as CustomColorType;
    }
  }

  return (
    <SwipeableTransactionRow
      item={item}
      index={index}
      sectionLength={section.data.length}
      categoryColor={categoryColor}
      onDelete={onDelete}
      isLastItemInList={isLastItemInList}
    />
  );
};