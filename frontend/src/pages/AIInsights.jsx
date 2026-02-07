import React, { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Loader2,
  CheckCircle,
  Activity,
  Zap,
} from "lucide-react";

const AIInsights = () => {
  const [predictions, setPredictions] = useState([]);
  const [earlyAlerts, setEarlyAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch predictions
      const predResponse = await fetch("/api/predictions");
      if (!predResponse.ok) throw new Error("Failed to fetch predictions");
      const predData = await predResponse.json();

      // Fetch early alerts
      const alertResponse = await fetch("/api/predictions/alerts");
      if (!alertResponse.ok) throw new Error("Failed to fetch AI alerts");
      const alertData = await alertResponse.json();

      setPredictions(predData.data || []);
      setEarlyAlerts(alertData.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching AI insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk) => {
    if (!risk) return "text-gray-400 bg-white/5 border-white/10";
    const upperRisk = String(risk).toUpperCase();

    switch (upperRisk) {
      case "HIGH":
      case "CRITICAL":
        return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/50";
      case "MEDIUM":
      case "WARNING":
      case "ELEVATED":
        return "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/50";
      case "LOW":
      case "NORMAL":
      case "SUCCESS":
        return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/50";
      default:
        return "text-gray-400 bg-white/5 border-white/10";
    }
  };

  const getTrendIcon = (trend) => {
    if (!trend) return <Activity className="h-4 w-4 text-[#3B82F6]" />;
    const upperTrend = String(trend).toUpperCase();

    if (upperTrend === "INCREASING")
      return <TrendingUp className="h-4 w-4 text-[#EF4444]" />;
    if (upperTrend === "DECREASING")
      return (
        <TrendingUp className="h-4 w-4 text-[#10B981] transform rotate-180" />
      );
    return <Activity className="h-4 w-4 text-[#3B82F6]" />;
  };

  const getLevelColor = (level) => {
    if (!level) return "text-white";
    const upperLevel = String(level).toUpperCase();

    switch (upperLevel) {
      case "HIGH":
      case "CRITICAL":
        return "text-[#EF4444]";
      case "MEDIUM":
      case "WARNING":
        return "text-[#F59E0B]";
      case "LOW":
      case "NORMAL":
        return "text-[#10B981]";
      default:
        return "text-white";
    }
  };

  if (loading && predictions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#10B981]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-white/10 p-3 rounded-lg shadow-lg border border-white/10">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              AI Insights & Predictions
            </h1>
            <p className="text-gray-400">
              Advanced predictive analytics for emergency resource planning
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "Never"}
          </span>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Early Alerts Section */}
      {earlyAlerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-[#F59E0B]" />
            AI Early Warning Signals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earlyAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="bg-[#0A0A0A] rounded-xl shadow-md border-l-4 border-[#EF4444] p-6 border-y border-r border-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EF4444]/10 text-[#EF4444]">
                    {alert.severity} Priority
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-white mb-2">
                  {alert.type}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {alert.message || alert.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/10 pt-3">
                  <span>Zone: {alert.zone}</span>
                  <span>
                    Confidence:{" "}
                    {alert.confidence ? Math.round(alert.confidence * 100) : 85}
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone Predictions Grid */}
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-[#3B82F6]" />
        Zone-wise Risk Predictions
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictions.map((pred, idx) => (
          <div
            key={idx}
            className={`bg-[#0A0A0A] rounded-xl shadow-lg overflow-hidden border border-white/10 border-t-4 ${
              pred.overallRisk === "High"
                ? "border-t-[#EF4444]"
                : pred.overallRisk === "Medium"
                  ? "border-t-[#F59E0B]"
                  : "border-t-[#10B981]"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">
                  {pred.zone} Zone
                </h3>
                <div
                  className={`px-4 py-1 rounded-full text-sm font-bold border ${getRiskColor(pred.overallRisk)}`}
                >
                  {pred.overallRisk} Risk
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#111111] p-3 rounded-lg border border-white/10">
                  <div className="text-sm text-gray-500 mb-1">ED Pressure</div>
                  <div
                    className={`font-semibold ${getLevelColor(pred.edPressure)}`}
                  >
                    {pred.edPressure}
                  </div>
                </div>
                <div className="bg-[#111111] p-3 rounded-lg border border-white/10">
                  <div className="text-sm text-gray-500 mb-1">
                    Ambulance Demand
                  </div>
                  <div
                    className={`font-semibold ${getLevelColor(pred.ambulancePressure)}`}
                  >
                    {pred.ambulancePressure}
                  </div>
                </div>
                <div className="bg-[#111111] p-3 rounded-lg border border-white/10">
                  <div className="text-sm text-gray-500 mb-1">
                    Accident Risk
                  </div>
                  <div
                    className={`font-semibold ${getLevelColor(pred.accidentRisk)}`}
                  >
                    {pred.accidentRisk}
                  </div>
                </div>
                <div className="bg-[#111111] p-3 rounded-lg border border-white/10">
                  <div className="text-sm text-gray-500 mb-1">Trend</div>
                  <div className="font-semibold flex items-center space-x-2 text-white">
                    {getTrendIcon(pred.trend)}
                    <span>{pred.trend}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Prediction Confidence</span>
                  <span className="font-medium text-gray-300">
                    {Math.round(pred.confidence)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-[#10B981] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pred.confidence}%` }}
                  ></div>
                </div>
              </div>

              {pred.details && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">
                    Key Factors
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pred.details.environmentalFactors?.weatherCondition && (
                      <span className="px-2 py-1 bg-[#3B82F6]/10 text-[#3B82F6] text-xs rounded border border-[#3B82F6]/20">
                        {pred.details.environmentalFactors.weatherCondition}
                      </span>
                    )}
                    {pred.details.environmentalFactors?.isRushHour && (
                      <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs rounded border border-[#F59E0B]/20">
                        Rush Hour
                      </span>
                    )}
                    {pred.details.currentActivity?.patientLoad > 5 && (
                      <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs rounded border border-[#EF4444]/20">
                        High Patient Load
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
