import type { RecommendResponse } from "@/lib/api-types";

interface CropRecommendationsProps {
  data: RecommendResponse;
}

const CropRecommendations = ({ data }: CropRecommendationsProps) => {
  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.recommendations.map((item) => (
        <div
          key={item.rank}
          className="border rounded-xl p-4 shadow hover:shadow-lg transition-all"
        >
          <h2 className="text-xl font-semibold">
            #{item.rank} {item.crop}
          </h2>

          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p>
              <strong>Predicted Yield:</strong>{" "}
              {item.estimated_yield}
            </p>

            <p>
              <strong>Estimated Profit:</strong>{" "}
              ₹{item.estimated_profit}
            </p>

            <p>
              <strong>Rank:</strong>{" "}
              {item.rank}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CropRecommendations;