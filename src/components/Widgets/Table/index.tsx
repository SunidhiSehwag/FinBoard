import { useDispatch } from "react-redux";
import { removeWidget, Widget } from "@/store/slices/widgetSlice";

import classes from "./Table.module.css";

const TableWidget: React.FC<WidgetProps> = ({ widget }) => {
  const dispatch = useDispatch();
  const handleDelete = (id: string) => dispatch(removeWidget(id));

  const trimValue = (val: unknown): string => {
    if (typeof val === "number") return val.toFixed(2);
    if (typeof val === "string" && !isNaN(Number(val))) {
      return Number(val).toFixed(2);
    }
    return String(val);
  };

  return (
    <div>
      <div className={classes.tableHeading}>
        <div className={classes.tableName}>{widget.name}</div>
        <button
          className={classes.deleteButton}
          onClick={() => handleDelete(widget.id)}
        >
          X
        </button>
      </div>
      <table className={classes.table}>
        <thead>
          <tr className={classes.RowHead}>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(widget.selectedFields).map(([key, value]) => {
            const shortKey = key.split(".").pop() || key;

            if (typeof value === "object" && value !== null) {
              return Object.entries(value).map(([subKey, subVal]) => (
                <tr key={`${key}.${subKey}`}>
                  <td>{`${shortKey}.${subKey}`}</td>
                  <td>{trimValue(subVal)}</td>
                </tr>
              ));
            } else {
              return (
                <tr key={key}>
                  <td>{shortKey}</td>
                  <td>{trimValue(value)}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

interface WidgetProps {
  widget: Widget;
}
export default TableWidget;
