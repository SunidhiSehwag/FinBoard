import React, { useState, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Widget } from "@/store/slices/widgetSlice";

import AddWidgetDialog from "../AddWidgetDialog";
import EditWidget from "./EditWidget";

import classes from "./Dashboard.module.css";

const CardWidget = lazy(() => import("../Widgets/Card"));
const ChartWidget = lazy(() => import("../Widgets/Chart"));
const TableWidget = lazy(() => import("../Widgets/Table"));

const Dashboard: React.FC = () => {
  const [addWidgetActive, setAddWidgetActive] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);

  const widgets: Widget[] = useSelector(
    (state: RootState) => state.widgets.widgets
  );

  const addButtonClickHandler = () => setAddWidgetActive(true);
  const handleCloseAdd = () => setAddWidgetActive(false);

  const openEditerHandler = (widget: Widget) => setEditingWidget(widget);
  const closeEditerHandler = () => setEditingWidget(null);

  const renderWidget = (widget: Widget) => {
    switch (widget.displayMode) {
      case "card":
        return <CardWidget widget={widget} />;
      case "chart":
        return <ChartWidget widget={widget} />;
      case "table":
        return <TableWidget widget={widget} />;
      default:
        return <div>Unsupported display mode</div>;
    }
  };

  return (
    <div className={classes.dashboard}>
      <Suspense fallback={<div>Loading widget...</div>}>
        {widgets.map((widget) => (
          <div key={widget.id} className={classes.widgetCard}>
            {renderWidget(widget)}
            <div
              className={classes.editWidgetButton}
              onClick={() => openEditerHandler(widget)}
            >
              Edit
            </div>
          </div>
        ))}
      </Suspense>

      {editingWidget && (
        <EditWidget
          open={!!editingWidget}
          onClose={closeEditerHandler}
          widget={editingWidget}
        />
      )}

      <div className={classes.addWidget} onClick={addButtonClickHandler}>
        <div className={classes.addIcon}>+</div>
        <div className={classes.heading}>Add Widget</div>
        <div className={classes.subheading}>
          Connect to a finance API and create a custom Widget
        </div>
      </div>
      <AddWidgetDialog open={addWidgetActive} onClose={handleCloseAdd} />
    </div>
  );
};

export default Dashboard;
