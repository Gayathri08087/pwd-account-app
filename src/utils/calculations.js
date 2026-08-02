export const total = (arr, field) =>
  arr.reduce((a, b) => a + Number(b[field] || 0), 0);