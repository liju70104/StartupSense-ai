import { useQuery } from "@tanstack/react-query";

const API_URL = "https://startupsense-ai-backend.onrender.com";

export function useDashboard(email) {
  return useQuery({
    queryKey: ["dashboard", email],
    enabled: Boolean(email),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/dashboard?email=${email}`);
      if (!res.ok) throw new Error("Dashboard API failed");
      return res.json();
    },
  });
}