import * as React from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { CloseIcon } from "@/helpers/icons";
import DisplayFieldSelectors from "@/components/DisplayFieldsSelectors";
import { addWidget } from "@/store/slices/widgetSlice";

import classes from "./AddWidgetDialog.module.css";

const AddWidgetDialog: React.FC<PopupProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();

  // Form state
  const [widgetName, setWidgetName] = React.useState<string>("");
  const [apiUrl, setApiUrl] = React.useState<string>("");
  const [apiResult, setApiResult] = React.useState<ApiResponse | null>(null);
  const [error, setError] = React.useState<string>("");
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const [widgetId] = React.useState<string>(uuidv4());

  // Selected fields & display mode
  const [selectedItems, setSelectedItems] = React.useState<Record<string, any>>(
    {}
  );
  const [displayMode, setDisplayMode] = React.useState<
    "card" | "chart" | "table"
  >("card");

  // Show alert when API result is available
  React.useEffect(() => {
    if (apiResult) setShowAlert(true);
  }, [apiResult]);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowAlert(false), 3000);
    return () => clearTimeout(timer);
  }, [apiResult]);

  // Test API
  const checkAPICall = async (): Promise<void> => {
    try {
      setError("");
      setApiResult(null);

      const url =
        apiUrl || "https://api.coinbase.com/v2/exchange-rates?currency=BTC";
      const response = await fetch(url);

      if (!response.ok)
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      const data: ApiResponse = await response.json();
      setApiResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Reset form
  const resetForm = (): void => {
    setWidgetName("");
    setApiUrl("");
    setApiResult(null);
    setError("");
    setSelectedItems({});
    setDisplayMode("card");
  };

  // Add widget to Redux
  const handleAddWidget = () => {
    if (!widgetName) return alert("Widget name is required!");

    dispatch(
      addWidget({
        id: uuidv4(),
        name: widgetName,
        selectedFields: selectedItems,
        displayMode,
      })
    );

    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className={classes.dailogBody}>
      <div className={classes.dailogbox}>
        <DialogTitle className={classes.title}>
          Add New Widget
          <span onClick={onClose}>
            <CloseIcon />
          </span>
        </DialogTitle>

        <DialogContent>
          <div className={classes.inputLabels}>
            <label>Widget Name</label>
            <input
              placeholder="e.g., Bitcoin Price Tracker"
              type="text"
              required
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
            />

            <label>API URL</label>
            <div className={classes.testButtondiv}>
              <input
                placeholder="e.g., https://api.coinbase.com/v2/exchange-rates?currency=BTC"
                type="url"
                required
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
              <button className={classes.testButton} onClick={checkAPICall}>
                Test
              </button>
            </div>

            {apiResult && showAlert && (
              <div className={classes.alertMessage}>
                API connection successful!
              </div>
            )}

            <label>Refresh Interval (seconds)</label>
            <input type="number" defaultValue={30} readOnly />
          </div>

          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>
              Error: {error}
            </div>
          )}

          {apiResult && (
            <DisplayFieldSelectors
              response={apiResult}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              widgetId={widgetId}
            />
          )}

          {apiResult && (
            <div>
              <div className={classes.subheading}>API Response</div>
              <pre
                style={{
                  marginTop: "10px",
                  maxHeight: "150px",
                  overflow: "auto",
                  background: "#111",
                  color: "#0f0",
                  padding: "10px",
                }}
              >
                {JSON.stringify(apiResult, null, 2)}
              </pre>
            </div>
          )}
        </DialogContent>

        <div className={classes.buttons}>
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className={classes.closeButton}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddWidget}
            className={classes.addButton}
          >
            Add Widget
          </button>
        </div>
      </div>
    </Dialog>
  );
};

interface PopupProps {
  open: boolean;
  onClose: () => void;
}

type ApiResponse = Record<string, any>;

export default AddWidgetDialog;
