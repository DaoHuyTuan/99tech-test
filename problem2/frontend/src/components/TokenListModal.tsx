import { X } from "lucide-react";
import type { Token } from "../types";

interface TokenListModalProps {
  tokens: Token[];
  fromToken: Token;
  toToken: Token;
  isFrom: boolean;
  onSelectToken: (token: Token) => void;
  onClose: () => void;
}

export const TokenListModal = ({
  tokens,
  fromToken,
  toToken,
  isFrom,
  onSelectToken,
  onClose,
}: TokenListModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-[420px] max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 m-0">
            Select a token
          </h3>
          <button
            className="bg-transparent border-none text-gray-400 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search name or paste address"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-purple-600"
          />
        </div>
        <div className="p-2 overflow-y-auto flex-1">
          {tokens.map((token) => {
            const isDisabled =
              (isFrom && token.symbol === fromToken.symbol) ||
              (!isFrom && token.symbol === toToken.symbol);

            return (
              <button
                key={token.symbol}
                className={`w-full p-3 border-none bg-transparent rounded-xl cursor-pointer transition-colors text-left flex justify-between items-center ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onSelectToken(token)}
                disabled={isDisabled}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-semibold text-xs">
                    {token.symbol[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-base">
                      {token.symbol}
                    </div>
                    <div className="text-sm text-gray-400">{token.name}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{token.balance}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

