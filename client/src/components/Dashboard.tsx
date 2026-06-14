import { useState, type ChangeEvent } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RecommendResponse } from "@/lib/api-types";
import CropRecommendations from "./CropRecommendations";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8000";

// const initialForm = {
//   avg_temp_30: "",
//   soil_type: "",
//   pH: "",
//   rainfall_30: "",
//   lat: "",
//   lon: "",
//   irrigation: false,
// };

const initialForm = {
  crop_year: "2020",
  season: "",
  state: "",
  area: "",
  annual_rainfall: "",
  fertilizer: "",
  pesticide: "",
};

function Dashboard() {
  const { getToken } = useAuth();

  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const required = [
      formData.crop_year,
      formData.season,
      formData.state,
      formData.area,
      formData.annual_rainfall,
      formData.fertilizer,
      formData.pesticide,
    ];

    if (required.some((value) => value === "")) {
      return "Please complete all fields.";
    }

    return null;
  };

  const predict = async () => {
  console.log("PREDICT CLICKED");

  const validationError = validateForm();

  if (validationError) {
    console.log("VALIDATION ERROR:", validationError);
    setError(validationError);
    return;
  }

  setLoading(true);
  setError(null);
  setResult(null);

  // const controller = new AbortController();
  // const timeout = window.setTimeout(
  //   () => controller.abort(),
  //   15000
  // );

  try {
    const token = await getToken();

    const payload = {
      crop_year: Number(formData.crop_year),
      season: formData.season,
      state: formData.state,
      area: Number(formData.area),
      annual_rainfall: Number(formData.annual_rainfall),
      fertilizer: Number(formData.fertilizer),
      pesticide: Number(formData.pesticide),
    };

    console.log("API URL:", API_BASE_URL);
    console.log("REQUEST BODY:", payload);

   const response = await fetch(
  `${API_BASE_URL}/api/recommend`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
    body: JSON.stringify(payload),
  }
);

    console.log("RESPONSE STATUS:", response.status);

    const data = await response.json();

    console.log("RESPONSE DATA:", data);

    if (!response.ok) {
      throw new Error(
        data.detail ||
        "The prediction service returned an error."
      );
    }

    setResult(data as RecommendResponse);

  } catch (requestError) {
    console.error("REQUEST ERROR:", requestError);

    setError(
      requestError instanceof DOMException &&
      requestError.name === "AbortError"
        ? "Prediction timed out. Please try again."
        : requestError instanceof Error
        ? requestError.message
        : "Failed to get a recommendation."
    );
  } finally {
    // window.clearTimeout(timeout);
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex gap-4 mt-10 pb-10">
      <Card className="hidden md:flex flex-col w-[30vh] rounded-r-3xl rounded-l-none">
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
      </Card>

      <div className="w-full rounded-3xl p-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Crop Recommendation System
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label htmlFor="crop_year">
                  Crop Year
                </Label>
                {/* <Input
                  id="crop_year"
                  name="crop_year"
                  type="number"
                  value={formData.crop_year}
                  onChange={handleInputChange}
                /> */}
                <Select
  value={formData.crop_year}
  onValueChange={(value) =>
    setFormData((prev) => ({
      ...prev,
      crop_year: value,
    }))
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Select Year" />
  </SelectTrigger>

  <SelectContent>
    {Array.from(
      { length: 24 },
      (_, i) => 1997 + i
    ).map((year) => (
      <SelectItem
        key={year}
        value={year.toString()}
      >
        {year}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="season">
                  Season
                </Label>

                <Select
                  value={formData.season}
                  onValueChange={(value: string) =>
                    setFormData((previous) => ({
                      ...previous,
                      season: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Season" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Kharif">
                      Kharif
                    </SelectItem>

                    <SelectItem value="Rabi">
                      Rabi
                    </SelectItem>

                    <SelectItem value="Whole Year">
                      Whole Year
                    </SelectItem>

                    <SelectItem value="Summer">
                      Summer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  State
                </Label>

                {/* <Input
                  id="state"
                  name="state"
                  placeholder="Assam"
                  value={formData.state}
                  onChange={handleInputChange}
                /> */}
                <Select
  value={formData.state}
  onValueChange={(value) =>
    setFormData((prev) => ({
      ...prev,
      state: value,
    }))
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Select State" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="Assam">Assam</SelectItem>
    <SelectItem value="Karnataka">Karnataka</SelectItem>
    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
    <SelectItem value="Kerala">Kerala</SelectItem>
    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
    <SelectItem value="Telangana">Telangana</SelectItem>
  </SelectContent>
</Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">
                  Area
                </Label>

                <Input
                  id="area"
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual_rainfall">
                  Annual Rainfall
                </Label>

                <Input
                  id="annual_rainfall"
                  name="annual_rainfall"
                  type="number"
                  value={formData.annual_rainfall}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fertilizer">
                  Fertilizer
                </Label>

                <Input
                  id="fertilizer"
                  name="fertilizer"
                  type="number"
                  value={formData.fertilizer}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesticide">
                  Pesticide
                </Label>

                <Input
                  id="pesticide"
                  name="pesticide"
                  type="number"
                  value={formData.pesticide}
                  onChange={handleInputChange}
                />
              </div>

            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div className="flex mt-6">
              <Button
                onClick={predict}
                disabled={loading}
                className="flex-1 mx-auto max-w-[60vw]"
              >
                {loading
                  ? "Getting Recommendation..."
                  : "Get Prediction"}
              </Button>
            </div>

            {result && (
              <Card className="mt-6 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Recommendation Result
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CropRecommendations
                    data={result}
                  />
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;