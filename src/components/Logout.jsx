import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import "../styles/Logout.css";

function Logout() {
  const { handleLogout } = useContext(AuthContext);

  const handleClick = (e) => {
    handleLogout(e);
  };

  return (
    <button className="logout" onClick={handleClick}>
      Log Out
    </button>
  );
}

export default Logout;
