import React, { useEffect, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import { Widget } from "@/store/slices/widgetSlice";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

const ChartElement: React.FC<WidgetProps> = ({ widget }) => {
  const [chart, setChart] = useState<Chart | null>(null);

  useEffect(() => {
    const canvas = document.getElementById(
      `chart-${widget.id}`
    ) as HTMLCanvasElement | null;

    if (!canvas) return;

    if (chart) {
      chart.destroy();
    }

    const entries = Object.entries(widget.selectedFields || {});
    const labels: string[] = [];
    const values: number[] = [];

    entries.forEach(([key, value]) => {
      const shortKey = key.split(".").pop() || key;

      if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([subKey, subVal]) => {
          labels.push(`${shortKey}.${subKey}`);
          values.push(Number(subVal));
        });
      } else {
        labels.push(shortKey);
        values.push(Number(value));
      }
    });

    const newChart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: widget.name || "Line Chart",
            data: values,
            borderColor: "#04b488",
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { display: true },
          y: { display: true },
        },
      },
    });

    setChart(newChart);

    return () => {
      newChart.destroy();
    };
  }, [widget]);

  return <canvas id={`chart-${widget.id}`} />;
};

interface WidgetProps {
  widget: Widget;
}

export default ChartElement;
