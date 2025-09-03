import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { DisplayFieldSelectorsProps } from "./types";
import { flattenObject, filterNestedObject } from "./utils";
import NestedFieldRenderer from "./NestedFieldRenderer";
import { addField } from "@/store/slices/widgetSlice";
import classes from "./DisplayFieldSelectors.module.css";

const DisplayFieldSelectors: React.FC<DisplayFieldSelectorsProps> = ({
  response,
  selectedItems,
  setSelectedItems,
  displayMode,
  setDisplayMode,
  widgetId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  if (!response) return null;

  const flatResponse = flattenObject(response);
  const keys = Object.keys(flatResponse);

  const filteredKeys = keys.filter(
    (key) =>
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(flatResponse[key]).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nestedFiltered = searchTerm.trim()
    ? filterNestedObject(response, searchTerm)
    : response;

  const handleAdd = (key: string, value: any) => {
    setSelectedItems((prev) => ({ ...prev, [key]: value }));
    dispatch(addField({ id: widgetId, field: key, value })); // store in Redux
  };

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
        {["card", "chart", "table"].map((mode) => (
          <button
            key={mode}
            style={{ fontWeight: displayMode === mode ? "bold" : "normal" }}
            onClick={() => setDisplayMode(mode as "card" | "chart" | "table")}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
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
        checked={displayMode === "table"}
        onChange={(e) => setDisplayMode(e.target.checked ? "table" : "card")}
        className={classes.showArraycheck}
      />
      <label className={classes.showArraycheck}>
        Show array (only for table)
      </label>

      <div className={classes.subheading}>Available Fields</div>
      <div className={classes.searchResults}>
        {displayMode === "table" ? (
          nestedFiltered ? (
            <NestedFieldRenderer
              obj={nestedFiltered}
              onAdd={handleAdd}
              displayArray
            />
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

export default DisplayFieldSelectors;
