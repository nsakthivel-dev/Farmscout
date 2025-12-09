import { useEffect } from "react";
import { useLocation } from "wouter";

// Custom hook to detect route changes
export const useRouteChange = (callback: (pathname: string) => void) => {
  const [location] = useLocation();

  useEffect(() => {
    callback(location);
  }, [location, callback]);
};