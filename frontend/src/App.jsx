import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Alerts from "./components/Alerts";
import MapView from "./components/MapView";
import DataImport from "./components/DataImport";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/data" element={<DataImport />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
