import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";

export default function Dashboard() {
    const { getToken } = useAuth();

    const callApi = async () => {
    const token = await getToken(); 
    console.log("Token:", token);
    const res = await fetch("http://localhost:8000/clerk-data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    console.log(await res.json());
  };

  return (
    <div>
        <Button onClick={callApi}>Call API</Button>
    </div>
  )
}
