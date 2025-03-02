const dateFormatter = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    date.setHours(0, 0, 0, 0);
    return date;
};

const dateNextDay = (startDate) => {
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) return null;

    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    return nextDay;
};

// Export using CommonJS
module.exports = { dateFormatter, dateNextDay };
