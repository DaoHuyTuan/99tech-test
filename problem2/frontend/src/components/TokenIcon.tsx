import { useState } from "react";
import type { Token } from "../types";

interface TokenIconProps {
  token: Token;
  size?: number;
  className?: string;
}

export const TokenIcon = ({
  token,
  size = 24,
  className = "",
}: TokenIconProps) => {
  const [imageError, setImageError] = useState(false);
  const iconName = token.symbol.toUpperCase();
  const iconPath = `/icons/${iconName}.svg`;
  if (imageError) {
    return (
      <div
        className={`w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-semibold ${className}`}
        style={{ width: size, height: size, fontSize: `${size * 0.4}px` }}
      >
        {token.symbol[0]}
      </div>
    );
  }

  return (
    <img
      src={iconPath}
      alt={token.symbol}
      className={`w-full h-full rounded-full ${className}`}
      style={{ width: size, height: size }}
      onError={() => setImageError(true)}
    />
  );
};
