import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";

const FoodItem = ({ id, name, price, description, image }) => {
  const {
    cartItems = {},
    addToCart,
    removeFromCart,
    url,
    userRole,
    token,
  } = useContext(StoreContext);

  const handleDeleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.post(
          `${url}/api/food/remove`,
          { id: id },
          { headers: { token } }
        );

        if (response.data.success) {
          alert("Product deleted successfully!");
          window.location.reload();
        }
      } catch (error) {
        alert("Error deleting product");
        console.error(error);
      }
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        {userRole === "admin" && (
          <button className="delete-product-btn" onClick={handleDeleteProduct}>
            <img src={assets.cross_icon} alt="delete" />
          </button>
        )}
        <img
          className="food-item-image"
          src={url + "/images/" + image}
          alt=""
        />
        {cartItems && !cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems?.[id] || 0}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
