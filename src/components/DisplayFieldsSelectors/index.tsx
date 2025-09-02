import React from "react";

const DisplayFieldSelectors = (response: DisplayFieldSelectorsProps) => {
  if (!response) return null;

  // If response is nested, you might want to inspect keys
  const keys = Object.keys(response);

  return (
    <div>
      <h4>Select fields to display:</h4>
      <ul>
        {keys.map((key) => (
          <li key={key}>
            <label>
              <input type="checkbox" value={key} />
              {key}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
interface DisplayFieldSelectorsProps {
  response: Record<string, string | number> | null;
}

export default DisplayFieldSelectors;
