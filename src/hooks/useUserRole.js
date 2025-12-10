import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useUserRole(email) {
  return useQuery({
    queryKey: ["userRole", email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${email}`
      );
      return res.data;
    },
    enabled: !!email,
  });
}
