import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import classes from "./AddWidgetDialog.module.css";
import { CloseIcon } from "@/helpers/icons";
import DisplayFieldSelectors from "../DisplayFieldsSelectors";

interface PopupProps {
  open: boolean;
  onClose: () => void;
}

// You can replace this with a more specific API response type if needed
type ApiResponse = Record<string, any>;

const AddWidgetDialog: React.FC<PopupProps> = ({ open, onClose }) => {
  const [apiUrl, setApiUrl] = React.useState<string>("");
  const [apiResult, setApiResult] = React.useState<ApiResponse | null>(null);
  const [error, setError] = React.useState<string>("");

  const checkAPICall = async (): Promise<void> => {
    try {
      setError("");
      setApiResult(null);

      const url =
        apiUrl || "https://api.coinbase.com/v2/exchange-rates?currency=BTC";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setApiResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  const resetForm = (): void => {
    setApiUrl("");
    setApiResult(null);
    setError("");
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
            />

            <div>
              <label>API URL</label>
              <div className={classes.testButtondiv}>
                <input
                  placeholder="e.g., https://api.coinbase.com/v2/exchange-rates?currency=BTC"
                  type="url"
                  required
                  value={apiUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setApiUrl(e.target.value)
                  }
                />
                <button
                  type="button"
                  className={classes.testButton}
                  onClick={checkAPICall}
                >
                  Test
                </button>
              </div>

              {apiResult && (
                <div className={classes.alertMessage}>
                  API connection successful!
                </div>
              )}
            </div>

            <label>Refresh Interval (seconds)</label>
            <input type="number" defaultValue={30} />
          </div>

          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>
              Error: {error}
            </div>
          )}

          {apiResult && <DisplayFieldSelectors response={apiResult} />}

          {apiResult && (
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
            onClick={onClose}
            autoFocus
            className={classes.addButton}
          >
            Add Widget
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddWidgetDialog;
