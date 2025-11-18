import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";

function Dashboard() {
    const { getToken } = useAuth();
    
    const pred = async () => {
        const token = await getToken();
        const res = await fetch("http://localhost:8000/api/recommend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                avg_temp_30: 30,
                soil_type: 'Sandy',
                pH: 6.5,
                rainfall_30: 200,
                lat: 15.5,
                lon: 75.5,
                irrigation: true
            }),
            credentials: "include",
        });
        const result = await res.json();
        console.log("Recommendation result:", result);
    }

    return (
        <div className=' flex gap-4 mt-10 h-[80vh]'>
            <Card className='hidden md:flex flex-col w-[30vh] rounded-r-3xl rounded-l-none'>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
            </Card>
            <Card className='w-full rounded-3xl p-5 font-bold mr-4'>
                Get Recommendations
                <div className='flex gap-2'>
                    <Button onClick={pred}>Get Prediction</Button>
                </div>
            </Card>
        </div>
    )
}

export default Dashboard