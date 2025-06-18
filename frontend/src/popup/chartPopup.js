import React, { useContext } from "react";
import PopupContext from "../context/popupContext";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Ensure you import Chart.js correctly

function ChartPopup() {
  const {
    patents,
    closeUpdatePopup, // Assuming you have a close function
  } = useContext(PopupContext);

  // Extracting label and data for the chart
  let labels = patents.reduce((acc, patent) => {
    if (acc[patent.STATUS] >= 0) {
      acc[patent.STATUS] += 1;
    } else {
      acc[patent.STATUS] = 0;
    }
    return acc;
  }, {});
  const data = Object.values(labels);
  labels = Object.keys(labels);
  console.log("labels", labels);
  console.log("data", data);
  // Chart data and options
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Patent Status",
        data: data,
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Red background for bars
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ensure ticks are displayed as whole numbers
        },
      },
    },
  };

  return (
    <div className="popup">
      <div className="popup-content bg-white shadow-md rounded-md p-4">
        <div className="popup-header relative mb-4">
          <div className="pop-header text-3xl font-semibold bg-yellow-300 p-4 rounded-lg text-center">
            Chart Analysis
          </div>
          <span
            className="close cursor-pointer absolute top-0 right-0 p-3 text-xl"
            onClick={closeUpdatePopup} // Assuming you have a close function
          >
            &times;
          </span>
        </div>

        {/* Render the BarChart component */}
        <div className="chart-container" style={{ height: "400px" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default ChartPopup;
