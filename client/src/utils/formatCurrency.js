export function formatPriceInRupees(amount) {
  return amount?.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });
}