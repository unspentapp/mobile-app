import React, { useEffect, useMemo, useRef, useState } from "react"
import { withObservables } from "@nozbe/watermelondb/react"
import database from "../../../db"
import { Q } from "@nozbe/watermelondb"
import { endOfYear, getWeekOfMonth, getYear, startOfYear } from "date-fns"
import format from "date-fns/format"
import { ScrollView, SectionList, TextStyle, View, ViewStyle } from "react-native"
import { Text } from "app/components/Text"
import { colors, spacing } from "app/theme"
import { YearTabsContainer, SectionHeader } from "app/screens"
import { SwipeableTransactionRow } from "app/components"
import TransactionModel from "../../../db/models/TransactionModel"
import CategoryModel from "../../../db/models/CategoryModel"


export interface Props {
  transactions: TransactionModel[]
  categories: CategoryModel[]
  selectedYear: number
  setSelectedYear: (selectedYear: number) => void
}

interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
}

interface WeeklyStats {
  totalIncome: number;
  totalExpenses: number;
}

interface YearTab {
  year: number
  hasTransactions: boolean
}

const TransactionsList = ({ transactions, categories, selectedYear, setSelectedYear } : Props) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [availableYears, setAvailableYears] = useState<YearTab[]>([{
    year: getYear(new Date()),
    hasTransactions: false
  }])

  const handleDelete = async (transaction: TransactionModel) => {

    if (!transaction.id) return

    try {
      const transactionRecord = await database
        .get('transactions')
        .find(transaction.id);

      await database.write(async () => {
        await transactionRecord.markAsDeleted();
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }


  // Fetch available years with transactions
  useEffect(() => {
    const fetchAvailableYears = async () => {
      const allTransactions = await database.get<TransactionModel>('transactions')
        .query(Q.sortBy('transaction_at', Q.desc))
        .fetch()

      const years = new Set<number>()
      allTransactions.forEach(transaction => {
        const year = new Date(transaction.transactionAt).getFullYear()

        if (year >= 2000) {
          years.add(year)
        }
      })

      const yearTabs = Array.from(years)
        .sort((a, b) => a - b)
        .map(year => ({
          year,
          hasTransactions: true
        }))

      setAvailableYears(yearTabs)
    }

    fetchAvailableYears()
  }, [])

  // Scroll to selected year on first render and when years change
  useEffect(() => {
    if (availableYears.length > 0 && scrollViewRef.current) {

      const currentYearIndex = availableYears.findIndex(({ year }) => year === selectedYear)
      if (currentYearIndex !== -1) {
        scrollViewRef.current?.scrollTo({
          x: currentYearIndex * 100, // Approximate width of each tab
          animated: true
        })
      }
    }
  }, [availableYears, selectedYear])

  // Transform and group transactions by month and week
  const prepareSections = (transactions : TransactionModel[]) => {
    const monthlyStats: { [key: string]: MonthlyStats } = {};
    const weeklyStats: { [key: string]: WeeklyStats } = {};

    const grouped = transactions.reduce((acc, transaction) => {
      const monthKey = format(transaction.transactionAt, 'yyyy-MM');
      const weekKey = `${monthKey}-W${getWeekOfMonth(transaction.transactionAt, { weekStartsOn: 1 })}`;

      // Calculate monthly stats
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          totalIncome: 0,
          totalExpenses: 0,
        };
      }

      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = {
          totalIncome: 0,
          totalExpenses: 0,
        };
      }

      if (transaction.type === 'income') {
        monthlyStats[monthKey].totalIncome += transaction.amount;
        weeklyStats[weekKey].totalIncome += transaction.amount;
      } else {
        monthlyStats[monthKey].totalExpenses += transaction.amount;
        weeklyStats[weekKey].totalExpenses += transaction.amount;
      }

      // Group by week
      if (!acc[weekKey]) {
        acc[weekKey] = {
          monthKey,
          title: `Week ${getWeekOfMonth(transaction.transactionAt, { weekStartsOn: 1 })}`,
          data: [],
          month: format(transaction.transactionAt, 'MMM yyyy'),
          monthlyStats: monthlyStats[monthKey],
          weeklyStats: weeklyStats[weekKey],
        };
      }
      acc[weekKey].data.push(transaction);
      acc[weekKey].monthlyStats = monthlyStats[monthKey];
      acc[weekKey].weeklyStats = weeklyStats[weekKey];
      return acc;
    }, {});

    const sections = Object.values(grouped);

    return sections.map((section, index) => ({
      ...section,
      isFirstWeekOfMonth: !sections
        .slice(0, index)
        .some(s => s.monthKey === section.monthKey)
    }));
  };

  const categoriesMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {});
  }, [categories]);

  const sections = prepareSections(transactions);

  return (
    <View style={$container}>
      <YearTabsContainer
        availableYears={availableYears}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        scrollViewRef={scrollViewRef}
      />
      <SectionList
        style={$sectionContainer}
        sections={sections}
        renderItem={({ item, index, section }) => (
          <SwipeableTransactionRow
            item={item}
            index={index}
            sectionLength={section.data.length}
            categoryColor={categoriesMap[item.categoryId]?.color || colors.palette.primary500}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item, index) => item.id + index}
        renderSectionHeader={({ section }) => (
          <SectionHeader section={section} />
        )}
        ListEmptyComponent={<Text preset={"formHelper"} tx={"allTransactionsScreen.noItems"} style={$noItems}/>}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        // SectionSeparatorComponent={() => <View style={$sectionSeparator} />}
        // renderSectionFooter={() => <View style={$sectionFooter} />}
      />
    </View>
  )
};

const enhance = withObservables(["selectedYear"], ({ selectedYear }) => {
  const startDate = startOfYear(new Date(selectedYear, 0, 1))
  const endDate = endOfYear(new Date(selectedYear, 11, 31))
  console.log(selectedYear, startDate, endDate)

  return {
    transactions: database.get('transactions').query(
      Q.where('transaction_at', Q.gte(new Date(startDate).getTime())),
      Q.where('transaction_at', Q.lte(new Date(endDate).getTime())),
      Q.sortBy('transaction_at', Q.desc),
    ).observe(),
    categories: database.get('categories').query().observe()
  }
})

export default enhance(TransactionsList);

const $container: ViewStyle = {
  flex: 1,
}

const $noItems: TextStyle = {
  padding: spacing.lg,
}

const $sectionContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.sm,
};

const $sectionFooter: ViewStyle = {
  height: spacing.sm,
};








