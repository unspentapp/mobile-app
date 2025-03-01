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

// Convert a timestamp (number) to calendar string format (YYYY-MM-DD)
export const dateToCalendarString = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
}

/*
* Util to display dates in locale
* */
export const formatDate = (
  date: string | Date | number,
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

  // Parse different input types to Date object
  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else if (typeof date === 'number') {
    dateObj = new Date(date); // Timestamp to Date
  } else {
    dateObj = date;
  }

  // Show relative dates if enabled
  if (options?.showRelative) {
    if (isToday(dateObj)) return i18n.t('common.today')
    if (isYesterday(dateObj)) return i18n.t('common.yesterday')
  }

  return format(dateObj, dateFormat ?? "MMM dd, yyyy", dateOptions)
}