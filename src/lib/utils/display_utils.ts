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
