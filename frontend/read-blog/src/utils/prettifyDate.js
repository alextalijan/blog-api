function prettifyDate(date) {
  const d = new Date(date);
  const formatted = d.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return formatted;
}

export default prettifyDate;
