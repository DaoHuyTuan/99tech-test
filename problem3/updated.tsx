import React, { useMemo } from "react";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: string;
}

interface BoxProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface Props extends BoxProps {}

type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

// Move getPriority outside component to avoid recreation on every render
const getPriority = (blockchain: Blockchain | string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Fixed: Removed prices from dependency array since it's not used in the computation
  // Fixed: Corrected filter logic - keep balances with priority > -99 AND amount > 0
  // Fixed: Used balancePriority instead of undefined lhsPriority
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Keep balances with valid priority (not default) and positive amount
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // Fixed: Return 0 when priorities are equal
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0;
      });
  }, [balances]);

  // Fixed: Memoize formattedBalances to avoid recomputation on every render
  const formattedBalances = useMemo(() => {
    return sortedBalances.map(
      (balance: WalletBalance): FormattedWalletBalance => {
        return {
          ...balance,
          formatted: balance.amount.toFixed(2),
        };
      }
    );
  }, [sortedBalances]);

  // Fixed: Memoize rows to avoid recreating on every render
  // Fixed: Use currency as key instead of index (better for React reconciliation)
  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency} // Fixed: Use currency as key instead of index
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
