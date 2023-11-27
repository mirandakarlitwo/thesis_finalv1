import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StockItem from "../components/StockItem";
import StocksForm from "../components/StocksForm";

function Dashboard() {
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

      console.log(data);
    } catch (error) {
      console.log("Fetching data unsuccessful", error);
    }
  };

  // create stock
  //handle submit
  const handleStockSubmit = async (
    productId,
    name,
    category,
    price,
    quantity
  ) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${URL}/api/stocks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          name,
          category,
          price,
          quantity,
        }),
      });

      if (response.ok) {
        const { data } = await response.json();

        console.log("Stock created successfully", data);

        setStocks((prevStock) => [...prevStock, data]);
      } else {
        console.error("Failed to create the stock", response.status);
      }
    } catch (error) {
      console.error("Failed to create a stock", error);
    }
  };

  // handle update
  const handleStockUpdate = async (stocksId, updatedStocks) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${URL}/api/stocks/${stocksId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedStocks),
      });

      if (response.ok) {
        const { data } = await response.json();
        console.log("Stock updated successfully", data);
        setStocks((prevStocks) =>
          prevStocks.map((stock) => (stock._id === stocksId ? data : stock))
        );
      } else {
        console.error("Failed to update the stock", response.status);
      }
    } catch (error) {
      console.error("Failed to update a stock", error);
    }
  };

  // handle delete
  const handleStockDelete = async (stocksId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${URL}/api/stocks/${stocksId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Stock deleted successfully");
        console.log(`Deleted stock ID: ${stocksId}`);
        setStocks(stocks.filter((stock) => stock._id !== stocksId));
      } else {
        console.error("Failed to delete stock");
      }
    } catch (error) {
      console.error("Failed to delete stock", error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <StocksForm onStocksSubmit={handleStockSubmit} />

      <h1>Stocks Info</h1>
      <div className="stocksContainer">
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Categ.</th>
              <th>Price</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <StockItem
                key={stock._id}
                stock={stock}
                onUpdate={(updatedStock) =>
                  handleStockUpdate(stock._id, updatedStock)
                }
                onDelete={() => handleStockDelete(stock._id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
