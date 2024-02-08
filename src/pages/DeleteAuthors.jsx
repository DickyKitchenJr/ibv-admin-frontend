import Logout from "../components/Logout";
import "../styles/Pages.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";

function DeleteAuthors() {
  const { userAccessLevel } = useContext(AuthContext);

  const unauthorizedUser = () => {
    if (userAccessLevel !== "admin") {
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* check if user is authorized, and if not deny access and send them to the login */}
      {unauthorizedUser()}

      <nav className="top-bar">
        <NavLink to="/welcome" className="back">
          &#129092; Back
        </NavLink>
        <Logout />
      </nav>

      <h1 className="title">Delete Authors</h1>
      <h2 className="title">Point Of No Return</h2>

      <main className="main">
        <form className="user-info" onSubmit={handleSubmit}>
          <p className="center-text">Deletions Can Not Be Reversed</p>
          <br />
          <label htmlFor="email">Author's Email:</label>
          <input
            className="user-input"
            type="text"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <br />
          <br />
          <div className="submit">
            <button className="button">Submit</button>
          </div>
        </form>
      </main>
    </>
  );
}

export default DeleteAuthors;
