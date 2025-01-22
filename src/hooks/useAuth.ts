import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [isDesigner, setIsDesigner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage for existing auth
    const storedUserId = sessionStorage.getItem("userID");
    const storedDesignerId = sessionStorage.getItem("idDesigner");

    if (storedUserId) {
      setUserId(storedUserId);
      setIsDesigner(!!storedDesignerId);
    }

    setIsLoading(false);
  }, []);

  const isAuthenticated = !!session || !!userId;

  return {
    isAuthenticated,
    isDesigner,
    userId,
    isLoading: isLoading || status === "loading",
    user: session?.user,
  };
};
