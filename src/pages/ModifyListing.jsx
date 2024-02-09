import Logout from "../components/Logout";
import "../styles/Pages.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";

function ModifyListing() {
  const { userAccessLevel } = useContext(AuthContext);

  const unauthorizedUser = () => {
    if (userAccessLevel !== "admin" && userAccessLevel !== "helper") {
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

      <h1 className="title">Modify Listing</h1>

      <main className="main">
        <form className="author-info" onSubmit={handleEmailSubmit}>
          <p className="center-text">Only Change Requested Information</p>
          <br />
          <label htmlFor="email">Author's Email:</label>
          <input
            className="user-input"
            type="text"
            name="email"
            id="email"
            value={authorEmail.email}
            onChange={handleEmailInput}
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

export default ModifyListing;
