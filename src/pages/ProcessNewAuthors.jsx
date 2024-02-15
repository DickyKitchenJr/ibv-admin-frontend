import { useEffect, useState, useContext } from "react";
import Logout from "../components/Logout";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { ConvertBio } from "../components/ConvertBio";
import "../styles/Pages.css";

function ProcessNewAuthors() {
  const { userAccessLevel } = useContext(AuthContext);
  const [pendingAuthors, setPendingAuthors] = useState([]);
  const [authorIndex, setAuthorIndex] = useState(0);
  const [authorsEmail, setAuthorsEmail] = useState("");
  const [displayInfo, setDisplayInfo] = useState("read");
  const [dataToModify, setDataToModify] = useState({
    name: false,
    authorEmail: false,
    genre: false,
    nicheGenre: false,
    links: false,
    authorBio: false,
  });
  const [additionalLink, setAdditionalLink] = useState({
    instagrambox: false,
    facebookbox: false,
    twitterbox: false,
    tiktokbox: false,
    threadsbox: false,
    mastodonbox: false,
    amazonbiobox: false,
    goodreadsbox: false,
    bookbubbox: false,
  });
  const [userChoice, setUserChoice] = useState("");

  const apiAwaitingAuthorsAddress = import.meta.env
    .VITE_API_PENDING_AUTHORS_ADDRESS;
  const apiAuthorAddress = import.meta.env.VITE_API_PUT_AUTHOR_ADDRESS;
  const apiDeleteAwaitingAuthorAddress = import.meta.env
    .VITE_API_DELETE_PENDING_AUTHOR_ADDRESS;

  useEffect(() => {
    const fetchPendingAuthors = async () => {
      try {
        const response = await fetch(apiAwaitingAuthorsAddress, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Bad Response");
        }

        //result returns an object with a success message and an array of objects called awaitingAuthors
        const result = await response.json();

        //if there are awaiting authors add them to pendingAuthors, else do nothing
        if (result.awaitingAuthors.length !== 0) {
          const adjustRawListings = (arrayOfAuthorObjects) => {
            //create empty array to populate finished list of objects
            const adjustedListings = [];
            //go into the array
            for (let i = 0; i < arrayOfAuthorObjects.length; i++) {
              //copy original object
              const author = arrayOfAuthorObjects[i];
              //convert JSON string to array for umbrellaGenre and subGenre
              const parseUmbrellaGenre = JSON.parse(author.umbrellaGenre);
              const parseSubGenre = JSON.parse(author.subGenre);
              //replace previous values with parsed values
              author.umbrellaGenre = parseUmbrellaGenre;
              author.subGenre = parseSubGenre;
              //add adjusted listing to adjustedListings array
              adjustedListings.push(author);
            }
            return adjustedListings;
          };

          //assign adjusted results for awaitingAuthors array to finalResult
          const finalResult = adjustRawListings(result.awaitingAuthors);
          setAuthorsEmail(finalResult[authorIndex].email || " ");
          setPendingAuthors(finalResult);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPendingAuthors();
  }, []);

  const properUmbrellaGenreName = (genreValue) => {
    switch (genreValue) {
      case "romance":
        return "Romance";
      case "fantasy":
        return "Fantasy";
      case "thriller":
        return "Thriller";
      case "scifi":
        return "Sci-Fi";
      case "childrens":
        return "Children's";
      case "drama":
        return "Drama";
      case "horror":
        return "Horror";
      case "comedy":
        return "Comedy";
      case "dystopian":
        return "Dystopian";
      case "nonfiction":
        return "Non-Fiction";
      case "western":
        return "Western";
      case "historicalfiction":
        return "Hist. Fict.";
      default:
        return "Not Found";
    }
  };

  const handleAcceptSubmitButton = async (e) => {
    e.preventDefault();
    const data = pendingAuthors[authorIndex];

    try {
      const response = await fetch(apiAuthorAddress, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        try {
          //delete author application if successfully added to main database
          const deleteRequest = await fetch(
            apiDeleteAwaitingAuthorAddress + `/${authorsEmail}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );
          if (deleteRequest.ok) {
            //inform user that submission was successful
            alert("Author Added To Main Database. Email Indie Book Vault.");
            //next author's email address
            const emailAddress = pendingAuthors[authorIndex + 1].email || " ";
            setAuthorsEmail(emailAddress);
            //delete author from pendingAuthors list
            const updatedPendingAuthors = pendingAuthors.filter(
              (_, index) => index !== authorIndex
            );
            setPendingAuthors(updatedPendingAuthors);
            //set display read vs edit
            setDisplayInfo("read");
          } else {
            alert(
              "Author Added To Main Database But Failed To Delete Application. Please Email Indie Book Vault."
            );
          }
        } catch (deletionError) {
          console.error("Deletion Error:", deletionError);
        }
      } else {
        alert("Failed To Add Author To Main Database.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteButton = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        apiAwaitingAuthorsAddress + `/${pendingAuthors[authorIndex].email}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Author application deleted.");
        //next author's email address
        const emailAddress = pendingAuthors[authorIndex + 1].email || " ";
        setAuthorsEmail(emailAddress);
        //delete author from pendingAuthors list
        const updatedPendingAuthors = pendingAuthors.filter(
          (_, index) => index !== authorIndex
        );
        setPendingAuthors(updatedPendingAuthors);
      } else {
        alert("Deletion Failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSkipButton = () => {
    setAuthorIndex(authorIndex + 1);
  };

  const handleEditButton = (e) => {
    e.preventDefault();

    setDisplayInfo("edit");
  };

  const handleChooseToModify = (checkboxName) => {
    setDataToModify((prevLinks) => ({
      ...prevLinks,
      [checkboxName]: !prevLinks[checkboxName],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    //copy pendingAuthors
    const updatedAuthors = [...pendingAuthors];
    //update the author at authorIndex
    updatedAuthors[authorIndex] = {
      ...updatedAuthors[authorIndex],
      [name]: value,
    };

    setPendingAuthors(updatedAuthors);
  };

  const handleGenreChange = (e) => {
    const genreValue = e.target.value;

    //copy the umbrellaGenre array for the chosen author
    const updatedGenres = [...pendingAuthors[authorIndex].umbrellaGenre];

    if (e.target.checked) {
      //if checkbox is checked, add the genre to the array
      updatedGenres.push(genreValue);
    } else {
      //if checkbox is unchecked, remove the genre from the array
      const genreIndex = updatedGenres.indexOf(genreValue);
      if (genreIndex !== -1) {
        updatedGenres.splice(genreIndex, 1);
      }
    }
    //copy pendingAuthors
    const updatedAuthors = [...pendingAuthors];
    //update the author at authorIndex
    updatedAuthors[authorIndex] = {
      ...updatedAuthors[authorIndex],
      umbrellaGenre: updatedGenres,
    };

    setPendingAuthors(updatedAuthors);
  };

  const handleAddSubGenre = (e) => {
    e.preventDefault();
    //copy pendingAuthors
    const updatedAuthors = [...pendingAuthors];
    //update the author at authorIndex
    updatedAuthors[authorIndex] = {
      ...updatedAuthors[authorIndex],
      subGenre: [...updatedAuthors[authorIndex].subGenre, userChoice],
    };

    setPendingAuthors(updatedAuthors);
    // clear userChoice
    setUserChoice("");
  };

  const handleRemoveSubGenre = (index) => {
    const updatedSubGenre = pendingAuthors[authorIndex].subGenre.filter(
      (_, i) => i !== index
    );
    //copy pendingAuthors
    const updatedAuthors = [...pendingAuthors];
    //update the author at authorIndex
    updatedAuthors[authorIndex] = {
      ...updatedAuthors[authorIndex],
      subGenre: updatedSubGenre,
    };
    setPendingAuthors(updatedAuthors);
  };

  const handleUserChoice = (e) => {
    const { value } = e.target;
    setUserChoice(value);
  };

  const handleAdditionalLinksBox = (checkboxName) => {
    setAdditionalLink((prevLinks) => ({
      ...prevLinks,
      [checkboxName]: !prevLinks[checkboxName],
    }));
  };

  const handleBioChange = (e) => {
    const { value } = e.target;
    const enforceSingleLineBreaks = (input) => {
      return input.replace(/\n{2,}/g, "\n\n");
    };

    // if the input is for bio use enforceSingleLineBreaks, otherwise just return the value
    const processedValue = enforceSingleLineBreaks(value);
    //copy pendingAuthors
    const updatedAuthors = [...pendingAuthors];
    //update the author at authorIndex
    updatedAuthors[authorIndex] = {
      ...updatedAuthors[authorIndex],
      bio: processedValue,
    };
    setPendingAuthors(updatedAuthors);
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

      <h1 className="title">Process Author Applications</h1>
      <h2 className="title">
        Currently there are {pendingAuthors.length} authors in the queue
      </h2>
      {pendingAuthors.length === 0 ? (
        <main className="main">
          <p className="author-info">
            Thank you for helping keep our list empty.
          </p>
        </main>
      ) : (
        <main className="main">
          {authorIndex === pendingAuthors.length ? (
            <h3 className="author-info">
              You have viewed all authors waiting to be processed. Thank you.
            </h3>
          ) : (
            <>
              {displayInfo === "read" ? (
                <div className="author-info">
                  <p className="center-text">
                    Verify Accuracy Of All Links And That Author Has Published
                    Work
                  </p>
                  <br />
                  <p className="spacer">
                    Name: {pendingAuthors[authorIndex].firstName}{" "}
                    {pendingAuthors[authorIndex].lastName}
                  </p>
                  <p className="spacer">
                    Email: {pendingAuthors[authorIndex].email}
                  </p>
                  {pendingAuthors[authorIndex].website ? (
                    <p className="spacer">
                      Website:{" "}
                      <a href={pendingAuthors[authorIndex].website}>
                        {pendingAuthors[authorIndex].website}
                      </a>
                    </p>
                  ) : (
                    <p className="spacer">
                      No Website Found. Verify Membership Before Continuing.
                    </p>
                  )}
                  <p className="spacer">
                    Umbrella Genre:{" "}
                    {pendingAuthors[authorIndex].umbrellaGenre.map(
                      (genres, index, array) => (
                        <span key={index}>
                          {properUmbrellaGenreName(genres)}
                          {index !== array.length - 1 && ", "}
                        </span>
                      )
                    )}
                  </p>
                  <p className="spacer">
                    Subgenre:{" "}
                    {pendingAuthors[authorIndex].subGenre.map(
                      (genres, index, array) => (
                        <span key={index}>
                          {genres}
                          {index !== array.length - 1 && ", "}
                        </span>
                      )
                    )}
                  </p>
                  <div className="spacer">
                    <p>Links:</p>
                    <div className="additional-links">
                      {!pendingAuthors[authorIndex].instagram ? null : (
                        <a href={pendingAuthors[authorIndex].instagram}>
                          Instagram
                        </a>
                      )}
                      {!pendingAuthors[authorIndex].facebook ? null : (
                        <a href={pendingAuthors[authorIndex].facebook}>
                          Facebook
                        </a>
                      )}
                      {!pendingAuthors[authorIndex].twitter ? null : (
                        <a href={pendingAuthors[authorIndex].twitter}>
                          Twitter/X
                        </a>
                      )}
                      {!pendingAuthors[authorIndex].tiktok ? null : (
                        <a href={pendingAuthors[authorIndex].tiktok}>TikTok</a>
                      )}
                      {!pendingAuthors[authorIndex].threads ? null : (
                        <a href={pendingAuthors[authorIndex].threads}>
                          Threads
                        </a>
                      )}
                      {!pendingAuthors[authorIndex].mastodon ? null : (
                        <a href={pendingAuthors[authorIndex].mastodon}>
                          Mastodon
                        </a>
                      )}
                      {!pendingAuthors[authorIndex].amazonBio ? null : (
                        <a href={pendingAuthors[authorIndex].amazonBio}>
                          Amazon Author Page
                        </a>
                      )}
                      {!pendingAuthors[authorIndex].goodreads ? null : (
                        <a href={pendingAuthors[authorIndex].goodreads}>
                          Goodreads
                        </a>
                      )}
                      {!pendingAuthors[authorIndex].bookbub ? null : (
                        <a href={pendingAuthors[authorIndex].bookbub}>
                          BookBub
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="spacer">
                    Bio: {ConvertBio(pendingAuthors[authorIndex].bio)}
                  </p>
                  <p className="attention">
                    Email Indie Book Vault After Verifying Or Deleting with
                    Authors Information
                  </p>
                  <div className="buttons-side-by-side">
                    <button
                      className="button"
                      onClick={handleAcceptSubmitButton}
                    >
                      Accept
                    </button>
                    <button className="button" onClick={handleEditButton}>
                      Edit
                    </button>
                    <button className="button" onClick={handleDeleteButton}>
                      Delete
                    </button>
                    <button className="button" onClick={handleSkipButton}>
                      Skip
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleAcceptSubmitButton}
                  className="author-info"
                >
                  <p className="center-text">
                    Only Change Information That Needs Corrections.
                  </p>
                  <br />
                  <p>Select What To Change:</p>
                  <div>
                    {/* Name Section */}
                    <div className="spacer">
                      <label htmlFor="name">Name</label>{" "}
                      <input
                        type="checkbox"
                        id="name"
                        className="user-checkbox"
                        onChange={() => handleChooseToModify("name")}
                        checked={dataToModify.name}
                      />
                      <br />
                      {!dataToModify.name ? null : (
                        <>
                          <label htmlFor="firstName">First Name:</label>
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="user-input"
                            defaultValue={pendingAuthors[authorIndex].firstName}
                            value={pendingAuthors[authorIndex].firstName}
                            onChange={handleInputChange}
                          />
                          <br />
                          <label htmlFor="lastName">Last Name:</label>
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="user-input"
                            defaultValue={pendingAuthors[authorIndex].lastName}
                            value={pendingAuthors[authorIndex].lastName}
                            onChange={handleInputChange}
                          />
                        </>
                      )}
                    </div>
                    {/* Email Section */}
                    <div className="spacer">
                      <label htmlFor="authorEmail">Email</label>{" "}
                      <input
                        type="checkbox"
                        id="authorEmail"
                        className="user-checkbox"
                        onChange={() => handleChooseToModify("authorEmail")}
                        checked={dataToModify.authorEmail}
                      />
                      <br />
                      {!dataToModify.authorEmail ? null : (
                        <>
                          <label htmlFor="email" className="for-accessibility">
                            Email
                          </label>
                          <input
                            type="text"
                            name="email"
                            id="email"
                            className="user-input"
                            defaultValue={pendingAuthors[authorIndex].email}
                            value={pendingAuthors[authorIndex].email}
                            onChange={handleInputChange}
                          />
                        </>
                      )}
                    </div>
                    {/* Umbrella Genre Section */}
                    <div className="spacer">
                      <label htmlFor="genre">Umbrella Genre</label>{" "}
                      <input
                        type="checkbox"
                        id="genre"
                        className="user-checkbox"
                        onChange={() => handleChooseToModify("genre")}
                        checked={dataToModify.genre}
                      />
                      <br />
                      {!dataToModify.genre ? null : (
                        <>
                          <label
                            htmlFor="umbrellaGenre"
                            className="for-accessibility"
                          >
                            Umbrella Genre
                          </label>
                          <div id="umbrellaGenre" className="umbrella-genre">
                            <div>
                              <input
                                type="checkbox"
                                id="romance"
                                name="umbrellaGenre"
                                value="romance"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("romance")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="romance">Romance</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="fantasy"
                                name="umbrellaGenre"
                                value="fantasy"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("fantasy")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="fantasy">Fantasy</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="thriller"
                                name="umbrellaGenre"
                                value="thriller"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("thriller")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="thriller">Thriller</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="scifi"
                                name="umbrellaGenre"
                                value="scifi"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("scifi")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="scifi">Sci-Fi</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="childrens"
                                name="umbrellaGenre"
                                value="childrens"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("childrens")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="childrens">Children's</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="drama"
                                name="umbrellaGenre"
                                value="drama"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("drama")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="drama">Drama</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="horror"
                                name="umbrellaGenre"
                                value="horror"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("horror")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="horror">Horror</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="comedy"
                                name="umbrellaGenre"
                                value="comedy"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("comedy")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="comedy">Comedy</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="dystopian"
                                name="umbrellaGenre"
                                value="dystopian"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("dystopian")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="dystopian">Dystopian</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="nonfiction"
                                name="umbrellaGenre"
                                value="nonfiction"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("nonfiction")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="nonfiction">Non-Fiction</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="western"
                                name="umbrellaGenre"
                                value="western"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("western")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="western">Western</label>
                            </div>
                            <div>
                              <input
                                type="checkbox"
                                id="historicalfiction"
                                name="umbrellaGenre"
                                value="historicalfiction"
                                checked={pendingAuthors[
                                  authorIndex
                                ].umbrellaGenre.includes("historicalfiction")}
                                onChange={handleGenreChange}
                              />
                              <label htmlFor="historicalfiction">
                                Hist. Fict.
                              </label>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {/* Subgenre Section */}
                    <div className="spacer">
                      <label htmlFor="nicheGenre">Subgenre</label>{" "}
                      <input
                        type="checkbox"
                        id="nicheGenre"
                        className="user-checkbox"
                        onChange={() => handleChooseToModify("nicheGenre")}
                        checked={dataToModify.nicheGenre}
                      />
                      <br />
                      {!dataToModify.nicheGenre ? null : (
                        <>
                          <label
                            htmlFor="subGenre"
                            className="for-accessibility"
                          >
                            Subgenre
                          </label>
                          <div className="side-by-side">
                            <input
                              className="user-input"
                              type="text"
                              name="subGenre"
                              id="subGenre"
                              value={userChoice}
                              onChange={handleUserChoice}
                            />
                            {/* adds text to subGenre array */}{" "}
                            <button
                              onClick={handleAddSubGenre}
                              className="button"
                            >
                              Add
                            </button>
                          </div>
                          {/* display current subGenre array */}
                          <p>Current Sub-Genres Selected:</p>
                          <p>
                            {pendingAuthors[authorIndex].subGenre.map(
                              (subGenre, index) => (
                                <span key={index}>
                                  {subGenre}&nbsp;
                                  {/* removes the selected item from the array */}
                                  <span
                                    className="remove-dash"
                                    onClick={() => handleRemoveSubGenre(index)}
                                  >
                                    &times;
                                  </span>
                                  &nbsp;
                                </span>
                              )
                            )}
                          </p>
                        </>
                      )}
                    </div>
                    {/* Links Section */}
                    <div className="spacer">
                      <label htmlFor="links">Links</label>{" "}
                      <input
                        type="checkbox"
                        id="links"
                        className="user-checkbox"
                        onChange={() => handleChooseToModify("links")}
                        checked={dataToModify.links}
                      />
                      <br />
                      {!dataToModify.links ? null : (
                        <>
                          <div className="additional-links">
                            <div>
                              <input
                                className="user-checkbox"
                                type="checkbox"
                                id="instagrambox"
                                onChange={() =>
                                  handleAdditionalLinksBox("instagrambox")
                                }
                                checked={additionalLink.instagrambox}
                              />
                              <label htmlFor="instagrambox">Instagram</label>
                            </div>
                            <div>
                              <input
                                className="user-checkbox"
                                type="checkbox"
                                id="facebookbox"
                                onChange={() =>
                                  handleAdditionalLinksBox("facebookbox")
                                }
                                checked={additionalLink.facebookbox}
                              />
                              <label htmlFor="facebookbox">Facebook</label>
                            </div>
                            <div>
                              <input
                                className="user-checkbox"
                                type="checkbox"
                                id="twitterbox"
                                onChange={() =>
                                  handleAdditionalLinksBox("twitterbox")
                                }
                                checked={additionalLink.twitterbox}
                              />
                              <label htmlFor="twitterbox">Twitter/X</label>
                            </div>
                            <div>
                              <input
                                className="user-checkbox"
                                type="checkbox"
                                id="tiktokbox"
                                onChange={() =>
                                  handleAdditionalLinksBox("tiktokbox")
                                }
                                checked={additionalLink.tiktokbox}
                              />
                              <label htmlFor="tiktokbox">TikTok</label>
                            </div>
                            <div>
                              <input
                                className="user-checkbox"
                                type="checkbox"
                                id="threadsbox"
                                onChange={() =>
                                  handleAdditionalLinksBox("threadsbox")
                                }
                                checked={additionalLink.threadsbox}
                              />
                              <label htmlFor="threadsbox">Threads</label>
                            </div>
                            <div>
                              <input
                                className="user-checkbox"
                                type="checkbox"
                                id="mastodonbox"
                                onChange={() =>
                                  handleAdditionalLinksBox("mastodonbox")
                                }
                                checked={additionalLink.mastodonbox}
                              />
                              <label htmlFor="mastodonbox">Mastodon</label>
                            </div>
                            <div>
                              <input
                                className="user-checkbox"
                                type="checkbox"
                                id="amazonbiobox"
                                onChange={() =>
                                  handleAdditionalLinksBox("amazonbiobox")
                                }
                                checked={additionalLink.amazonbiobox}
                              />
                              <label htmlFor="amazonbiobox">
                                Amazon Author Page
                              </label>
                            </div>
                            <div>
                              <input
                                className="user-checkbox"
                                type="checkbox"
                                id="goodreadsbox"
                                onChange={() =>
                                  handleAdditionalLinksBox("goodreadsbox")
                                }
                                checked={additionalLink.goodreadsbox}
                              />
                              <label htmlFor="goodreadsbox">Goodreads</label>
                            </div>
                            <div>
                              <input
                                className="user-checkbox"
                                type="checkbox"
                                id="bookbubbox"
                                onChange={() =>
                                  handleAdditionalLinksBox("bookbubbox")
                                }
                                checked={additionalLink.bookbubbox}
                              />
                              <label htmlFor="bookbubbox">BookBub</label>
                            </div>
                          </div>
                          <br />
                          {additionalLink.instagrambox ? (
                            <>
                              <label htmlFor="instagram">Instagram:</label>
                              <input
                                className="user-input"
                                type="text"
                                name="instagram"
                                id="instagram"
                                value={pendingAuthors[authorIndex].instagram}
                                defaultValue={
                                  pendingAuthors[authorIndex].instagram
                                }
                                onChange={handleInputChange}
                              />
                              <br />
                            </>
                          ) : null}
                          {additionalLink.facebookbox ? (
                            <>
                              <label htmlFor="facebook">Facebook:</label>
                              <input
                                className="user-input"
                                type="text"
                                name="facebook"
                                id="facebook"
                                value={pendingAuthors[authorIndex].facebook}
                                defaultValue={
                                  pendingAuthors[authorIndex].facebook
                                }
                                onChange={handleInputChange}
                              />
                              <br />
                            </>
                          ) : null}
                          {additionalLink.twitterbox ? (
                            <>
                              <label htmlFor="twitter">Twitter/X:</label>
                              <input
                                className="user-input"
                                type="text"
                                name="twitter"
                                id="twitter"
                                value={pendingAuthors[authorIndex].twitter}
                                defaultValue={
                                  pendingAuthors[authorIndex].twitter
                                }
                                onChange={handleInputChange}
                              />
                              <br />
                            </>
                          ) : null}
                          {additionalLink.tiktokbox ? (
                            <>
                              <label htmlFor="tiktok">TikTok:</label>
                              <input
                                className="user-input"
                                type="text"
                                name="tiktok"
                                id="tiktok"
                                value={pendingAuthors[authorIndex].tiktok}
                                defaultValue={
                                  pendingAuthors[authorIndex].tiktok
                                }
                                onChange={handleInputChange}
                              />
                              <br />
                            </>
                          ) : null}
                          {additionalLink.threadsbox ? (
                            <>
                              <label htmlFor="threads">Threads:</label>
                              <input
                                className="user-input"
                                type="text"
                                name="threads"
                                id="threads"
                                value={pendingAuthors[authorIndex].threads}
                                defaultValue={
                                  pendingAuthors[authorIndex].threads
                                }
                                onChange={handleInputChange}
                              />
                              <br />
                            </>
                          ) : null}
                          {additionalLink.mastodonbox ? (
                            <>
                              <label htmlFor="mastodon">Mastodon:</label>
                              <input
                                className="user-input"
                                type="text"
                                name="mastodon"
                                id="mastodon"
                                value={pendingAuthors[authorIndex].mastodon}
                                defaultValue={
                                  pendingAuthors[authorIndex].mastodon
                                }
                                onChange={handleInputChange}
                              />
                              <br />
                            </>
                          ) : null}
                          {additionalLink.amazonbiobox ? (
                            <>
                              <label htmlFor="amazonBio">
                                Amazon Author Page:
                              </label>
                              <input
                                className="user-input"
                                type="text"
                                name="amazonBio"
                                id="amazonBio"
                                value={pendingAuthors[authorIndex].amazonBio}
                                defaultValue={
                                  pendingAuthors[authorIndex].amazonBio
                                }
                                onChange={handleInputChange}
                              />
                              <br />
                            </>
                          ) : null}
                          {additionalLink.goodreadsbox ? (
                            <>
                              <label htmlFor="goodreads">Goodreads:</label>
                              <input
                                type="text"
                                className="user-input"
                                name="goodreads"
                                id="goodreads"
                                value={pendingAuthors[authorIndex].goodreads}
                                defaultValue={
                                  pendingAuthors[authorIndex].goodreads
                                }
                                onChange={handleInputChange}
                              />
                              <br />
                            </>
                          ) : null}
                          {additionalLink.bookbubbox ? (
                            <>
                              <label htmlFor="bookbub">BookBub:</label>
                              <input
                                className="user-input"
                                type="text"
                                name="bookbub"
                                id="bookbub"
                                value={pendingAuthors[authorIndex].bookbub}
                                defaultValue={
                                  pendingAuthors[authorIndex].bookbub
                                }
                                onChange={handleInputChange}
                              />
                              <br />
                            </>
                          ) : null}{" "}
                        </>
                      )}
                    </div>
                    {/* Bio Section */}
                    <div className="spacer">
                      <label htmlFor="authorBio">Bio</label>{" "}
                      <input
                        type="checkbox"
                        id="authorBio"
                        className="user-checkbox"
                        onChange={() => handleChooseToModify("authorBio")}
                        checked={dataToModify.authorBio}
                      />
                      {!dataToModify.authorBio ? null : (
                        <>
                          <label htmlFor="bio" className="for-accessibility">
                            Bio
                          </label>
                          <textarea
                            className="bio-text"
                            name="bio"
                            id="bio"
                            cols="30"
                            rows="10"
                            defaultValue={ConvertBio(
                              pendingAuthors[authorIndex].bio
                            )}
                            onChange={handleBioChange}
                          ></textarea>
                        </>
                      )}
                    </div>
                    {/* Submit */}
                    <div className="submit">
                      <button className="button">Submit</button>
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </main>
      )}
    </>
  );
}

export default ProcessNewAuthors;
