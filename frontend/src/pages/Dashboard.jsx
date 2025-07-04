import { useState } from "react";
import UploadButton from "@/components/UploadButton";
import LineChartComponent from "@/components/charts/LineChart";
import BarChartComponent from "@/components/charts/BarChart";
import DonutChartComponent from "@/components/charts/DonutChart";
import { useDashboardSocket } from "@/hooks/useDashboardSocket";
import Header from "@/components/Header";
import LayoutWrapper from "@/components/LayoutWrapper";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {

  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [lineData, setLineData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [donutData, setDonutData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { data: dashboardData } = useDashboardSocket();

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload/", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const json = await res.json();
      setLogs(json.logs);
      setLineData(json.lineData);
      setBarData(json.barData);
      setDonutData(json.donutData);
      setDataLoaded(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {!dataLoaded ? (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <UploadButton onFileSelected={handleFileUpload} />
        </div>
      ) : (
        <LayoutWrapper>
          <main className="max-w-6xl mx-auto px-4 pt-0 pb-8 space-y-8 -mt-6">
            {/* Grid Container */}
            <div className="dashboard-grid rounded-xl">
              {/* Metric Cards */}
              <div className="dashboard-card">
                <p className="text-xs text-gray-400 uppercase">Active Users</p>
                <p className="text-3xl font-bold">{dashboardData?.active_users ?? "—"}</p>
              </div>
              <div className="dashboard-card">
                <p className="text-xs text-gray-400 uppercase">Events / Min</p>
                <p className="text-3xl font-bold">{dashboardData?.events_per_minute ?? "—"}</p>
              </div>
              <div className="dashboard-card">
                <p className="text-xs text-gray-400 uppercase">Alerts</p>
                <p className="text-3xl font-bold text-red-500">{dashboardData?.alerts ?? "—"}</p>
              </div>

              {/* Line Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dashboard-card chart-span">
                <LineChartComponent data={lineData} />
              </div>
              </div>

              {/* Bar Chart */}
              <div className="dashboard-card chart-span">
                <BarChartComponent data={barData} />
              </div>

        <div className="dashboard-card flex items-center justify-center h-[calc(100vh-100px)]">
  <button
    onClick={() => navigate("/user-activity")}
    className="relative px-6 py-2 text-white font-semibold rounded-md bg-black overflow-hidden z-0 group"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-25 blur-md group-hover:opacity-50 transition duration-300 z-[-1]"></span>
    <span className="relative z-10">Check User Activity</span>
  </button>
</div>



            <div className="dashboard-card chart-span">
                <DonutChartComponent data={donutData} />
              </div>


            </div>
          </main>
        </LayoutWrapper>
      )}
    </div>
  );
}
