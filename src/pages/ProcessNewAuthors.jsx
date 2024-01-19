import AddToAuthorList from "../components/AddToAuthorList";
import Logout from "../components/Logout";

function ProcessNewAuthors() {
  return (
    <>
      <Logout />
      <h1>Confirm New Authors</h1>
      <AddToAuthorList />
    </>
  );
}

export default ProcessNewAuthors;
