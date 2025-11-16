import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
function Dashboard() {
    const { getToken } = useAuth();

    const callApi = async () => {
        const token = await getToken();
        console.log("Token:", token);
        const res = await fetch("http://localhost:8000/protected", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        });
        console.log(await res.json());
    };

    return (
        <div className=' flex gap-2 mt-10 h-[80vh]'>
            <Card className='hidden md:flex flex-col w-[30vh] rounded-r-3xl rounded-l-none'>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
            </Card>
            <Card className='w-full rounded-3xl p-5 font-bold'>
                Get Recommendations
                <div>
                    <Button onClick={callApi}>check if Token valid</Button>
                </div>
            </Card>
        </div>
    )
}

export default Dashboard