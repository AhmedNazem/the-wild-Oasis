import { formatDistance, parseISO, differenceInDays } from "date-fns";

// Your helper functions...

// A utility function to calculate the difference in days between two dates.
// Accepts both Date objects and strings, ensuring compatibility with Supabase.
export const subtractDates = (date1, date2) => {
  const parsedDate1 = parseISO(String(date1));
  const parsedDate2 = parseISO(String(date2));
  return differenceInDays(parsedDate1, parsedDate2);
};

// Formats a date string as a human-readable distance from now, e.g., "2 days ago".
// Removes "about" for cleaner formatting and adjusts phrasing for consistency.
export const formatDistanceFromNow = (date) =>
  formatDistance(parseISO(String(date)), new Date(), { addSuffix: true })
    .replace("about ", "")
    .replace("in", "In");

// Returns today's date as an ISO string.
// Can return either the start or the end of the day based on the `end` option.
export const getToday = ({ end = false } = {}) => {
  const today = new Date();
  if (end) {
    today.setUTCHours(23, 59, 59, 999); // Set to the last second of the day
  } else {
    today.setUTCHours(0, 0, 0, 0); // Set to the first second of the day
  }
  return today.toISOString();
};

// Formats a numeric value as a currency string in USD.
export const formatCurrency = (value) => {
  if (typeof value !== "number") {
    throw new Error("formatCurrency expects a number as input.");
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default formatCurrency;
