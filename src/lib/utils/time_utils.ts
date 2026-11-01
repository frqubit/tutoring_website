const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function get_next_month() {
  return MONTHS[(new Date().getMonth() + 1) % 12];
}

export function month_string_from_getMonth(num: number) {
  return MONTHS[num];
}
