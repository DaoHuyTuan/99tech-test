import { useState, useEffect, useRef, useCallback } from "react";
import { Settings } from "lucide-react";
import type { Token, PricingData } from "../types";
import { usePricingSocket, useTokenList } from "../hooks";
import {
  TokenInput,
  SwapArrowButton,
  SwapButton,
  SettingsPanel,
  TokenListModal,
  SwapDetails,
} from "../components";

export const Swapper = () => {
  const { data: tokenList = [], isLoading, error } = useTokenList();
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [showFromTokenList, setShowFromTokenList] = useState(false);
  const [showToTokenList, setShowToTokenList] = useState(false);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const lastInputChanged = useRef<"from" | "to" | null>(null);

  useEffect(() => {
    if (tokenList && tokenList.length > 0 && !fromToken && !toToken) {
      setFromToken(tokenList[0]);
      if (tokenList.length > 1) {
        setToToken(tokenList[1]);
      } else {
        setToToken(tokenList[0]);
      }
    }
  }, [tokenList, fromToken, toToken]);

  usePricingSocket({
    url: import.meta.env.VITE_SOCKET_URL || "http://localhost:4000",
    pairs: {
      fromId: fromToken?.id || "",
      toId: toToken?.id || "",
    },
    onPricingUpdate: (data: PricingData) => {
      console.log("Pricing updated:", data);
      setPricingData(data);
      if (lastInputChanged.current === "from" && fromAmount) {
        calculateToAmount(fromAmount, data);
      } else if (lastInputChanged.current === "to" && toAmount) {
        calculateFromAmount(toAmount, data);
      } else if (fromAmount && !toAmount) {
        lastInputChanged.current = "from";
        calculateToAmount(fromAmount, data);
      } else if (toAmount && !fromAmount) {
        lastInputChanged.current = "to";
        calculateFromAmount(toAmount, data);
      } else if (fromAmount && toAmount) {
        if (lastInputChanged.current === "to") {
          calculateFromAmount(toAmount, data);
        } else {
          calculateToAmount(fromAmount, data);
        }
      }
    },
    onError: (error) => {
      console.error("Pricing error:", error);
    },
  });

  const calculateToAmount = useCallback(
    (fromValue: string, pricing?: PricingData) => {
      const data = pricing || pricingData;
      if (!data || !data.pair1?.price || !data.pair2?.price) {
        return;
      }

      const fromValueNum = parseFloat(fromValue);
      if (isNaN(fromValueNum) || fromValueNum <= 0) {
        setToAmount("");
        return;
      }
      const usdValue = fromValueNum * parseFloat(data.pair1.price);
      const calculated = (usdValue / parseFloat(data.pair2.price)).toFixed(6);
      setToAmount(calculated);
    },
    [pricingData]
  );

  const calculateFromAmount = useCallback(
    (toValue: string, pricing?: PricingData) => {
      const data = pricing || pricingData;
      if (!data || !data.pair1?.price || !data.pair2?.price) {
        return;
      }

      const toValueNum = parseFloat(toValue);
      if (isNaN(toValueNum) || toValueNum <= 0) {
        setFromAmount("");
        return;
      }
      const usdValue = toValueNum * parseFloat(data.pair2.price);
      const calculated = (usdValue / parseFloat(data.pair1.price)).toFixed(6);
      setFromAmount(calculated);
    },
    [pricingData]
  );

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
    lastInputChanged.current = "from";

    if (value && !isNaN(parseFloat(value))) {
      calculateToAmount(value);
    } else {
      setToAmount("");
    }
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    lastInputChanged.current = "to";

    if (value && !isNaN(parseFloat(value))) {
      debugger;
      calculateFromAmount(value);
    } else {
      setFromAmount("");
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

  const handleSwap = () => {
    if (!fromToken || !toToken || !fromAmount || !toAmount) {
      return;
    }

    alert(
      `You just swaped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`
    );
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen p-5"
      style={{
        background: "linear-gradient(to bottom right, #9333ea, #a89f21)",
      }}
    >
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

        {isLoading && (
          <div className="flex items-center justify-center py-8 text-gray-500">
            Loading tokens...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-8 text-red-500 text-sm">
            Failed to load tokens
          </div>
        )}
        {!isLoading && fromToken && toToken && (
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
              onAmountChange={handleToAmountChange}
              onTokenClick={() => {
                setShowToTokenList(!showToTokenList);
                setShowFromTokenList(false);
              }}
            />
          </div>
        )}

        {fromToken && toToken && fromAmount && toAmount && (
          <SwapDetails
            fromTokenSymbol={fromToken.symbol}
            toTokenSymbol={toToken.symbol}
            fromAmount={fromAmount}
            toAmount={toAmount}
            slippage={slippage}
          />
        )}

        {fromToken && toToken && (
          <SwapButton
            disabled={!fromAmount || !toAmount}
            text={!fromAmount ? "Enter an amount" : "Swap"}
            onClick={handleSwap}
          />
        )}
      </div>

      {showFromTokenList && fromToken && toToken && (
        <TokenListModal
          tokens={tokenList}
          fromToken={fromToken}
          toToken={toToken}
          isFrom={true}
          onSelectToken={(token) => handleSelectToken(token, true)}
          onClose={() => setShowFromTokenList(false)}
        />
      )}

      {showToTokenList && fromToken && toToken && (
        <TokenListModal
          tokens={tokenList}
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
