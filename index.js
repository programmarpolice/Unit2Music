const COHORT = "Joy-2408";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/artists/`;

// === State ===

const state = {
  artists: [],
};

/** Updates state with artists from API */
async function getArtists() {
  try {
    const response = await fetch(API_URL);
    const responseObj = await response.json();
    // debugger;
    state.artists = responseObj.data;
  } catch (error) {
    console.error(error);
  }
}

/** Asks the API to create a new artist based on the given `artist` */
async function addArtist(artist) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artist),
    });
    if (!response.ok) {
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

// === Render ===

/** Renders artists from state */
function renderArtists() {
  const $artists = state.artists.map((artist) => {
    const $li = document.createElement("li");
    $li.innerHTML = `
    <h2> ${artist.name}</h2>
    <img src="${artist.imageUrl}"/>
    <p>${artist.description}</p>
    <button>Delete</button>
    `;

    const $button = $li.querySelector("button");
    $button.addEventListener("click", async () => {
      await getArtists();
      renderArtists();
    });
    return $li;
  });

  const $ul = document.querySelector("ul");
  $ul.replaceChildren(...$artists);
}

// === Script ===
/** Syncs state with the API and rerender */
async function init() {
  await getArtists();
  renderArtists();
}

init();

// TODO: Add artist with form data when the form is submitted
const $form = document.querySelector("form");
$form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const artist = {
    name: $form.title.value,
    imageUrl: $form.imageUrl.value,
    description: $form.instructions.value,
  };

  await addArtist(artist);
  await getArtists();
  renderArtists();
});
