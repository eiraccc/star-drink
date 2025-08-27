import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const formatTimestampToUserLocalString = (
  timestamp: string | undefined | null,
  pattern: string = "yyyy-MM-dd HH:mm:ss"
): string => {
  if (!timestamp) return "";

  const date = parseISO(timestamp);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return formatInTimeZone(date, userTimeZone, pattern);
};