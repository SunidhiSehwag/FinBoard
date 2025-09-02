import React from "react";

const CloseIcon = (props: Props) => {
  const { width = 30, height = 30, color = "#fff" } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 58 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={width} height={height} fill={color} fillOpacity="0.01" />
      <path
        d="M14 14L34 34"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 34L34 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
type Props = {
  width?: number;
  height?: number;
  color?: string;
};
export default React.memo(CloseIcon);
