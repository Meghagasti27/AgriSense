import React from "react";

const CropRecommendations = ({ data }) => {
  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.recommendations.map((item, idx) => (
        <div
          key={idx}
          className="border rounded-xl p-4 shadow hover:shadow-lg transition-all"
        >
          <h2 className="text-xl font-semibold">{item.crop}</h2>

          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p><strong>Yield:</strong> {item.estimated_yield_kg_per_acre} kg/acre</p>
            <p><strong>Profit:</strong> ₹{item.estimated_profit_inr_per_acre}/acre</p>
            <p><strong>Risk:</strong> {item.risk}</p>
            <p><strong>Confidence:</strong> {item.confidence}%</p>
            <p><strong>Min Yield:</strong> {item.min_yield}</p>
            <p><strong>Max Yield:</strong> {item.max_yield}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CropRecommendations;
