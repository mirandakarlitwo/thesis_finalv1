import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Joven's Minimart</h1>
      <h4>Online Convenience Store</h4>
      <p>Start shopping now!</p>

      <p className="italicized">
        <Link to="/login">Login here!</Link>
      </p>
    </div>
  );
}

export default Home;
