import React, { RefObject, useCallback, useMemo } from "react"
import { YearTab } from "app/screens"
import { ScrollView, ViewStyle, useWindowDimensions } from 'react-native'
import { spacing } from 'app/theme'

interface Years {
  year: number
  hasTransactions: boolean
}

interface YearTabsProps {
  availableYears: Years[]
  selectedYear: number
  setSelectedYear: (year: number) => void
  scrollViewRef: RefObject<ScrollView>
}

export const YearTabsContainer = ({ availableYears, selectedYear, setSelectedYear, scrollViewRef }: YearTabsProps) => {
  const { width: screenWidth } = useWindowDimensions()

  if (availableYears.length === 0) return null

  // Memoize the tabs to prevent unnecessary re-renders
  const yearTabs = useMemo(() => {
    return availableYears.map(({ year }) => ({
      year,
      isSelected: year === selectedYear
    }))
  }, [availableYears, selectedYear])

  // Use useCallback to stabilize the function reference
  const handleTabPress = useCallback((year: number) => {
    setSelectedYear(year)

    // Calculate the position to center the tab
    const tabWidth = 100 // Approximate width of each tab
    const index = availableYears.findIndex(item => item.year === year)

    // Only scroll if we have enough tabs
    if (availableYears.length > 3 && scrollViewRef.current) {
      const scrollToX = Math.max(
        0,
        (index * tabWidth) - (screenWidth / 2) + (tabWidth / 2)
      )

      // Use requestAnimationFrame to ensure this happens after render
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          x: scrollToX,
          animated: true
        })
      })
    }
  }, [availableYears, screenWidth, scrollViewRef, setSelectedYear])

  const contentStyle = [
    $yearTabsContent,
    availableYears.length < 4 && $leftContent
  ]

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={$yearTabsContainer}
      contentContainerStyle={contentStyle}
    >
      {yearTabs.map(({ year, isSelected }) => (
        <YearTab
          key={year}
          year={year}
          isSelected={isSelected}
          onPress={() => handleTabPress(year)}
        />
      ))}
    </ScrollView>
  )
}

const $yearTabsContainer: ViewStyle = {
  maxHeight: 50,
  minHeight: 50,
}

const $yearTabsContent: ViewStyle = {
  flexDirection: 'row',
  paddingHorizontal: spacing.md,
}

const $leftContent: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-start',
}