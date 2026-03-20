import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });
};
