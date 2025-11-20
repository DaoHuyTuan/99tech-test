export interface Token {
  id?: string;
  basePrice?: number;
  currency?: string;
  displayName?: string;
  price?: string;
  symbol: string;
  name?: string;
  tokenId?: string;
  updatedAt?: string;
  logo?: string;
  balance?: string;
}

export interface PricingData {
  pair1: Token;
  pair2: Token;
}
