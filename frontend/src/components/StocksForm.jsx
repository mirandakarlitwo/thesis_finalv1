import { useState } from "react";

function StocksForm({ onStocksSubmit }) {
  const [stockForm, setStockForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const handleChange = (event) => {
    setStockForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { name, category, price, quantity } = stockForm;
    onStocksSubmit(name, category, price, quantity);

    setStockForm({
      name: "",
      category: "",
      price: "",
      quantity: "",
    });

    alert("Stock created successfully");
  };

  const { name, category, price, quantity } = stockForm;

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Name:</label>
        <input
          className="form-control"
          type="text"
          id="name"
          name="name"
          value={name}
          placeholder="Enter stock name"
          autoComplete="off"
          onChange={handleChange}
        />
        <label>Category:</label>
        <input
          className="form-control"
          type="text"
          id="category"
          name="category"
          value={category}
          placeholder="Enter category"
          autoComplete="off"
          onChange={handleChange}
        />
        <label>Price:</label>
        <input
          className="form-control"
          type="text"
          id="price"
          name="price"
          value={price}
          placeholder="Enter price"
          autoComplete="off"
          onChange={handleChange}
        />
        <label>Quantity:</label>
        <input
          className="form-control"
          type="text"
          id="quantity"
          name="quantity"
          value={quantity}
          placeholder="Enter quantity"
          autoComplete="off"
          onChange={handleChange}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-block">
            Create new Stock
          </button>
        </div>
      </div>
    </form>
  );
}

export default StocksForm;
