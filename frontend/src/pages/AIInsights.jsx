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
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
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
      setError(err.message);
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
    switch (risk) {
      case "High": return "text-red-600 bg-red-100 border-red-200";
      case "Medium": return "text-orange-600 bg-orange-100 border-orange-200";
      case "Low": return "text-green-600 bg-green-100 border-green-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === "Increasing") return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (trend === "Decreasing") return <TrendingUp className="h-4 w-4 text-green-500 transform rotate-180" />;
    return <Activity className="h-4 w-4 text-blue-500" />;
  };

  if (loading && predictions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-purple-600 p-3 rounded-lg shadow-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Insights & Predictions</h1>
            <p className="text-gray-600">Advanced predictive analytics for emergency resource planning</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "Never"}
          </span>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Early Alerts Section */}
      {earlyAlerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            AI Early Warning Signals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earlyAlerts.map((alert, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md border-l-4 border-red-500 p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {alert.severity} Priority
                  </span>
                  <span className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{alert.type}</h3>
                <p className="text-gray-600 text-sm mb-4">{alert.message || alert.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                  <span>Zone: {alert.zone}</span>
                  <span>Confidence: {alert.confidence ? Math.round(alert.confidence * 100) : 85}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone Predictions Grid */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-blue-500" />
        Zone-wise Risk Predictions
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictions.map((pred, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{pred.zone} Zone</h3>
                <div className={`px-4 py-1 rounded-full text-sm font-bold border ${getRiskColor(pred.overallRisk)}`}>
                  {pred.overallRisk} Risk
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">ED Pressure</div>
                  <div className="font-semibold">{pred.edPressure}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Ambulance Demand</div>
                  <div className="font-semibold">{pred.ambulancePressure}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Accident Risk</div>
                  <div className="font-semibold">{pred.accidentRisk}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Trend</div>
                  <div className="font-semibold flex items-center space-x-2">
                    {getTrendIcon(pred.trend)}
                    <span>{pred.trend}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Prediction Confidence</span>
                  <span className="font-medium">{Math.round(pred.confidence)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pred.confidence}%` }}
                  ></div>
                </div>
              </div>

              {pred.details && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {pred.details.environmentalFactors?.weatherCondition && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                        {pred.details.environmentalFactors.weatherCondition}
                      </span>
                    )}
                    {pred.details.environmentalFactors?.isRushHour && (
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-100">
                        Rush Hour
                      </span>
                    )}
                    {pred.details.currentActivity?.patientLoad > 5 && (
                      <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-100">
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
