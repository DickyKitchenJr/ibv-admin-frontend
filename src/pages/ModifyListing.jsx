import Logout from "../components/Logout";
import "../styles/Pages.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useContext, useState } from "react";
import { ConvertBio } from "../components/ConvertBio";

function ModifyListing() {
  const { userAccessLevel } = useContext(AuthContext);
  const [displayInfo, setDisplayInfo] = useState("getAuthor");
  const [authorEmail, setAuthorEmail] = useState({ email: "" });
  const [authorListing, setAuthorListing] = useState({});
  const [dataToModify, setDataToModify] = useState({
    name: false,
    authorEmail: false,
    authorWebsite: false,
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

  const apiGetAuthorAddress = import.meta.env.VITE_API_AUTHOR_BY_EMAIL_ADDRESS;
  const apiModifyAuthorListingAddress = import.meta.env
    .VITE_API_MODIFY_AUTHORS_ADDRESS;

  const handleDisplayInfo = () => {
    if (displayInfo === "getAuthor") {
      setDisplayInfo("modifyAuthor");
    } else {
      setDisplayInfo("getAuthor");
    }
  };

  //getAuthor form handlers

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
        const result = await response.json();
        //change initial result of umbrellaGenre and subGenre from strings to arrays
        const parseUmbrellaGenre = JSON.parse(result.author.umbrellaGenre);
        const parseSubGenre = JSON.parse(result.author.subGenre);
        //create object from author listing in results
        const listing = result.author;
        //modify object to include parsed data
        listing.umbrellaGenre = parseUmbrellaGenre;
        listing.subGenre = parseSubGenre;
        //set authorListing as listing object
        setAuthorListing(listing);
        //change display to show modify author form
        handleDisplayInfo();
      } else {
        alert("Error. Author Search Failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //modifyAuthor form handlers

  const handleChooseToModify = (checkboxName) => {
    setDataToModify((prevLinks) => ({
      ...prevLinks,
      [checkboxName]: !prevLinks[checkboxName],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuthorListing({ ...authorListing, [name]: value });
  };

  const handleGenreChange = (e) => {
    const genreValue = e.target.value;
    const updatedGenres = [...authorListing.umbrellaGenre];
    if (e.target.checked) {
      // If checkbox is checked, add the genre to the array
      updatedGenres.push(genreValue);
    } else {
      // If checkbox is unchecked, remove the genre from the array
      const genreIndex = updatedGenres.indexOf(genreValue);
      if (genreIndex !== -1) {
        updatedGenres.splice(genreIndex, 1);
      }
    }
    setAuthorListing({ ...authorListing, umbrellaGenre: updatedGenres });
  };

  const handleAddSubGenre = (e) => {
    e.preventDefault();
    setAuthorListing({
      ...authorListing,
      subGenre: [...authorListing.subGenre, userChoice],
    });
    // clear userChoice
    setUserChoice("");
  };

  const handleRemoveSubGenre = (index) => {
    const updatedSubGenre = authorListing.subGenre.filter(
      (_, i) => i !== index
    );
    setAuthorListing({
      ...authorListing,
      subGenre: updatedSubGenre,
    });
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

    setAuthorListing({ ...authorListing, bio: processedValue });
  };

  const filteredAuthorListing = () => {
    setAuthorListing((author) => {
      //remove id, createdAt, and updatedAt values to prevent accidentally modifying them
      const { id, createdAt, updatedAt, ...rest } = author;
      return rest;
    });
    return authorListing;
  };

  const handleModifySubmit = async (e) => {
    e.preventDefault();

    const data = filteredAuthorListing();
    // fetch request to update isVerified to true
    try {
      const response = await fetch(
        apiModifyAuthorListingAddress + `/${authorEmail.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(
          `${result.author.firstName} ${result.author.lastName} listing is now updated`
        );
        setDisplayInfo("getAuthor");
      } else {
        alert("Listing did not update");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Validation section
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
          <form onSubmit={handleModifySubmit} className="author-info">
            <p className="center-text">Only Change Requested Information</p>
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
                      defaultValue={authorListing.firstName}
                      value={authorListing.firstName}
                      onChange={handleInputChange}
                    />
                    <br />
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="user-input"
                      defaultValue={authorListing.lastName}
                      value={authorListing.lastName}
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
                      defaultValue={authorListing.email}
                      value={authorListing.email}
                      onChange={handleInputChange}
                    />
                  </>
                )}
              </div>
              {/* Website Section */}
              <div className="spacer">
                <label htmlFor="authorWebsite">Website</label>{" "}
                <input
                  type="checkbox"
                  id="authorWebsite"
                  className="user-checkbox"
                  onChange={() => handleChooseToModify("authorWebsite")}
                  checked={dataToModify.authorWebsite}
                />
                <br />
                {!dataToModify.authorWebsite ? null : (
                  <>
                    <label htmlFor="website" className="for-accessibility">
                      Website
                    </label>
                    <input
                      type="text"
                      name="website"
                      id="website"
                      className="user-input"
                      defaultValue={authorListing.website}
                      value={authorListing.website}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "romance"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "fantasy"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "thriller"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "scifi"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "childrens"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "drama"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "horror"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "comedy"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "dystopian"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "nonfiction"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "western"
                          )}
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
                          checked={authorListing.umbrellaGenre.includes(
                            "historicalfiction"
                          )}
                          onChange={handleGenreChange}
                        />
                        <label htmlFor="historicalfiction">Hist. Fict.</label>
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
                    <label htmlFor="subGenre" className="for-accessibility">
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
                      <button onClick={handleAddSubGenre} className="button">
                        Add
                      </button>
                    </div>
                    {/* display current subGenre array */}
                    <p>Current Sub-Genres Selected:</p>
                    <p>
                      {authorListing.subGenre.map((subGenre, index) => (
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
                      ))}
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
                          onChange={() => handleAdditionalLinksBox("tiktokbox")}
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
                        <label htmlFor="amazonbiobox">Amazon Author Page</label>
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
                          value={authorListing.instagram}
                          defaultValue={authorListing.instagram}
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
                          value={authorListing.facebook}
                          defaultValue={authorListing.facebook}
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
                          value={authorListing.twitter}
                          defaultValue={authorListing.twitter}
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
                          value={authorListing.tiktok}
                          defaultValue={authorListing.tiktok}
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
                          value={authorListing.threads}
                          defaultValue={authorListing.threads}
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
                          value={authorListing.mastodon}
                          defaultValue={authorListing.mastodon}
                          onChange={handleInputChange}
                        />
                        <br />
                      </>
                    ) : null}
                    {additionalLink.amazonbiobox ? (
                      <>
                        <label htmlFor="amazonBio">Amazon Author Page:</label>
                        <input
                          className="user-input"
                          type="text"
                          name="amazonBio"
                          id="amazonBio"
                          value={authorListing.amazonBio}
                          defaultValue={authorListing.amazonBio}
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
                          value={authorListing.goodreads}
                          defaultValue={authorListing.goodreads}
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
                          value={authorListing.bookbub}
                          defaultValue={authorListing.bookbub}
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
                      defaultValue={ConvertBio(authorListing.bio)}
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
        </main>
      )}
    </>
  );
}

export default ModifyListing;
