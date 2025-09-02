import React, { useState } from "react";
import classes from "./DisplayFieldSelectors.module.css";

const flattenObject = (
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
const filterNestedObject = (
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

// Recursive renderer for nested objects
const renderNestedObject = (
  obj: Record<string, any>,
  parentKey = "",
  onAdd: (key: string, value: any) => void,
  displayArray = false
) => {
  return (
    <ul className={classes.searchListul}>
      {Object.entries(obj).map(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        return (
          <li key={fullKey}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className={classes.keyName}>{fullKey}</div>
              {typeof value === "object" && value !== null ? (
                <>
                  <button
                    className={classes.addButton}
                    onClick={() => onAdd(fullKey, value)}
                  >
                    +
                  </button>
                  {renderNestedObject(value, fullKey, onAdd, displayArray)}
                </>
              ) : (
                <>
                  <div className={classes.response}>{value}</div>
                  {!displayArray && ( // ❌ Don't show + for primitives in table mode
                    <button
                      className={classes.addButton}
                      onClick={() => onAdd(fullKey, value)}
                    >
                      +
                    </button>
                  )}
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const DisplayFieldSelectors: React.FC<DisplayFieldSelectorsProps> = ({
  response,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    Record<string, string | number | object>
  >({});
  const [displayArray, setDisplayArray] = useState<boolean>(false);

  if (!response) return null;

  const flatResponse = flattenObject(response);
  const keys = Object.keys(flatResponse);

  const filteredKeys = keys.filter(
    (key) =>
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(flatResponse[key]).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter nested object when in "array mode"
  const nestedFiltered =
    searchTerm.trim() && displayArray
      ? filterNestedObject(response, searchTerm)
      : response;

  // Add to selected
  const handleAdd = (key: string, value: any) => {
    setSelectedItems((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Remove from selected
  const handleRemove = (key: string) => {
    setSelectedItems((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  return (
    <div className={classes.fieldSelector}>
      <div className={classes.heading}>Select fields to display:</div>

      <div className={classes.subheading}>Display Mode</div>
      <div className={classes.modes}>
        <button>Card</button>
        <button>Chart</button>
        <button>Table</button>
      </div>

      <div className={classes.subheading}>Search Fields</div>
      <input
        type="text"
        placeholder="Search for fields..."
        className={classes.inputBox}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="checkbox"
        checked={displayArray}
        onChange={(e) => setDisplayArray(e.target.checked)}
        className={classes.showArraycheck}
      />
      <label className={classes.showArraycheck}>
        Show array (only for table)
      </label>

      {/* Search Feature */}
      <div className={classes.subheading}>Available Fields</div>
      <div className={classes.searchResults}>
        {displayArray ? (
          nestedFiltered ? (
            renderNestedObject(nestedFiltered, "", handleAdd, displayArray)
          ) : (
            <div>No matching results</div>
          )
        ) : filteredKeys.length > 0 ? (
          <ul className={classes.searchListul}>
            {filteredKeys.map((key) => (
              <li key={key}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={classes.keyName}>{key}</div>
                  <div className={classes.response}>{flatResponse[key]}</div>
                </div>
                <button
                  className={classes.addButton}
                  onClick={() => handleAdd(key, flatResponse[key])}
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>No matching results</div>
        )}
      </div>

      {/* Selected Fields */}
      <div className={classes.subheading}>Selected Fields</div>
      <div className={classes.searchResults}>
        {Object.keys(selectedItems).length > 0 ? (
          <ul className={classes.searchListul}>
            {Object.entries(selectedItems).map(([key, value]) => (
              <li key={key}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={classes.keyName}>{key}</div>
                  <div className={classes.response}>
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : value}
                  </div>
                </div>
                <button
                  className={classes.addButton}
                  onClick={() => handleRemove(key)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>No fields selected</div>
        )}
      </div>
    </div>
  );
};

interface DisplayFieldSelectorsProps {
  response: Record<string, any> | null;
}

export default DisplayFieldSelectors;
