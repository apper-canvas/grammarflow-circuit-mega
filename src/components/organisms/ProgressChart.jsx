import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Chart from "react-apexcharts";
import { format, subDays } from "date-fns";
import progressService from "@/services/api/progressService";

const ProgressChart = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("7days");

  useEffect(() => {
    loadProgressData();
  }, [userId, timeRange]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError("");
      const progressData = await progressService.getProgressHistory(userId, timeRange);
      setData(progressData);
    } catch (err) {
      setError("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      background: "transparent"
    },
    colors: ["#4f46e5", "#7c3aed"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4
    },
    xaxis: {
      categories: data.map(item => format(new Date(item.date), "MMM dd")),
      labels: {
        style: { colors: "#64748b", fontSize: "12px" }
      }
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
        formatter: (value) => `${value}%`
      }
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `${value}% accuracy`
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "right"
    }
  };

  const chartSeries = [
    {
      name: "Accuracy",
      data: data.map(item => item.accuracy)
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProgressData} />;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Progress Over Time</h3>
        <div className="flex space-x-2">
          {[
            { value: "7days", label: "7 Days" },
            { value: "30days", label: "30 Days" },
            { value: "90days", label: "90 Days" }
          ].map((option) => (
            <Button
              key={option.value}
              variant={timeRange === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {data.length > 0 ? (
        <Chart 
          options={chartOptions} 
          series={chartSeries} 
          type="area" 
          height={350} 
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No progress data available yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Complete some quizzes to see your progress here
          </p>
        </div>
      )}
    </Card>
  );
};

export default ProgressChart;