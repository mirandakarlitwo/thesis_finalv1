import { useEffect, useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [updatedQuantity, setUpdatedQuantity] = useState(1);

  const URL = import.meta.env.VITE_REACT_API_URL;

  const fetchCartItems = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${URL}/api/users/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { cart } = await response.json();
      setCartItems(cart);
    } catch (error) {
      console.log("Fetching cart items unsuccessful", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const removeFromCart = async (productName) => {
    try {
      const token = sessionStorage.getItem("token");

      await fetch(`${URL}/api/remove-from-cart/${productName}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Fetch the updated cart items and refresh the UI
      fetchCartItems();
    } catch (error) {
      console.error("Removing item from cart unsuccessful", error);
    }
  };

  const totalCartPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const formattedTotalPrice = totalCartPrice.toFixed(2);

  const onButtonClick = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleSubmitOrder = async () => {
    setModal(false);

    try {
      const token = sessionStorage.getItem("token");

      // Collect user information from the form
      const name = document.getElementById("name").value;
      const address = document.getElementById("address").value;
      const contact = document.getElementById("contact").value;

      // Send order data to the server
      const response = await fetch(`${URL}/api/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address,
          contact,
        }),
      });

      const { message, data } = await response.json();
      alert(message);

      // Fetch the updated cart items
      fetchCartItems();
    } catch (error) {
      console.error("Placing order unsuccessful", error);
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div className="cartCard" key={item._id}>
              <h3>{item.productName}</h3>
              <h5>Quantity: {item.quantity}</h5>
              <p>Price per unit: ₱{item.price}</p>
              <h4>Total: ₱{item.price * item.quantity}</h4>

              <button
                className="btn btn-block"
                onClick={() => removeFromCart(item.productName)}
              >
                Remove From Cart
              </button>
            </div>
          ))
        )}

        <h1>Total Price: ₱{formattedTotalPrice}</h1>

        <button className="btn btn-block" onClick={onButtonClick}>
          Place Order
        </button>
      </div>

      {modal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <p>Note: All orders are subjected to Cash on Delivery Only</p>
            <h2>Order Confirmation</h2>
            <h1>Total Price: ₱{formattedTotalPrice}</h1>
            <div className="form-group-order">
              <form>
                <p>Name: </p>
                <input type="text" className="form-control" id="name" />
                <p>Address: </p>
                <input type="text" className="form-control" id="address" />
                <p>Contact #: </p>
                <input type="text" className="form-control" id="contact" />
              </form>
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-block"
                onClick={handleSubmitOrder}
              >
                Submit Order!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
