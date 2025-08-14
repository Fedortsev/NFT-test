import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [food_list, setFoodList] = useState([]);
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId, amount = 1) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - amount),
    }));

    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId, amount },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  const checkUserRole = async (token) => {
    try {
      const response = await axios.get(`${url}/api/user/role`, {
        headers: { token },
      });
      if (response.data.success) {
        setUserRole(response.data.role);
      }
    } catch (error) {
      setUserRole("user");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setToken(null);
    setUserRole(null);
    setCartItems({});
    window.location.replace("/");
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setUserRole(null);
        setToken(null);
        setCartItems({});
      } else {
        setToken(storedToken);
        await loadCartData(storedToken);
        await checkUserRole(storedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    userRole,
    setUserRole,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
