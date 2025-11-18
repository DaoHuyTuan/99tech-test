import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { usePricingSocket } from "./hooks/use-pricings";

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
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
