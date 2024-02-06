import { NavLink } from "react-router-dom";
import "../styles/Welcome.css";
import Logout from "../components/Logout";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";

function Welcome() {
  const { userAccessLevel } = useContext(AuthContext);

  return (
    <>
      <div className="welcome-top-bar">
        <Logout />
      </div>

      <h1 className="title">Welcome To The Inner Vault</h1>
      <h2 className="title">How Would You Like To Help?</h2>
      {userAccessLevel === "admin" ? (
        <>
          {" "}
          <main className="welcome">
            <NavLink to="/addauthors" className="welcome-tab">
              Process Applications
            </NavLink>
            <NavLink to="/modify" className="welcome-tab">
              Modify Listing
            </NavLink>
            <NavLink to="/verify" className="welcome-tab">
              Verify Listings
            </NavLink>
            <NavLink to="/delete" className="welcome-tab">
              Delete Authors
            </NavLink>
            <NavLink to="/addusers" className="welcome-tab">
              Add Users
            </NavLink>
            <br />
            <br />
          </main>{" "}
        </>
      ) : (
        <>
          {" "}
          <main className="welcome">
            <NavLink to="/addauthors" className="welcome-tab">
              Process Applications
            </NavLink>
            <NavLink to="/modify" className="welcome-tab">
              Modify Listing
            </NavLink>
            <NavLink to="/verify" className="welcome-tab">
              Verify Listings
            </NavLink>
            <br />
            <br />
          </main>{" "}
        </>
      )}
    </>
  );
}

export default Welcome;
