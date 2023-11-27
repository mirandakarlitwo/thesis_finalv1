import { FaCartPlus } from "react-icons/fa";

function Products({ stock, addToCart }) {
  const handleAddToCart = () => {
    addToCart(stock._id);
  };

  return (
    <>
      <tr>
        <td>{stock.name}</td>
        <td>{stock.category}</td>
        <td>{stock.price}</td>
        <td>
          <button
            className="btn btn-block"
            onClick={() => handleAddToCart(stock._id)}
          >
            <FaCartPlus />
          </button>
        </td>
      </tr>
    </>
  );
}

export default Products;
