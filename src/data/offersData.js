const offers = [
  {
    id: 1,
    title: "Flat 20% OFF",
    coupon: "SAVE20",
    bg: "bg-pink-50",
    text: "text-pink-600",
    type: "percent",        // ✅ add type
    discountValue: 20       // ✅ percent value
  },
  {
    id: 2,
    title: "Get ₹100 OFF on orders above ₹999",
    coupon: "FLAT100",
    bg: "bg-green-50",
    text: "text-green-600",
    type: "flat",           // ✅ add type
    discountValue: 100,     // ✅ flat value
    minAmount: 999
  }
];

export default offers;
