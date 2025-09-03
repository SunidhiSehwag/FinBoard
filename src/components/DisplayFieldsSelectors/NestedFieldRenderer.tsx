import React from "react";
import classes from "./DisplayFieldSelectors.module.css";

interface Props {
  obj: Record<string, any>;
  onAdd: (key: string, value: any) => void;
  displayArray?: boolean;
  parentKey?: string;
}

const NestedFieldRenderer: React.FC<Props> = ({
  obj,
  onAdd,
  displayArray = false,
  parentKey = "",
}) => {
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
                  <NestedFieldRenderer
                    obj={value}
                    onAdd={onAdd}
                    displayArray={displayArray}
                    parentKey={fullKey}
                  />
                </>
              ) : (
                <>
                  <div className={classes.response}>{value}</div>
                  {!displayArray && (
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

export default NestedFieldRenderer;
