import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../components/context/StoreContext";
import "./MyOrders.css";
import axios from "axios";

const MyOrders = () => {
  const { url, token, userRole } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const endpoint =
          userRole === "admin" ? "/api/order/list" : "/api/order/userorders";
        const response = await axios.get(`${url}${endpoint}`, {
          headers: { token },
        });

        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [url, token, userRole]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="my-orders-container">
      <h1>{userRole === "admin" ? "All Orders" : "My Orders"}</h1>

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <span className="order-date">{formatDate(order.date)}</span>
                <span
                  className={`order-status ${order.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="order-amount">${order.amount}</div>
            </div>

            <div className="order-items-preview">
              <div className="main-item">
                <img
                  src={url + "/images/" + order.items[0].image}
                  alt={order.items[0].name}
                />
                <div className="item-details">
                  <h3>{order.items[0].name}</h3>
                  <p>Quantity: {order.items[0].quantity}</p>
                </div>
              </div>

              {order.items.length > 1 && (
                <div className="additional-items">
                  +{order.items.length - 1} more items
                </div>
              )}
            </div>

            {userRole === "admin" && (
              <div className="customer-details">
                <h4>Customer Info</h4>
                <p>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p>{order.address.email}</p>
              </div>
            )}

            <button
              className="track-order-btn"
              onClick={() => navigate(`/order/${order._id}`)}
            >
              Track Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
