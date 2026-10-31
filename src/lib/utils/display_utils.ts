import dayjs from "dayjs";

export function cents_to_dollar_string(cents: number): string {
  const dollars = Math.floor(Math.abs(cents) / 100);
  const leftCents = Math.abs(cents) - dollars * 100;

  const moneyStr = `${dollars}.${leftCents >= 10 ? "" : "0"}${leftCents}`;

  if (cents < 0) {
    return `$-(${moneyStr})`;
  } else {
    return `$${moneyStr}`;
  }
}

export function date_minutes_to_duration_string(dt: Date, minutes: number) {
  const start = dayjs(dt);
  const end = start.add(minutes, "minutes");

  const start_display = start.format("h:mmA");
  const end_display = end.format("h:mmA");

  return `${start_display}-${end_display}`;
}
