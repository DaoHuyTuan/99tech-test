interface SwapDetailsProps {
  fromTokenSymbol: string;
  toTokenSymbol: string;
  fromAmount: string;
  toAmount: string;
  slippage: number;
}

export const SwapDetails = ({
  fromTokenSymbol,
  toTokenSymbol,
  fromAmount,
  toAmount,
  slippage,
}: SwapDetailsProps) => {
  const price =
    parseFloat(fromAmount) > 0
      ? (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)
      : "0";
  const minimumReceived = (
    parseFloat(toAmount) *
    (1 - slippage / 100)
  ).toFixed(6);

  return (
    <div className="bg-gray-50 rounded-xl p-3 mt-3 mb-4">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2 last:mb-0">
        <span>Price</span>
        <span>
          1 {fromTokenSymbol} = {price} {toTokenSymbol}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2 last:mb-0">
        <span>Minimum received</span>
        <span>
          {minimumReceived} {toTokenSymbol}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2 last:mb-0">
        <span>Slippage tolerance</span>
        <span>{slippage}%</span>
      </div>
    </div>
  );
};

