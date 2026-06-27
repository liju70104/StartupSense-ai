import { useQuery } from "@tanstack/react-query";

const API_URL = "https://startupsense-ai-backend.onrender.com";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/dashboard`);
      if (!res.ok) throw new Error("Dashboard API failed");
      return res.json();
    },
  });
}