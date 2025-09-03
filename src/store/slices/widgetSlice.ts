import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const loadFromLocalStorage = (): Widget[] => {
  try {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("finboard_widgets");
      if (data) return JSON.parse(data) as Widget[];
    }
  } catch (err) {
    console.error("Failed to load widgets from localStorage:", err);
  }
  return [];
};

const initialState: WidgetsState = {
  widgets: loadFromLocalStorage(),
};

const saveToLocalStorage = (widgets: Widget[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("finboard_widgets", JSON.stringify(widgets));
  }
};

const widgetSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<Widget>) => {
      state.widgets.push(action.payload);
      saveToLocalStorage(state.widgets);
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter((w) => w.id !== action.payload);
      saveToLocalStorage(state.widgets);
    },
    updateWidgetName: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const widget = state.widgets.find((w) => w.id === action.payload.id);
      if (widget) {
        widget.name = action.payload.name;
        saveToLocalStorage(state.widgets);
      }
    },
    setDisplayMode: (
      state,
      action: PayloadAction<{ id: string; mode: Widget["displayMode"] }>
    ) => {
      const widget = state.widgets.find((w) => w.id === action.payload.id);
      if (widget) {
        widget.displayMode = action.payload.mode;
        saveToLocalStorage(state.widgets);
      }
    },
    addField: (
      state,
      action: PayloadAction<{ id: string; field: string; value: any }>
    ) => {
      const widget = state.widgets.find((w) => w.id === action.payload.id);
      if (widget) {
        widget.selectedFields[action.payload.field] = action.payload.value;
        saveToLocalStorage(state.widgets);
      }
    },
    removeField: (
      state,
      action: PayloadAction<{ id: string; field: string }>
    ) => {
      const widget = state.widgets.find((w) => w.id === action.payload.id);
      if (widget) {
        delete widget.selectedFields[action.payload.field];
        saveToLocalStorage(state.widgets);
      }
    },
    clearFields: (state, action: PayloadAction<{ id: string }>) => {
      const widget = state.widgets.find((w) => w.id === action.payload.id);
      if (widget) {
        widget.selectedFields = {};
        saveToLocalStorage(state.widgets);
      }
    },
  },
});

export const {
  addWidget,
  removeWidget,
  updateWidgetName,
  setDisplayMode,
  addField,
  removeField,
  clearFields,
} = widgetSlice.actions;

export interface Widget {
  id: string;
  name: string;
  selectedFields: Record<string, any>;
  displayMode: "card" | "chart" | "table";
}

interface WidgetsState {
  widgets: Widget[];
}

export default widgetSlice.reducer;
