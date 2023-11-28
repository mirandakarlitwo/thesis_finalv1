import { FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Products from "./Products";
import Cart from "./Cart";

function UserDashboard() {
  const [stocks, setStocks] = useState([]);

  const URL = import.meta.env.VITE_REACT_API_URL;

  const fetchStocks = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${URL}/api/stocks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = await response.json();

      setStocks(data);
    } catch (error) {
      console.log("Fetching data unsuccessful", error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${URL}/api/add-to-cart/${productId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      if (data.message === "Item added to cart successfully") {
        console.log("Item added to cart successfully");

        fetchStocks();
      } else {
        console.error("Failed to add item to cart:", data.message);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <>
      <div className="cartContainer">
        <h1>
          <Link to="/cart">
            View Cart <FaShoppingCart />
          </Link>
        </h1>
      </div>
      <div className="stocksContainer">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stocks Left</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <Products key={stock._id} stock={stock} addToCart={addToCart} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserDashboard;
