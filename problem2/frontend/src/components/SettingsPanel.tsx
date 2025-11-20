interface SettingsPanelProps {
  slippage: number;
  onSlippageChange: (value: number) => void;
}

export const SettingsPanel = ({
  slippage,
  onSlippageChange,
}: SettingsPanelProps) => {
  const slippageOptions = [0.1, 0.5, 1.0];

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-5">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-600">
          Slippage Tolerance
        </label>
        <div className="flex gap-2 items-center">
          {slippageOptions.map((option) => (
            <button
              key={option}
              className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                slippage === option ? "text-white" : "bg-white border-gray-200"
              }`}
              style={
                slippage === option
                  ? {
                      backgroundColor: "#a89f21",
                      borderColor: "#a89f21",
                    }
                  : undefined
              }
              onMouseEnter={(e) => {
                if (slippage !== option) {
                  e.currentTarget.style.borderColor = "#a89f21";
                }
              }}
              onMouseLeave={(e) => {
                if (slippage !== option) {
                  e.currentTarget.style.borderColor = "";
                }
              }}
              onClick={() => onSlippageChange(option)}
            >
              {option}%
            </button>
          ))}
          <input
            type="number"
            value={slippage}
            onChange={(e) => onSlippageChange(parseFloat(e.target.value) || 0)}
            placeholder="Custom"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm max-w-[80px] focus:outline-none"
            onFocus={(e) => {
              e.target.style.borderColor = "#a89f21";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "";
            }}
          />
        </div>
      </div>
    </div>
  );
};
