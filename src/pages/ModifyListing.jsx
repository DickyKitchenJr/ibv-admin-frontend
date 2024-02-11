import Logout from "../components/Logout";
import "../styles/Pages.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext, useState } from "react";

function ModifyListing() {
  const { userAccessLevel } = useContext(AuthContext);
  const [displayInfo, setDisplayInfo] = useState("getAuthor");
  const [authorEmail, setAuthorEmail] = useState({ email: "" });
  const [authorListing, setAuthorListing] = useState([]);
  const apiGetAuthorAddress = import.meta.env.VITE_API_AUTHOR_BY_EMAIL_ADDRESS;

  const handleEmailInput = (e) => {
    const { value } = e.target;
    setAuthorEmail({ email: value });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        apiGetAuthorAddress + `/${authorEmail.email}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        //set author listing
        const result = await response.json();
        setAuthorListing(result.author);
        //change display to show modify author form
        handleDisplayInfo();
      } else {
        alert("Error. Author Search Failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDisplayInfo = () => {
    if (displayInfo === "getAuthor") {
      setDisplayInfo("modifyAuthor");
    } else {
      setDisplayInfo("getAuthor");
    }
  };

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
      <h2 className="title">Email Indie Book Vault After Making Changes</h2>

      {displayInfo === "getAuthor" ? (
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
      ) : (
        <main className="main">
          <form className="author-info">
            <p className="center-text">Only Change Requested Information</p>
            <br />
            <p>Select What To Change:</p>
            <div>
              <label htmlFor="name">Name</label>{" "}
              <input type="checkbox" id="name" className="user-checkbox" />
              <br />
              <label htmlFor="authorEmail">Email</label>{" "}
              <input
                type="checkbox"
                id="authorEmail"
                className="user-checkbox"
              />
              <br />
              <label htmlFor="genre">Umbrella Genre</label>{" "}
              <input type="checkbox" id="genre" className="user-checkbox" />
              <br />
              <label htmlFor="nicheGenre">Sub-Genre</label>{" "}
              <input
                type="checkbox"
                id="nicheGenre"
                className="user-checkbox"
              />
              <br />
              <label htmlFor="links">Links</label>{" "}
              <input type="checkbox" id="links" className="user-checkbox" />
              <br />
              <label htmlFor="authorBio">Bio</label>{" "}
              <input type="checkbox" id="authorBio" className="user-checkbox" />
            </div>
          </form>
        </main>
      )}
    </>
  );
}

export default ModifyListing;
