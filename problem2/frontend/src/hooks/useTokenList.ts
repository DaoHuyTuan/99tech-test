import { useQuery } from "@tanstack/react-query";
import type { Token } from "../types";

interface UseTokenListOptions {
  apiUrl?: string;
  enabled?: boolean;
}

const fetchTokenList = async (apiUrl: string): Promise<Token[]> => {
  const response = await fetch(`${apiUrl}/tokens`);
  if (!response.ok) {
    throw new Error(`Failed to fetch token list: ${response.statusText}`);
  }

  const data: Token[] = await response.json();
  return data;
};

export const useTokenList = (options: UseTokenListOptions = {}) => {
  const { apiUrl = "http://localhost:4000", enabled = true } = options;
  return useQuery({
    queryKey: ["tokenList", apiUrl],
    queryFn: () => fetchTokenList(apiUrl),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
