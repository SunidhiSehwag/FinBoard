export interface DisplayFieldSelectorsProps {
  response: Record<string, any> | null;
  selectedItems: Record<string, any>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  displayMode: "card" | "chart" | "table";
  setDisplayMode: React.Dispatch<
    React.SetStateAction<"card" | "chart" | "table">
  >;
  widgetId: string;
}
