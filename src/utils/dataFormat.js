export const formatCurrency = (amount) => {
  return "Rs. " + Number(amount || 0).toLocaleString("en-IN");
};

export const formatDate = () => {
  return new Date().toLocaleDateString("en-IN");
};

export const calculateTotal = (arr, key) => {
  return arr.reduce((sum, item) => sum + Number(item[key] || 0), 0);
};
