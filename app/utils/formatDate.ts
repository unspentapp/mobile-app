// Note the syntax of these imports from the date-fns library.
// If you import with the syntax: import { format } from "date-fns" the ENTIRE library
// will be included in your production bundle (even if you only use one function).
// This is because react-native does not support tree-shaking.
import { isToday, isYesterday, Locale } from "date-fns"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import ar from "date-fns/locale/ar-SA"
import ko from "date-fns/locale/ko"
import en from "date-fns/locale/en-US"
import { i18n } from "app/i18n"

type Options = Parameters<typeof format>[2]

const getLocale = (): Locale => {
  const locale = i18n.locale.split("-")[0]
  return locale === "ar" ? ar : locale === "ko" ? ko : en
}

// Accept either string or Date
export const formatDate = (
  date: string | Date,
  dateFormat?: string,
  options?: Options & {
    showRelative?: boolean // Show "Today" or "Yesterday" if applicable
  }
) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }

  // Parse if string, otherwise use as is
  const dateObj = typeof date === 'string' ? parseISO(date) : date

  // Show relative dates if enabled
  if (options?.showRelative) {
    if (isToday(dateObj)) return i18n.t('common.today')
    if (isYesterday(dateObj)) return i18n.t('common.yesterday')
  }

  return format(dateObj, dateFormat ?? "MMM dd, yyyy", dateOptions)
}
