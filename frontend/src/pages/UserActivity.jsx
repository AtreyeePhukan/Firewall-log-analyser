import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const UserActivity = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/activity");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "keyword_spike_alerts") {
        setAlerts((prev) => [...data.alerts, ...prev].slice(0, 20));
      }
    };

    return () => ws.close();
  }, []);

  // Calculations for metrics
  const totalEvents = alerts.length;
  const uniqueIPs = [...new Set(alerts.map((a) => a.ip))].length;
  const keywordCounts = alerts.reduce((acc, a) => {
    acc[a.keyword] = (acc[a.keyword] || 0) + 1;
    return acc;
  }, {});
  const topKeyword =
    Object.entries(keywordCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">USER ACTIVITY ANALYSIS</h1>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 pt-8 pb-12 space-y-10">
        {/* Metric cards */}
        <div className="dashboard-grid rounded-xl">
          <div className="dashboard-card">
            <p className="text-xs text-gray-400 uppercase">Total Events</p>
            <p className="text-3xl font-bold">{totalEvents}</p>
          </div>
          <div className="dashboard-card">
            <p className="text-xs text-gray-400 uppercase">Unique IPs</p>
            <p className="text-3xl font-bold">{uniqueIPs}</p>
          </div>
          <div className="dashboard-card">
            <p className="text-xs text-gray-400 uppercase">Top Keyword</p>
            <p className="text-lg text-blue-400">{topKeyword}</p>
          </div>
        </div>

<div className="dashboard-card chart-span">
  <div className="overflow-x-auto">
    <table className="w-full table-auto border-separate border-spacing-0 border border-gray-700 text-sm text-white">
      <thead>
        <tr className="bg-gray-800">
          <th className="px-4 py-3 border border-gray-700 text-left">IP Address</th>
          <th className="px-4 py-3 border border-gray-700 text-left">Keyword</th>
          <th className="px-4 py-3 border border-gray-700 text-left">Count</th>
          <th className="px-4 py-3 border border-gray-700 text-left">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map((alert, index) => (
          <tr key={index} className="hover:bg-zinc-800">
            <td className="px-4 py-2 border border-gray-700 break-words">{alert.ip}</td>
            <td className="px-4 py-2 border border-gray-700 break-words">{alert.keyword}</td>
            <td className="px-4 py-2 border border-gray-700 text-center">{alert.count}</td>
            <td className="px-4 py-2 border border-gray-700 break-words">
              {new Date(alert.timestamp).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {alerts.length === 0 && (
      <p className="text-gray-400 mt-4 text-center">
        Waiting for suspicious activity...
      </p>
    )}
  </div>
</div>

      </main>
    </div>
  );
};

export default UserActivity;





// import React, { useEffect, useState } from "react";

// const UserActivity = () => {
//   const [alerts, setAlerts] = useState([]);

//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8000/ws/activity");

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === "keyword_spike_alerts") {
//         setAlerts((prev) => [...data.alerts, ...prev].slice(0, 20));
//       }
//     };

//     return () => ws.close();
//   }, []);

//   // Calculate total events, unique IPs, and top keyword
//   const totalEvents = alerts.length;
//   const uniqueIPs = [...new Set(alerts.map((a) => a.ip))].length;
//   const keywordCounts = alerts.reduce((acc, a) => {
//     acc[a.keyword] = (acc[a.keyword] || 0) + 1;
//     return acc;
//   }, {});
//   const topKeyword =
//     Object.entries(keywordCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Header */}
//       <header className="dashboard-header">
//         <h1 className="dashboard-title">USER ACTIVITY ANALYSIS</h1>
//       </header>

//       {/* Content Wrapper */}
//       <main className="max-w-6xl mx-auto px-4 pt-8 pb-12 space-y-10">
//         {/* Metric Cards */}
//         <div className="dashboard-grid rounded-xl">
//           <div className="dashboard-card">
//             <p className="text-xs text-gray-400 uppercase">Total Events</p>
//             <p className="text-3xl font-bold">{totalEvents}</p>
//           </div>
//           <div className="dashboard-card">
//             <p className="text-xs text-gray-400 uppercase">Unique IPs</p>
//             <p className="text-3xl font-bold">{uniqueIPs}</p>
//           </div>
//           <div className="dashboard-card">
//             <p className="text-xs text-gray-400 uppercase">Top Keyword</p>
//             <p className="text-lg text-blue-400">{topKeyword}</p>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="dashboard-card chart-span">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm text-white">
//               <thead>
//                 <tr className="bg-gray-800 text-left">
//                   <th className="px-4 py-2">IP Address</th>
//                   <th className="px-4 py-2">Keyword</th>
//                   <th className="px-4 py-2">Count</th>
//                   <th className="px-4 py-2">Timestamp</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {alerts.map((alert, index) => (
//                   <tr
//                     key={index}
//                     className="border-t border-gray-700 hover:bg-gray-800"
//                   >
//                     <td className="px-4 py-2">{alert.ip}</td>
//                     <td className="px-4 py-2">{alert.keyword}</td>
//                     <td className="px-4 py-2">{alert.count}</td>
//                     <td className="px-4 py-2">
//                       {new Date(alert.timestamp).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {alerts.length === 0 && (
//               <p className="text-gray-400 mt-4 text-center">
//                 Waiting for suspicious activity...
//               </p>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserActivity;

