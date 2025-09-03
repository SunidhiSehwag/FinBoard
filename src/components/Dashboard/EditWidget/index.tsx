import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";

import { Widget, updateWidgetName } from "@/store/slices/widgetSlice";

import classes from "./EditWidget.module.css";

const EditWidget: React.FC<PopupProps> = ({ open, onClose, widget }) => {
  const dispatch = useDispatch();
  const [name, setName] = React.useState(widget.name);

  React.useEffect(() => {
    if (open) {
      setName(widget.name);
    }
  }, [open, widget]);

  const handleSave = () => {
    if (!name.trim()) return;
    dispatch(updateWidgetName({ id: widget.id, name }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className={classes.dailogbox}>
        <DialogTitle className={classes.title}>Edit Widget</DialogTitle>
        <DialogContent>
          <div className={classes.editInput}>
            <label>Name of Widget:</label>
            <input
              type="text"
              placeholder="Enter widget name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </DialogContent>
        <div className={classes.buttons}>
          <button className={classes.addButton} onClick={handleSave}>
            Save
          </button>
          <button className={classes.closeButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

interface PopupProps {
  open: boolean;
  onClose: () => void;
  widget: Widget;
}

export default EditWidget;
