import { ChevronDown } from "lucide-react";
import type { Token } from "../types";

interface TokenInputProps {
  label: string;
  token: Token;
  amount: string;
  onAmountChange: (value: string) => void;
  onTokenClick: () => void;
  readOnly?: boolean;
}

export const TokenInput = ({
  label,
  token,
  amount,
  onAmountChange,
  onTokenClick,
  readOnly = false,
}: TokenInputProps) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
        <span>{label}</span>
        <span className="text-xs text-gray-400 cursor-pointer hover:text-purple-600">
          Balance: {token.balance} {token.symbol}
        </span>
      </div>
      <div className="flex justify-between items-center gap-3">
        <input
          type="number"
          className="flex-1 border-none bg-transparent text-3xl font-semibold text-gray-900 outline-none w-full placeholder:text-gray-400"
          placeholder="0.0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          readOnly={readOnly}
        />
        <TokenSelectButton token={token} onClick={onTokenClick} />
      </div>
    </div>
  );
};

interface TokenSelectButtonProps {
  token: Token;
  onClick: () => void;
}

const TokenSelectButton = ({ token, onClick }: TokenSelectButtonProps) => {
  return (
    <button
      className="bg-white border border-gray-200 rounded-xl px-3 py-2 cursor-pointer transition-all min-w-[120px] hover:border-purple-600 hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-semibold text-xs">
          {token.symbol[0]}
        </div>
        <span className="font-medium">{token.symbol}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
    </button>
  );
};

