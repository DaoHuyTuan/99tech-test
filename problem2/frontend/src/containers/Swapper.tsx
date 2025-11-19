import { useState } from "react";
import { Settings } from "lucide-react";
import type { Token } from "../types";
import {
  TokenInput,
  SwapArrowButton,
  SwapButton,
  SettingsPanel,
  TokenListModal,
  SwapDetails,
} from "../components";

const defaultTokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", balance: "0.0" },
  { symbol: "USDC", name: "USD Coin", balance: "0.0" },
  { symbol: "USDT", name: "Tether", balance: "0.0" },
  { symbol: "DAI", name: "Dai Stablecoin", balance: "0.0" },
];

export const Swapper = () => {
  const [fromToken, setFromToken] = useState<Token>(defaultTokens[0]);
  const [toToken, setToToken] = useState<Token>(defaultTokens[1]);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [showFromTokenList, setShowFromTokenList] = useState(false);
  const [showToTokenList, setShowToTokenList] = useState(false);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [showSettings, setShowSettings] = useState(false);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Simulate price calculation
    if (value && !isNaN(parseFloat(value))) {
      const calculated = (parseFloat(value) * 1.5).toFixed(6);
      setToAmount(calculated);
    } else {
      setToAmount("");
    }
  };

  const handleSelectToken = (token: Token, isFrom: boolean) => {
    if (isFrom) {
      setFromToken(token);
      setShowFromTokenList(false);
    } else {
      setToToken(token);
      setShowToTokenList(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-gradient-to-br from-purple-600 to-purple-800">
      <div className="bg-white rounded-3xl p-6 w-full max-w-[420px] shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-900 m-0">Swap</h2>
          <button
            className="bg-transparent border-none cursor-pointer p-2 rounded-lg transition-colors hover:bg-gray-100"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {showSettings && (
          <SettingsPanel slippage={slippage} onSlippageChange={setSlippage} />
        )}

        <div className="flex flex-col gap-3">
          <TokenInput
            label="From"
            token={fromToken}
            amount={fromAmount}
            onAmountChange={handleFromAmountChange}
            onTokenClick={() => {
              setShowFromTokenList(!showFromTokenList);
              setShowToTokenList(false);
            }}
          />

          <SwapArrowButton onClick={handleSwapTokens} />

          <TokenInput
            label="To"
            token={toToken}
            amount={toAmount}
            onAmountChange={setToAmount}
            onTokenClick={() => {
              setShowToTokenList(!showToTokenList);
              setShowFromTokenList(false);
            }}
            readOnly
          />
        </div>

        {fromAmount && toAmount && (
          <SwapDetails
            fromTokenSymbol={fromToken.symbol}
            toTokenSymbol={toToken.symbol}
            fromAmount={fromAmount}
            toAmount={toAmount}
            slippage={slippage}
          />
        )}

        <SwapButton
          disabled={!fromAmount || !toAmount}
          text={!fromAmount ? "Enter an amount" : "Swap"}
        />
      </div>

      {showFromTokenList && (
        <TokenListModal
          tokens={defaultTokens}
          fromToken={fromToken}
          toToken={toToken}
          isFrom={true}
          onSelectToken={(token) => handleSelectToken(token, true)}
          onClose={() => setShowFromTokenList(false)}
        />
      )}

      {showToTokenList && (
        <TokenListModal
          tokens={defaultTokens}
          fromToken={fromToken}
          toToken={toToken}
          isFrom={false}
          onSelectToken={(token) => handleSelectToken(token, false)}
          onClose={() => setShowToTokenList(false)}
        />
      )}
    </div>
  );
};
