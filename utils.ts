export function currencyFormat(num?: number) {
  if (!num) {
    return 0;
  }

  return Number(num)
    .toFixed(num < 1 ? 9 : 2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
