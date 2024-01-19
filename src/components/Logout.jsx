import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

function Logout() {
  const {handleLogout} = useContext(AuthContext)
  
  const handleClick = (e) =>{
    handleLogout(e);
  }

  return <button onClick={handleClick}>Log Out</button>;
}

export default Logout;
