import { useDispatch } from "react-redux";

import { removeWidget, Widget } from "@/store/slices/widgetSlice";
import ChartElement from "./ChartElement";

import classes from "./Chart.module.css";

const ChartWidget: React.FC<WidgetProps> = ({ widget }) => {
  const dispatch = useDispatch();
  const handleDelete = (id: string) => dispatch(removeWidget(id));

  return (
    <div>
      <div className={classes.chartHeading}>
        <div className={classes.chartName}>{widget.name}</div>
        <button
          className={classes.deleteButton}
          onClick={() => handleDelete(widget.id)}
        >
          X
        </button>
      </div>
      <ChartElement widget={widget} />
    </div>
  );
};
interface WidgetProps {
  widget: Widget;
}
export default ChartWidget;
