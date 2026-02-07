import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Alerts from "./components/Alerts";
import MapView from "./components/MapView";
import DataImportPage from "./pages/DataImport";
import AIInsights from "./pages/AIInsights";
import ManageData from "./pages/ManageData";
import AccidentLog from "./pages/AccidentLog";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/accident-log" element={<AccidentLog />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/manage" element={<ManageData />} />
          <Route path="/data" element={<DataImportPage />} />
          <Route path="/ai-insights" element={<AIInsights />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
