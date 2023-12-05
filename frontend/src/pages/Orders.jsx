import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const URL = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${URL}/api/get-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Fetching orders unsuccessful", error);
      }
    };

    fetchOrders();
  }, [URL]);

  return (
    <div>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  <b>{order.name}</b>
                </td>
                <td>
                  <b>{order.contact}</b>
                </td>
                <td>
                  <b>{order.address}</b>
                </td>
                <td>
                  <ul className="order-list">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        <b>{item.productName}</b> * {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  ₱
                  {order.items
                    .reduce(
                      (total, item) => total + item.quantity * item.price,
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
