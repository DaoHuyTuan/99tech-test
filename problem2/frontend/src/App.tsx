import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { usePricingSocket } from "./hooks/use-pricings";
import { Swapper } from "./containers";

interface PricingData {
  tokenId: string;
  price: number;
  timestamp: number;
}

function App() {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const tokenId = "3f2b0110-9db7-488f-b198-db4bfdcaa760";
  const { isConnected, error } = usePricingSocket({
    url: "http://localhost:4000",
    tokenId,
    onPricingUpdate: (data) => {
      console.log("Pricing updated:", data);
      setPricingData(data);
    },
    onError: (error) => {
      console.error("Pricing error:", error);
      // Có thể show toast notification ở đây
    },
  });

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!isConnected) {
    return <div>Connecting to price feed...</div>;
  }

  return (
    <>
      <Swapper />
    </>
  );
}

export default App;
