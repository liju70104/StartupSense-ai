import { useQuery } from "@tanstack/react-query";

const API_URL = "https://startupsense-ai-backend.onrender.com";

export function useHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/history`);
      if (!res.ok) throw new Error("History API failed");
      return res.json();
    },
  });
}