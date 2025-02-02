import React, { useEffect, useRef, useState } from "react"
import { withObservables } from "@nozbe/watermelondb/react"
import database from "../../db"
import RowItem from "app/components/RowItem"
import { Q } from "@nozbe/watermelondb"
import { TransactionDataI } from "../../db/useWmStorage"
import { endOfYear, getWeekOfMonth, startOfYear } from "date-fns"
import format from "date-fns/format"
import { ScrollView, SectionList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "app/components/Text"
import { colors, spacing, typography } from "app/theme"
import Animated, {
  FadeIn,
  Layout,
  withSpring
} from 'react-native-reanimated'


export interface Props {
  transactions: TransactionDataI[]
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

const TransactionsList = ({ transactions, selectedYear, setSelectedYear } : Props) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [availableYears, setAvailableYears] = useState<YearTab[]>([])

  // Fetch available years with transactions
  useEffect(() => {
    const fetchAvailableYears = async () => {
      const allTransactions = await database.get('transactions')
        .query(Q.sortBy('transaction_at', Q.desc))
        .fetch()

      const years = new Set<number>()
      allTransactions.forEach(transaction => {
        years.add(new Date(transaction.transactionAt).getFullYear())
      })

      const yearTabs = Array.from(years)
        .sort((a, b) => a-b)
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
      // Find the index of the current year
      const currentYearIndex = availableYears.findIndex(({ year }) => year === selectedYear)
      if (currentYearIndex !== -1) {
        // Add a small delay to ensure layout is complete
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: currentYearIndex * 100, // Approximate width of each tab
            animated: true
          })
        }, 100)
      }
    }
  }, [availableYears, selectedYear])


  // Transform and group transactions by month and week
  const prepareSections = (transactions) => {
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

    return Object.values(grouped);
  };


  const renderYearTabs = () => {
    if (availableYears.length <= 1) return null

    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={$yearTabsContainer}
        contentContainerStyle={$yearTabsContent}
      >
        {availableYears.map(({ year }) => (
          <Animated.View
            key={year}
            entering={FadeIn}
            layout={Layout.springify()}
          >
            <TouchableOpacity
              style={[
                $yearTab,
                year === selectedYear && $yearTabSelected
              ]}
              onPress={() => setSelectedYear(year)}
            >
              <Animated.Text
                style={[
                  $yearTabText,
                  year === selectedYear && $yearTabTextSelected
                ]}
              >
                {year}
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    )
  }

  const renderSectionHeader = ({ section }) => {
    // Only render month name for the first week of the month
    const weeklyBalance = section.weeklyStats.totalIncome - section.weeklyStats.totalExpenses;

    const isFirstWeekOfMonth = !sections
      .slice(0, sections.indexOf(section))
      .some(s => s.monthKey === section.monthKey);

    return (
      <View>
        {isFirstWeekOfMonth ? (
        <Text style={$monthHeaderText}>{section.month}</Text>
        ) : null }
        <View style={$sectionHeader}>
          <Text style={$sectionHeaderText}>{section.title}</Text>
          <Text style={$statValue}>
            {weeklyBalance >= 0 ? '+ ' : '- '}{Math.abs(weeklyBalance)} €
          </Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item, index, section }) => (
    <View style={[
      $itemWrapper,
      index === 0 && $itemWrapperFirst,
      index === section.data.length - 1 && $itemWrapperLast,
      /* dynamically change color base on category color */
      { borderColor: colors.palette.primary500 }
    ]}>
      <RowItem data={item} />
    </View>
  );

  const sections = prepareSections(transactions);

  return (
    <View style={$container}>
      {renderYearTabs()}
      <SectionList
        style={$sectionContainer}
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ListEmptyComponent={<Text preset={"formHelper"} tx={"allTransactionsScreen.noItems"} style={$noItems}/>}
        showsVerticalScrollIndicator={false}
        initialNumToRender={30}
        SectionSeparatorComponent={() => <View style={$sectionSeparator} />}
        renderSectionFooter={() => <View style={$sectionFooter} />}
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
      Q.where('transaction_at', Q.gte(startDate.getTime())),
      Q.where('transaction_at', Q.lte(new Date(endDate).getTime())),
      Q.sortBy('transaction_at', Q.desc),
    ),
  }
})

export default enhance(TransactionsList);

const $container: ViewStyle = {
  flex: 1,
}

const $noItems: TextStyle = {
  padding: spacing.lg,

}

/*const $yearTabsContainer: ViewStyle = {
  maxHeight: 50,
}

const $yearTabsContent: ViewStyle = {
  flexDirection: "row-reverse",
}

const $yearTab: ViewStyle = {
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  marginRight: spacing.sm,
  borderRadius: spacing.md,
}

const $yearTabSelected: ViewStyle = {
  backgroundColor: colors.palette.primary100,
  borderWidth: 1,
  borderColor: colors.palette.primary500,
}*/

const $yearTabText: TextStyle = {
  fontFamily: typography.primary.medium,
  fontSize: 16,
  color: colors.textDim,
}

const $yearTabTextSelected: TextStyle = {
  color: colors.palette.primary500,
}

const $sectionContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.sm,
};

const $sectionHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: spacing.sm,
  marginBottom: spacing.xxs,
  paddingHorizontal: spacing.md,
  backgroundColor: colors.background,
};

const $sectionHeaderText: TextStyle = {
  fontFamily: typography.primary.medium,
  fontSize: 14,
  color: colors.textDim,
};

const $itemWrapper: ViewStyle = {
  marginHorizontal: spacing.md,
  backgroundColor: "white",
  borderLeftWidth: 5,
};

const $itemWrapperFirst: ViewStyle = {
  borderTopRightRadius: spacing.xs,
  borderTopLeftRadius: spacing.xs,
};

const $itemWrapperLast: ViewStyle = {
  borderBottomRightRadius: spacing.xs,
  borderBottomLeftRadius: spacing.xs,
};

const $sectionSeparator: ViewStyle = {
  // height: spacing.xs,
};

const $sectionFooter: ViewStyle = {
  height: spacing.sm,
};

/*const $monthHeader: ViewStyle = {
  paddingTop: spacing.md,
  paddingHorizontal: spacing.md,
  backgroundColor: colors.background,
};*/

const $monthHeaderText: TextStyle = {
  paddingTop: spacing.lg,
  paddingHorizontal: spacing.md,
  fontFamily: typography.primary.bold,
  fontSize: 20,
  color: colors.text,
};

const $statValue: TextStyle = {
  fontFamily: typography.primary.medium,
  color: colors.textDim,
  fontSize: 14,
};

/*
const $incomeText: TextStyle = {
  color: colors.palette.secondary400,
};

const $expenseText: TextStyle = {
  color: colors.palette.angry500,
};*/

// Update styles to ensure consistent tab width and better scrolling
const $yearTabsContainer: ViewStyle = {
  maxHeight: 50,
}

const $yearTabsContent: ViewStyle = {
  flexDirection: 'row',
}

const $yearTab: ViewStyle = {
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  marginRight: spacing.sm,
  borderRadius: spacing.sm,
  alignItems: 'center', // Center the text
}

const $yearTabSelected: ViewStyle = {
  backgroundColor: colors.palette.primary100,
  borderWidth: 1,
  borderColor: colors.palette.primary500,
}