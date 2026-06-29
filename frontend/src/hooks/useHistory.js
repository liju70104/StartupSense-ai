import { useQuery } from "@tanstack/react-query";

const API_URL = "https://startupsense-ai-backend.onrender.com";

export function useHistory(email) {
  return useQuery({
    queryKey: ["history", email],
    enabled: Boolean(email),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/history?email=${email}`);
      if (!res.ok) throw new Error("History API failed");
      return res.json();
    },
  });
}