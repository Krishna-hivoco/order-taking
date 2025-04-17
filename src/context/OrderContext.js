import { createContext, useState, useContext } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orderDetailsAPI, setOrderDetailsAPI] = useState(null);

  // Persist state across page navigations
  // useEffect(() => {
  //   const storedState = localStorage.getItem("shouldPlayAudio");
  //   if (storedState) {
  //     setShouldPlayAudio(JSON.parse(storedState));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("shouldPlayAudio", JSON.stringify(shouldPlayAudio));
  // }, [shouldPlayAudio]);

  return (
    <OrderContext.Provider value={{ orderDetailsAPI, setOrderDetailsAPI }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
