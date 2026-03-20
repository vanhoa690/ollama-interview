import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("token");

    queryClient.removeQueries({ queryKey: ["me"] });

    navigate("/login");
  };
};
