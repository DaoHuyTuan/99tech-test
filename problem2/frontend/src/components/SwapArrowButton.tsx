import { ArrowUpDown } from "lucide-react";

interface SwapArrowButtonProps {
  onClick: () => void;
}

export const SwapArrowButton = ({ onClick }: SwapArrowButtonProps) => {
  return (
    <button
      className="bg-white border-2 border-gray-200 rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer -my-1.5 mx-auto z-10 transition-all hover:border-purple-600 hover:rotate-180"
      onClick={onClick}
    >
      <ArrowUpDown className="w-5 h-5 text-gray-600" />
    </button>
  );
};
