import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
} from "react";
import { toast } from "react-hot-toast";
import { IProduct } from "../model";

const Context: React.Context<any> = createContext({});

export const StateContext: FC = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<Array<IProduct>>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setqty] = useState(1);

  let foundProduct: any;
  let index;

  const addQty = () => {
    setqty((prevQty) => prevQty + 1);
  };

  const reduceQty = () => {
    setqty((prevQty) => {
      if (prevQty <= 1) return 1;
      return prevQty - 1;
    });
  };

  const resetQty = () => {
    setqty(1);
  };

  const addCart = (product: IProduct, quantity: number) => {
    const checkProductCart = cartItems.find((item) => item._id === product._id);
    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + (product?.price ?? 0) * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return {
            ...cartProduct,
            quantity: (cartProduct?.quantity ?? 0) + quantity,
          };
        } else {
          return { ...cartProduct };
        }
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to the cart`);
  };

  const addCartItemQuantity = (id: string, value: string) => {
    foundProduct = cartItems?.find((item) => item._id === id);
    index = cartItems?.findIndex((item) => item._id === id);

    if (value === "inc") {
      const newCartItems = cartItems.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            quantity: foundProduct.quantity + 1,
          };
        } else {
          return item;
        }
      });

      setCartItems([...newCartItems]);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      const newCartItems = cartItems.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            quantity: foundProduct.quantity - 1,
          };
        } else {
          return item;
        }
      });
      if (foundProduct.quantity > 1) {
        setCartItems([...newCartItems]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const reduceCartItemQuantity = (id: string) => {
    foundProduct = cartItems?.find((item) => item._id === id);
    index = cartItems?.findIndex((item) => item._id === id);
    const newCartItems = cartItems.filter((item) => item._id !== id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setCartItems(newCartItems);
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        resetQty,
        totalPrice,
        totalQuantities,
        qty,
        addQty,
        reduceQty,
        addCart,
        addCartItemQuantity,
        reduceCartItemQuantity,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
