import { useEffect, useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [modal, setModal] = useState(false);

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

  const handleSubmitOrder = () => {
    setModal(false);

    alert("Ordered Successfully");
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
              <p>Price per unit: ${item.price}</p>
              <h4>Total: ${item.price * item.quantity}</h4>
            </div>
          ))
        )}

        <h1>Total Price: ${formattedTotalPrice}</h1>

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
            <h2>Order Confirmation</h2>
            <h1>Total Price: ${formattedTotalPrice}</h1>
            <div className="form-group-order">
              <form>
                <p>Name: </p>
                <input type="text" className="form-control" />
                <p>Address: </p>
                <input type="text" className="form-control" />
                <p>Contact #: </p>
                <input type="text" className="form-control" />
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
