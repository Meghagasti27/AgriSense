import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from 'react';
import CropRecommendations from './CropRecommendations';
function Dashboard() {
    const { getToken } = useAuth();

    useEffect(() => {
        const callApi = async () => {
            const token = await getToken();
            const res = await fetch("http://localhost:8000/api/model-info", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });
            console.log(await res.json());
        };
        callApi();
    }, []);

    const fetchCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    lat: position.coords.latitude.toFixed(4),
                    lon: position.coords.longitude.toFixed(4)
                }));
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please enter manually.');
            }
        );
    };

    const [formData, setFormData] = useState({
        avg_temp_30: '',
        soil_type: '',
        pH: '',
        rainfall_30: '',
        lat: '',
        lon: '',
        irrigation: false
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        console.log(formData);
    };

    const handleSoilTypeChange = (value:any) => {
        setFormData(prev => ({ ...prev, soil_type: value }));
        console.log(formData);
    };

    const pred = async () => {
        setLoading(true);
        setResult(null);

        try {
            const token = await getToken();
            const res = await fetch("http://localhost:8000/api/recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    avg_temp_30: parseFloat(formData.avg_temp_30),
                    soil_type: formData.soil_type,
                    pH: parseFloat(formData.pH),
                    rainfall_30: parseFloat(formData.rainfall_30),
                    lat: parseFloat(formData.lat),
                    lon: parseFloat(formData.lon),
                    irrigation: formData.irrigation
                }),
                credentials: "include",
            });

            const data = await res.json();
            setResult(data);
            console.log("Recommendation result:", data);
            setResult(data);
        } catch (error) {
            console.error("Error getting recommendation:", error);
            setResult({ error: "Failed to get recommendation" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex gap-4 mt-10 h-[80vh]">
            <Card className='hidden md:flex flex-col w-[30vh] rounded-r-3xl rounded-l-none'>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
            </Card>
            <div className="w-full rounded-3xl font-bold p-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Crop Recommendation System</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Average Temperature */}
                            <div className="space-y-2">
                                <Label htmlFor="avg_temp_30">Average Temperature (°C)</Label>
                                <Input
                                    id="avg_temp_30"
                                    name="avg_temp_30"
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g., 30"
                                    value={formData.avg_temp_30}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Rainfall */}
                            <div className="space-y-2">
                                <Label htmlFor="rainfall_30">Rainfall (mm)</Label>
                                <Input
                                    id="rainfall_30"
                                    name="rainfall_30"
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g., 200"
                                    value={formData.rainfall_30}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* pH Level */}
                            <div className="space-y-2">
                                <Label htmlFor="pH">pH Level</Label>
                                <Input
                                    id="pH"
                                    name="pH"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="14"
                                    placeholder="e.g., 6.5"
                                    value={formData.pH}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Soil Type */}
                            <div className="space-y-2">
                                <Label htmlFor="soil_type">Soil Type</Label>
                                <Select value={formData.soil_type} onValueChange={handleSoilTypeChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select soil type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sandy">Sandy</SelectItem>
                                        <SelectItem value="Loamy">Loamy</SelectItem>
                                        <SelectItem value="Clay">Clayey</SelectItem>
                                        <SelectItem value="Alluvial">Alluvial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Latitude */}
                            <div className="space-y-2">
                                <Label htmlFor="lat">Latitude</Label>
                                <Input
                                    id="lat"
                                    name="lat"
                                    type="number"
                                    step="0.0001"
                                    placeholder="e.g., 15.5"
                                    value={formData.lat}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Longitude */}
                            <div className="space-y-2">
                                <Label htmlFor="lon">Longitude</Label>
                                <Input
                                    id="lon"
                                    name="lon"
                                    type="number"
                                    step="0.0001"
                                    placeholder="e.g., 75.5"
                                    value={formData.lon}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Use My Location Button */}
                            <Button
                                type="button"
                                onClick={fetchCurrentLocation}
                                variant="outline"
                                className="whitespace-nowrap md:col-span-2"
                            >
                                📍 Use My Location
                            </Button>

                            {/* Irrigation */}
                            <div className="flex items-center space-x-3 md:col-span-2">
                                <Label htmlFor="irrigation">Irrigation</Label>
                                <button
                                    type="button"
                                    onClick={() => handleInputChange({
                                        target: {
                                            name: 'irrigation',
                                            type: 'checkbox',
                                            checked: !formData.irrigation
                                        }
                                    })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.irrigation ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.irrigation ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <Label htmlFor="irrigation" className="cursor-pointer">
                                    {formData.irrigation ? 'Has' : 'No'} Irrigation
                                </Label>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <Button onClick={pred} disabled={loading} className="flex-1 mx-auto max-w-[60vw]">
                                {loading ? "Getting Recommendation..." : "Get Prediction"}
                            </Button>
                        </div>

                        {/* Results Display */}
                        {result && (
                            <Card className="mt-6 bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Recommendation Result</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="text-sm overflow-auto">
                                        <CropRecommendations data={result}/>
                                    </pre>
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

