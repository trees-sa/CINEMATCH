const movies = [
  {
    title: "Inception",
    year: 2010,
    genres: ["Sci-Fi", "Action", "Thriller"],
    mood: "intense",
    runtime: 148,
    rating: 8.8,
    note: "A dream-heist thriller with big ideas, clean momentum, and a final shot everyone argues about.",
  },
  {
    title: "Spirited Away",
    year: 2001,
    genres: ["Animation", "Drama"],
    mood: "comfort",
    runtime: 125,
    rating: 8.6,
    note: "A magical coming-of-age story filled with wonder, tenderness, and unforgettable images.",
  },
  {
    title: "Parasite",
    year: 2019,
    genres: ["Thriller", "Drama"],
    mood: "intense",
    runtime: 132,
    rating: 8.5,
    note: "A sharp social thriller that keeps changing shape while tightening the pressure.",
  },
  {
    title: "The Grand Budapest Hotel",
    year: 2014,
    genres: ["Comedy", "Drama"],
    mood: "fun",
    runtime: 99,
    rating: 8.1,
    note: "A stylish, fast-moving comedy with bright characters and clockwork timing.",
  },
  {
    title: "Before Sunrise",
    year: 1995,
    genres: ["Romance", "Drama"],
    mood: "romantic",
    runtime: 101,
    rating: 8.1,
    note: "A gentle walking-and-talking romance that feels intimate, curious, and real.",
  },
  {
    title: "Mad Max: Fury Road",
    year: 2015,
    genres: ["Action", "Thriller"],
    mood: "intense",
    runtime: 120,
    rating: 8.1,
    note: "A pure action rush with striking visuals and almost no wasted movement.",
  },
  {
    title: "La La Land",
    year: 2016,
    genres: ["Romance", "Drama"],
    mood: "romantic",
    runtime: 128,
    rating: 8.0,
    note: "A bright musical romance about love, ambition, timing, and the lives we imagine.",
  },
  {
    title: "Arrival",
    year: 2016,
    genres: ["Sci-Fi", "Drama"],
    mood: "thoughtful",
    runtime: 116,
    rating: 7.9,
    note: "Reflective science fiction about language, memory, grief, and human connection.",
  },
  {
    title: "Knives Out",
    year: 2019,
    genres: ["Comedy", "Thriller"],
    mood: "fun",
    runtime: 130,
    rating: 7.9,
    note: "A playful mystery with a clever structure, a lively cast, and satisfying reveals.",
  },
  {
    title: "Paddington 2",
    year: 2017,
    genres: ["Comedy", "Animation"],
    mood: "comfort",
    runtime: 103,
    rating: 7.8,
    note: "Kind, funny, beautifully built comfort viewing with a lot of heart.",
  },
  {
    title: "The Social Network",
    year: 2010,
    genres: ["Drama"],
    mood: "thoughtful",
    runtime: 120,
    rating: 7.8,
    note: "A crisp drama about ambition, invention, resentment, and the cost of winning.",
  },
  {
    title: "The Dark Knight",
    year: 2008,
    genres: ["Action", "Thriller", "Drama"],
    mood: "intense",
    runtime: 152,
    rating: 9.0,
    note: "A crime epic with superhero scale, moral pressure, and a legendary central conflict.",
  },
];

const mood = document.querySelector("#mood");
const genre = document.querySelector("#genre");
const runtime = document.querySelector("#runtime");
const rating = document.querySelector("#rating");
const ratingValue = document.querySelector("#ratingValue");
const resultCount = document.querySelector("#resultCount");
const featured = document.querySelector("#featured");
const movieGrid = document.querySelector("#movieGrid");
const surprise = document.querySelector("#surprise");
const watchlist = document.querySelector("#watchlist");
const clearWatchlist = document.querySelector("#clearWatchlist");

const WATCHLIST_KEY = "cinematch.watchlist";

function getWatchlist() {
  return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
}

function saveWatchlist(items) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
}

function getMatches() {
  const selectedMood = mood.value;
  const selectedGenre = genre.value;
  const maxRuntime = Number(runtime.value);
  const minRating = Number(rating.value);

  return movies
    .filter((movie) => selectedMood === "any" || movie.mood === selectedMood)
    .filter((movie) => selectedGenre === "any" || movie.genres.includes(selectedGenre))
    .filter((movie) => movie.runtime <= maxRuntime)
    .filter((movie) => movie.rating >= minRating)
    .sort((a, b) => b.rating - a.rating || a.runtime - b.runtime);
}

function metaFor(movie) {
  return [`${movie.year}`, `${movie.runtime} min`, `${movie.rating.toFixed(1)} / 10`];
}

function renderFeatured(movie) {
  if (!movie) {
    featured.innerHTML = "";
    return;
  }

  featured.innerHTML = `
    <article class="featured-card">
      <div class="poster" aria-hidden="true">${movie.title.slice(0, 1)}</div>
      <div class="featured-body">
        <span class="pill">Top match</span>
        <h2>${movie.title}</h2>
        <div class="meta">${metaFor(movie).map((item) => `<span>${item}</span>`).join("")}</div>
        <div class="tags">${movie.genres.map((item) => `<span>${item}</span>`).join("")}</div>
        <p>${movie.note}</p>
      </div>
    </article>
  `;
}

function renderMovies() {
  const matches = getMatches();
  const saved = getWatchlist();

  ratingValue.textContent = `${Number(rating.value).toFixed(1)}+`;
  resultCount.textContent = `${matches.length} ${matches.length === 1 ? "movie" : "movies"}`;

  if (!matches.length) {
    renderFeatured(null);
    movieGrid.innerHTML = `
      <div class="empty danger">
        No movies matched those filters. Try lowering the rating or changing the mood.
      </div>
    `;
    return;
  }

  renderFeatured(matches[0]);
  movieGrid.innerHTML = matches
    .slice(1)
    .map((movie) => {
      const isSaved = saved.includes(movie.title);

      return `
        <article class="movie-card">
          <div>
            <div class="card-top">
              <h3>${movie.title}</h3>
              <span class="rating">${movie.rating.toFixed(1)}</span>
            </div>
            <div class="meta">${metaFor(movie).map((item) => `<span>${item}</span>`).join("")}</div>
            <div class="tags">${movie.genres.map((item) => `<span>${item}</span>`).join("")}</div>
            <p>${movie.note}</p>
          </div>
          <button class="save-btn ${isSaved ? "saved" : ""}" type="button" data-title="${movie.title}">
            ${isSaved ? "Saved" : "Add to watchlist"}
          </button>
        </article>
      `;
    })
    .join("");
}

function renderWatchlist() {
  const saved = getWatchlist();

  if (!saved.length) {
    watchlist.innerHTML = `<div class="empty">Your saved movies will appear here.</div>`;
    return;
  }

  watchlist.innerHTML = saved
    .map((title) => {
      const movie = movies.find((item) => item.title === title);
      return `
        <div class="watch-item">
          <div>
            <strong>${title}</strong>
            <span>${movie ? `${movie.year} · ${movie.rating.toFixed(1)} rating` : "Saved movie"}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function update() {
  renderMovies();
  renderWatchlist();
}

function toggleSaved(title) {
  const saved = getWatchlist();
  const next = saved.includes(title)
    ? saved.filter((item) => item !== title)
    : [...saved, title];

  saveWatchlist(next);
  update();
}

function randomize() {
  const moodOptions = [...mood.options].map((option) => option.value);
  const genreOptions = [...genre.options].map((option) => option.value);
  const runtimeOptions = [...runtime.options].map((option) => option.value);

  mood.value = moodOptions[Math.floor(Math.random() * moodOptions.length)];
  genre.value = genreOptions[Math.floor(Math.random() * genreOptions.length)];
  runtime.value = runtimeOptions[Math.floor(Math.random() * runtimeOptions.length)];
  rating.value = (6 + Math.random() * 2.4).toFixed(1);
  update();
}

[mood, genre, runtime, rating].forEach((control) => {
  control.addEventListener("input", update);
});

movieGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-title]");

  if (button) {
    toggleSaved(button.dataset.title);
  }
});

surprise.addEventListener("click", randomize);
clearWatchlist.addEventListener("click", () => {
  saveWatchlist([]);
  update();
});

update();
