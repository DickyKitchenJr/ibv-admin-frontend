import Logout from "../components/Logout";
import "../styles/Pages.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext, useState } from "react";

function DeleteAuthors() {
  const [formData, setFormData] = useState({ email: "" });
  const { userAccessLevel } = useContext(AuthContext);
  const apiDeleteAuthorAddress = import.meta.env.VITE_API_DELETE_AUTHOR_ADDRESS;

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData({ email: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        apiDeleteAuthorAddress + `/${formData.email}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (response.ok) {
        //clear form
        setFormData({ email: "" });
        //inform user that request was successful
        alert("Deletion Successful");
      } else {
        alert("Error. Deletion Failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
