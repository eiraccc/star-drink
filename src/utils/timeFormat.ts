import { Timestamp } from "firebase/firestore";
import { formatInTimeZone } from "date-fns-tz";

// Format the time according to the user's time zone
export const formatTimestampToUserLocalString = (timestamp: Timestamp | undefined | null): string => {
    if (!timestamp) return '';
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    return formatInTimeZone(timestamp.toDate(), userTimeZone, "yyyy-MM-dd HH:mm:ss");
  }
  