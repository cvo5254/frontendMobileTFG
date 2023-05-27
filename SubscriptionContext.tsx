import React, { createContext, useContext, useState } from 'react';

type SubscriptionContextValue = {
  updateSubscriptions: () => void;
};

type SubscriptionProviderProps = {
  children: React.ReactNode;
};

const SubscriptionContext = createContext<SubscriptionContextValue>({
  updateSubscriptions: () => {},
});

export const useSubscriptionContext = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children
}: SubscriptionProviderProps) => {
  const [updateCounter, setUpdateCounter] = useState(0);

  const updateSubscriptions = () => {
    setUpdateCounter(prevCounter => prevCounter + 1);
  };

  const value: SubscriptionContextValue = {
    updateSubscriptions,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
