// dispaly Money In Indian Format with Rs prefix
export const dispalyMoney = function(num) {
  const roundedNum = Math.round(num);
  return `Rs ${roundedNum.toLocaleString("en-IN")}`;
};

// Calculate Discount Percentage
export const calculateDiscount = (discountedPrice, originalPrice) => {
  const disCountPercent = (discountedPrice / originalPrice) * 100;
  return disCountPercent;
};



// calculate Total  Amount
export const calculateTotal = (arr) => {
  const total = arr.reduce((accum, curr) => accum + curr, 0);
  return total;
};


export function generateDiscountedPrice(price, discountAmount = 0) {
  const discountedPrice = price - (discountAmount || 0);
  return discountedPrice.toFixed(2); 
}

