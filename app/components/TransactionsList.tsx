import React from "react"
import { withObservables } from "@nozbe/watermelondb/react"
import database from "../../db"
import RowItem from "app/components/RowItem"
import { Q } from "@nozbe/watermelondb"
import { TransactionDataI } from "../../db/useWmStorage"
import { getWeek, getWeekOfMonth, startOfWeek } from "date-fns"
import format from "date-fns/format"
import { SectionList, TextStyle, View, ViewStyle } from "react-native"
import { Text } from "app/components/Text"
import { colors, spacing, typography } from "app/theme"


export interface Props {
  transactions: TransactionDataI[]
}

interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
}

interface WeeklyStats {
  totalIncome: number;
  totalExpenses: number;
}

const TransactionsList = ({ transactions } : Props) => {
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
    <SectionList
      style={$sectionContainer}
      sections={sections}
      keyExtractor={(item, index) => item.id + index}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      ListEmptyComponent={<Text preset={"formHelper"} tx={"allTransactionsScreen.noItems"}/>}
      showsVerticalScrollIndicator={false}
      initialNumToRender={30}
      SectionSeparatorComponent={() => <View style={$sectionSeparator} />}
      renderSectionFooter={() => <View style={$sectionFooter} />}
    />
  );
};

const enhance = withObservables([], () => ({
  transactions: database.get('transactions').query(
    Q.sortBy('transaction_at', Q.desc)
  ),
}));

export default enhance(TransactionsList);


const $sectionContainer: ViewStyle = {
  flex: 1,
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

const $monthHeader: ViewStyle = {
  paddingTop: spacing.md,
  paddingHorizontal: spacing.md,
  backgroundColor: colors.background,
};

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

const $incomeText: TextStyle = {
  color: colors.palette.secondary400,
};

const $expenseText: TextStyle = {
  color: colors.palette.angry500,
};