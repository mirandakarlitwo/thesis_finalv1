import React from "react";
import { useState } from "react";

function StockItem({ stock, onUpdate, onDelete }) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [stocksForm, setStocksForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  //update stocks and updateModal
  const handleChange = (event) => {
    setStocksForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdate = () => {
    setUpdateModal(true);
  };

  const handleUpdateModal = () => {
    const updatedStocks = {
      ...stock,
      name: stocksForm.name,
      category: stocksForm.description,
      price: stocksForm.price,
      quantity: stocksForm.quantity,
    };
    onUpdate(updatedStocks);
    setUpdateModal(false);

    setStocksForm({
      name: "",
      category: "",
      price: "",
      quantity: "",
    });
  };

  const handleUpdateCancel = () => {
    setUpdateModal(false);
  };

  //delete stock and modal functions
  const handleDelete = () => {
    setDeleteModal(true);
  };

  const handleModalDelete = () => {
    setDeleteModal(false);
    onDelete(stock._id);
  };

  const handleModalCancel = () => {
    setDeleteModal(false);
  };

  return (
    <>
      <tr>
        <td>{stock.name}</td>
        <td>{stock.category}</td>
        <td>{stock.price}</td>
        <td>{stock.quantity}</td>
        <td>
          <button onClick={handleUpdate} className="btn btn-block">
            Update
          </button>
        </td>
        <td>
          <button onClick={handleDelete} className="btn btn-block">
            Delete
          </button>
        </td>

        {/* delete modal */}

        {deleteModal && (
          <td className="modal">
            <div className="modal-content">
              <h4>Confirm Deletion: </h4>
              <p>Are you sure you want to delete this stock?</p>
              <div className="modal-buttons">
                <button onClick={handleModalDelete} className="btn btn-red">
                  Yes
                </button>
                <button onClick={handleModalCancel} className="btn btn-gray">
                  No
                </button>
              </div>
            </div>
          </td>
        )}

        {/* update modal */}

        {updateModal && (
          <td className="modal update-modal">
            <div className="modal-content">
              <div className="form-group">
                <h2>Update Stocks</h2>
                <label>
                  <b>New Name:</b>
                </label>
                <form>
                  <input
                    className="form-control"
                    type="text"
                    id="name"
                    name="name"
                    value={stocksForm.name}
                    placeholder="New name..."
                    autoComplete="off"
                    onChange={handleChange}
                  />
                  <label>
                    <b>New Category:</b>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="category"
                    name="category"
                    value={stocksForm.category}
                    placeholder="New category..."
                    autoComplete="off"
                    onChange={handleChange}
                  />
                  <label>
                    <b>New Price:</b>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="price"
                    name="price"
                    value={stocksForm.price}
                    placeholder="New Price..."
                    autoComplete="off"
                    onChange={handleChange}
                  />
                  <label>
                    <b>New Quantity:</b>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="quantity"
                    name="quantity"
                    value={stocksForm.quantity}
                    placeholder="New quantity..."
                    autoComplete="off"
                    onChange={handleChange}
                  />
                </form>
              </div>
              <div className="modal-buttons">
                <button
                  onClick={handleUpdateModal}
                  className="btn btn-green update-btn"
                >
                  Submit
                </button>
                <button
                  onClick={handleUpdateCancel}
                  className="btn btn-gray update-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </td>
        )}
      </tr>
    </>
  );
}

export default StockItem;
