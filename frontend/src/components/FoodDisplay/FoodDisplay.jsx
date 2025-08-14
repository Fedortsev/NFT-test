import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import AdminProductModal from "../AdminProductModal/AdminProductModal";

const FoodDisplay = ({ category }) => {
  const { food_list, userRole } = useContext(StoreContext);
  const [showAddModal, setShowAddModal] = useState(false);
  console.log(userRole);

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2>Top dishes near you</h2>
        {userRole === "admin" && (
          <button
            className="add-product-btn"
            onClick={() => setShowAddModal(true)}
          >
            <span>+</span> Add New Product
          </button>
        )}
      </div>

      <div className="food-display-list">
        {food_list.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>

      {showAddModal && <AdminProductModal setShowModal={setShowAddModal} />}
    </div>
  );
};

export default FoodDisplay;
