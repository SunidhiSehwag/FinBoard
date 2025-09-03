// Flatten nested object
export const flattenObject = (
  obj: Record<string, any>,
  parentKey = ""
): Record<string, string | number> => {
  let result: Record<string, string | number> = {};
  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      result = { ...result, ...flattenObject(obj[key], newKey) };
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
};

// Recursive search filter
export const filterNestedObject = (
  obj: Record<string, any>,
  searchTerm: string
): Record<string, any> | null => {
  const lower = searchTerm.toLowerCase();
  let hasMatch = false;
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      const filteredChild = filterNestedObject(value, searchTerm);
      if (filteredChild && Object.keys(filteredChild).length > 0) {
        result[key] = filteredChild;
        hasMatch = true;
      }
    } else if (
      key.toLowerCase().includes(lower) ||
      String(value).toLowerCase().includes(lower)
    ) {
      result[key] = value;
      hasMatch = true;
    }
  }

  return hasMatch ? result : null;
};
