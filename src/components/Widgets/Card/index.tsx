import { useDispatch } from "react-redux";
import { removeWidget, Widget } from "@/store/slices/widgetSlice";
import classes from "./Card.module.css";

const CardWidget: React.FC<WidgetProps> = ({ widget }) => {
  const dispatch = useDispatch();

  const handleDelete = (id: string) => dispatch(removeWidget(id));

  const trimValue = (val: unknown): string => {
    if (typeof val === "number") return val.toFixed(5);
    if (typeof val === "string" && !isNaN(Number(val))) {
      return Number(val).toFixed(5);
    }
    return String(val);
  };

  return (
    <div className={classes.card}>
      <div className={classes.cardHeading}>
        <div className={classes.cardName}>{widget.name}</div>
        <button
          className={classes.deleteButton}
          onClick={() => handleDelete(widget.id)}
        >
          X
        </button>
      </div>

      <div className={classes.cardBody}>
        {Object.entries(widget.selectedFields).map(([key, value]) => {
          const lastkey = key.split(".").pop();
          return (
            <div key={key} className={classes.row}>
              <span className={classes.key}>{lastkey}</span>
              <span className={classes.value}>{trimValue(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface WidgetProps {
  widget: Widget;
}

export default CardWidget;
