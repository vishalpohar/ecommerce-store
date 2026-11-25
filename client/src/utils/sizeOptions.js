export const SIZE_OPTIONS_BY_CATEGORY = {
  shirts: ["S", "M", "L", "XL", "XXL"],
  "t-shirts": ["S", "M", "L", "XL", "XXL"],
  jackets: ["S", "M", "L", "XL", "XXL"],
  suits: ["38", "40", "42", "44", "46"],
  pants: ["28", "30", "32", "34", "36", "38"],
  shoes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  bags: ["One Size"],
  glasses: ["One Size"],
};

export const getSizeOptionsForCategory = (category = "") => {
  return SIZE_OPTIONS_BY_CATEGORY[category.toLowerCase()] || ["One Size"];
};

export const hasMultipleSizes = (sizes) => {
  return (
    Array.isArray(sizes) &&
    sizes.length > 0 &&
    !(sizes.length === 1 && sizes[0] === "One Size")
  );
};
