export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    dates.push(dateString);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
};
