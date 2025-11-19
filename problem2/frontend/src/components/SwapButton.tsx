interface SwapButtonProps {
  disabled: boolean;
  text?: string;
}

export const SwapButton = ({ disabled, text = "Swap" }: SwapButtonProps) => {
  return (
    <button
      className={`w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white border-none rounded-2xl text-base font-semibold cursor-pointer transition-all mt-2 ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/40"
      }`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

