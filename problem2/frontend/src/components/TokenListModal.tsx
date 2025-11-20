import { useState, useMemo } from "react";
import { X } from "lucide-react";
import type { Token } from "../types";
import { useTokenList } from "../hooks";
import { TokenIcon } from "./TokenIcon";

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
  const { data, isLoading, error } = useTokenList();
  const [searchText, setSearchText] = useState("");

  // Use API data if available, otherwise fallback to props tokens
  const tokenList = data || tokens;

  // Filter tokens based on search text (case-insensitive search by symbol)
  const filteredTokens = useMemo(() => {
    if (!searchText.trim()) {
      return tokenList || [];
    }
    const searchLower = searchText.toLowerCase().trim();
    return (tokenList || []).filter((token) =>
      token.symbol.toLowerCase().includes(searchLower)
    );
  }, [tokenList, searchText]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-[420px] h-[600px] flex flex-col shadow-2xl"
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
            placeholder="Search by symbol"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-purple-600"
          />
        </div>
        <div className="p-2 overflow-y-auto flex-1">
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-gray-500">
              Loading tokens...
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center py-8 text-red-500 text-sm">
              Failed to load tokens. Using default list.
            </div>
          )}
          {!isLoading &&
            filteredTokens &&
            filteredTokens.length > 0 &&
            filteredTokens.map((token) => {
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
                    <TokenIcon token={token} size={24} />
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
          {!isLoading && filteredTokens && filteredTokens.length === 0 && (
            <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
              {searchText.trim()
                ? "No tokens found matching your search"
                : "No tokens available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
