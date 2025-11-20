interface SwapButtonProps {
  disabled: boolean;
  text?: string;
  onClick?: () => void;
}

export const SwapButton = ({
  disabled,
  text = "Swap",
  onClick,
}: SwapButtonProps) => {
  return (
    <button
      className={`w-full py-4 text-white border-none rounded-2xl text-base font-semibold cursor-pointer transition-all mt-2 ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "hover:-translate-y-0.5 hover:shadow-lg"
      }`}
      style={
        !disabled
          ? {
              backgroundColor: "#a89f21",
            }
          : undefined
      }
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
