import { useEffect, useMemo, useState } from "react";
import api from "./api";
import "./App.css";

// Movie posters. If the backend later provides posterUrl, it is used first.
const MOVIE_POSTERS = {
  "Avengers": "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
  "Interstellar": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "Inception": "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  "The Dark Knight": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "Spider-Man": "https://i.ebayimg.com/00/s/MTYwMFgxMTEw/z/D-oAAOSwZIJkP-89/%24_57.JPG",
  "Avatar": "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
  "RRR": "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
  "KGF": "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/9214f774284099.5c2a29444db19.png",
  "Pushpa": "https://media.senscritique.com/media/000020619334/0/pushpa_the_rise_part_1.png"
};

const getMoviePoster = (movie) =>
  movie?.posterUrl || MOVIE_POSTERS[movie?.title] || "";

function App() {
  // =========================
  // AUTH
  // =========================
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // USER
  // =========================
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }

    return null;
  });

  // =========================
  // MOVIES
  // =========================
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // =========================
  // DATE
  // =========================
  const [selectedDate, setSelectedDate] = useState("");

  // =========================
  // SHOW / THEATRE
  // =========================
  const [shows, setShows] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);

  // =========================
  // SEATS
  // =========================
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatCount, setSeatCount] = useState(1);

  // =========================
  // PAYMENT
  // =========================
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // =========================
  // BOOKINGS
  // =========================
  const [bookings, setBookings] = useState([]);
  const [lastBooking, setLastBooking] = useState(null);

  // =========================
  // PAGE
  // =========================
  const [page, setPage] = useState("movies");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // AUTH CONFIG
  // =========================
  const auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    if (token) {
      loadUser();
      loadMovies();
    }
  }, [token]);

  // =========================
  // USER
  // =========================
  const loadUser = () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);

        if (parsed?.id) {
          setUser(parsed);
          return;
        }
      } catch (error) {
        console.error("Invalid user:", error);
      }
    }

    /*
     * Current CinePass test account
     * Siva = user ID 2
     */
    const siva = {
      id: 2,
      name: "Siva",
      email: "siva@gmail.com",
    };

    localStorage.setItem("user", JSON.stringify(siva));
    setUser(siva);
  };

  // =========================
  // LOAD MOVIES
  // =========================
  const loadMovies = async () => {
    try {
      setMessage("");

      const response = await api.get("/api/movies", auth);

      setMovies(response.data || []);
    } catch (error) {
      console.error("MOVIES ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load movies."
      );
    }
  };

  // =========================
  // REGISTER
  // =========================
  const register = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      setMessage(
        "Registration successful. Please login."
      );

      setIsRegister(false);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Registration failed."
      );
    }

    setLoading(false);
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      const jwt = response.data.token;

      localStorage.setItem("token", jwt);

      /*
       * Current test account:
       * Siva = userId 2
       */
      const loggedInUser = {
        id: 2,
        name:
          email.toLowerCase() === "siva@gmail.com"
            ? "Siva"
            : "User",
        email: email,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);
      setToken(jwt);

      setPage("movies");

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Login failed."
      );
    }

    setLoading(false);
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    setMovies([]);

    resetBookingFlow();

    setBookings([]);
    setLastBooking(null);
    setPage("movies");
  };

  // =========================
  // RESET BOOKING FLOW
  // =========================
  const resetBookingFlow = () => {
    setSelectedMovie(null);
    setSelectedDate("");
    setShows([]);
    setSelectedTheatre(null);
    setSelectedShow(null);
    setSeats([]);
    setSelectedSeats([]);
    setSeatCount(1);
    setPaymentMethod("UPI");
    setMessage("");
  };

  // =========================
  // MOVIE SELECT
  // =========================
  const selectMovie = (movie) => {
    setSelectedMovie(movie);

    setSelectedDate("");
    setShows([]);

    setSelectedTheatre(null);
    setSelectedShow(null);

    setSeats([]);
    setSelectedSeats([]);

    setSeatCount(1);

    setMessage("");

    setPage("dates");
  };

  // =========================
  // GET NEXT 7 DAYS
  // =========================
  const getDates = () => {
    const result = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();

      date.setDate(date.getDate() + i);

      /*
       * Use local date instead of UTC
       * to avoid date shifting.
       */
      const year = date.getFullYear();

      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      const dayNumber = String(
        date.getDate()
      ).padStart(2, "0");

      const iso =
        `${year}-${month}-${dayNumber}`;

      result.push({
        value: iso,

        day: date.toLocaleDateString(
          "en-IN",
          {
            weekday: "short",
          }
        ),

        date: date.getDate(),

        month: date.toLocaleDateString(
          "en-IN",
          {
            month: "short",
          }
        ),
      });
    }

    return result;
  };

  // =========================
  // DATE SELECT
  // =========================
  const selectDate = async (date) => {
    if (!selectedMovie) {
      return;
    }

    setSelectedDate(date);

    setShows([]);

    setSelectedTheatre(null);
    setSelectedShow(null);

    setSeats([]);
    setSelectedSeats([]);

    setSeatCount(1);

    setMessage("");

    try {
      setLoading(true);

      const response = await api.get(
        `/api/shows?movieId=${selectedMovie.id}&date=${date}`,
        auth
      );

      const loadedShows = response.data || [];

      setShows(loadedShows);

      /*
       * If theatres exist, select the first theatre
       * automatically. User can still change it.
       */
      if (loadedShows.length > 0) {
        const firstTheatre =
          loadedShows[0]?.screen?.theatre;

        if (firstTheatre) {
          setSelectedTheatre(firstTheatre.id);
        }
      }
    } catch (error) {
      console.error("SHOWS ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load shows."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORMAT TIME
  // =========================
  const formatTime = (time) => {
    if (!time) {
      return "";
    }

    const parts = time.split(":");

    const hour = Number(parts[0]);
    const minute = parts[1];

    const suffix =
      hour >= 12 ? "PM" : "AM";

    const displayHour =
      hour % 12 || 12;

    return `${displayHour}:${minute} ${suffix}`;
  };

  // =========================
  // GET UNIQUE THEATRES
  // =========================
  const theatres = useMemo(() => {
    const map = new Map();

    shows.forEach((show) => {
      const theatre =
        show.screen?.theatre;

      if (theatre?.id) {
        map.set(
          theatre.id,
          theatre
        );
      }
    });

    return Array.from(map.values());
  }, [shows]);

  // =========================
  // SHOWS FOR SELECTED THEATRE
  // =========================
  const theatreShows = useMemo(() => {
    if (!selectedTheatre) {
      return [];
    }

    return shows.filter(
      (show) =>
        Number(
          show.screen?.theatre?.id
        ) === Number(selectedTheatre)
    );
  }, [shows, selectedTheatre]);

  // =========================
  // THEATRE SELECT
  // =========================
  const selectTheatre = (theatreId) => {
    setSelectedTheatre(theatreId);

    setSelectedShow(null);

    setSeats([]);
    setSelectedSeats([]);

    setSeatCount(1);

    setMessage("");
  };

  // =========================
  // SHOW SELECT
  // =========================
  const selectShow = async (show) => {
    setSelectedShow(show);

    setSelectedSeats([]);

    setSeats([]);

    setSeatCount(1);

    setMessage("");

    try {
      setLoading(true);

      /*
       * VERY IMPORTANT:
       * Load seats BEFORE moving to seats page.
       */
      const response = await api.get(
        `/api/shows/${show.id}/seats`,
        auth
      );

      const loadedSeats =
        response.data || [];

      setSeats(loadedSeats);

      /*
       * Only NOW go to seat page.
       */
      setPage("seats");
    } catch (error) {
      console.error("SEATS ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load seats."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // NUMBER OF SEATS CHANGE
  // =========================
  const changeSeatCount = (count) => {
    const value = Number(count);

    setSeatCount(value);

    /*
     * If user reduces number of seats,
     * keep only the required number.
     */
    setSelectedSeats((current) =>
      current.slice(0, value)
    );

    setMessage("");
  };

  // =========================
  // TOGGLE SEAT
  // =========================
  const toggleSeat = (seat) => {
    if (
      seat.status?.toUpperCase() ===
      "BOOKED"
    ) {
      return;
    }

    const seatNumber =
      String(seat.seatNumber);

    const alreadySelected =
      selectedSeats.includes(seatNumber);

    if (alreadySelected) {
      setSelectedSeats(
        selectedSeats.filter(
          (s) => s !== seatNumber
        )
      );

      return;
    }

    /*
     * Don't allow more seats than
     * the number selected by user.
     */
    if (
      selectedSeats.length >= seatCount
    ) {
      setMessage(
        `You selected ${seatCount} seat${
          seatCount > 1 ? "s" : ""
        }. Deselect a seat before choosing another.`
      );

      return;
    }

    setSelectedSeats([
      ...selectedSeats,
      seatNumber,
    ]);

    setMessage("");
  };

  // =========================
  // TOTAL
  // =========================
  const totalAmount =
    selectedSeats.length *
    Number(
      selectedShow?.price || 0
    );

  // =========================
  // BOOK TICKETS
  // =========================
  const bookTickets = async () => {
    if (!user?.id) {
      setMessage(
        "User information unavailable."
      );

      return;
    }

    if (!selectedMovie) {
      setMessage(
        "Movie information unavailable."
      );

      return;
    }

    if (!selectedDate) {
      setMessage(
        "Please select a date."
      );

      return;
    }

    if (!selectedTheatre) {
      setMessage(
        "Please select a theatre."
      );

      return;
    }

    if (!selectedShow) {
      setMessage(
        "Please select a show time."
      );

      return;
    }

    if (
      selectedSeats.length !== seatCount
    ) {
      setMessage(
        `Please select exactly ${seatCount} seat${
          seatCount > 1 ? "s" : ""
        }.`
      );

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const bookingData = {
        userId: user.id,

        movieId:
          selectedMovie.id,

        showId:
          selectedShow.id,

        seatNumbers:
          selectedSeats,

        paymentMethod:
          paymentMethod,
      };

      console.log(
        "BOOKING REQUEST:",
        bookingData
      );

      const response =
        await api.post(
          "/api/bookings",
          bookingData,
          auth
        );

      console.log(
        "BOOKING RESPONSE:",
        response.data
      );

      setLastBooking(
        response.data
      );

      setSelectedSeats([]);

      /*
       * Booking succeeded.
       * Show confirmation/receipt page.
       */
      setPage("confirmation");
    } catch (error) {
      console.error(
        "BOOKING ERROR:",
        error
      );

      if (
        error.response?.status === 409
      ) {
        setMessage(
          error.response?.data?.message ||
            "One or more seats are already booked."
        );
      } else {
        setMessage(
          error.response?.data?.message ||
            error.response?.data ||
            "Booking failed."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DOWNLOAD RECEIPT
  // =========================
  const downloadReceipt = () => {
    if (!lastBooking) {
      alert(
        "Booking information is unavailable."
      );

      return;
    }

    const movieName =
      selectedMovie?.title ||
      `Movie #${lastBooking.movieId}`;

    const theatreName =
      selectedShow?.screen?.theatre?.name ||
      "CinePass Theatre";

    const theatreAddress =
      selectedShow?.screen?.theatre?.address ||
      "";

    const theatreCity =
      selectedShow?.screen?.theatre?.city ||
      "";

    const screenName =
      selectedShow?.screen?.name ||
      "";

    const showTime =
      selectedShow
        ? formatTime(
            selectedShow.startTime
          )
        : "";

    const seatsText =
      lastBooking.seatNumbers ||
      selectedSeats.join(", ");

    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<title>CinePass Receipt #${
      lastBooking.id
    }</title>

<style>

body {
  font-family: Arial, sans-serif;
  background: #f3f4f6;
  padding: 30px;
}

.receipt {
  max-width: 650px;
  margin: auto;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.header {
  text-align: center;
  border-bottom: 2px dashed #ddd;
  padding-bottom: 20px;
}

.logo {
  font-size: 28px;
  font-weight: bold;
}

.success {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}

h2 {
  margin-top: 25px;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.label {
  color: #666;
}

.value {
  font-weight: bold;
}

.total {
  font-size: 24px;
  font-weight: bold;
  text-align: right;
  margin-top: 25px;
}

.footer {
  text-align: center;
  margin-top: 30px;
  color: #777;
}

</style>

</head>

<body>

<div class="receipt">

  <div class="header">

    <div class="logo">
      🎬 CinePass
    </div>

    <div>
      Movie Ticket Receipt
    </div>

    <div class="success">
      ✓ PAYMENT SUCCESSFUL
    </div>

  </div>

  <h2>${movieName}</h2>

  <div class="row">
    <span class="label">
      Booking ID
    </span>

    <span class="value">
      #${lastBooking.id}
    </span>
  </div>

  <div class="row">
    <span class="label">
      Payment ID
    </span>

    <span class="value">
      #${
        lastBooking.paymentId ||
        "-"
      }
    </span>
  </div>

  <div class="row">
    <span class="label">
      Customer
    </span>

    <span class="value">
      ${user?.name || "Siva"}
    </span>
  </div>

  <div class="row">
    <span class="label">
      Theatre
    </span>

    <span class="value">
      ${theatreName}
    </span>
  </div>

  <div class="row">
    <span class="label">
      Address
    </span>

    <span class="value">
      ${theatreAddress}
      ${theatreCity}
    </span>
  </div>

  <div class="row">
    <span class="label">
      Screen
    </span>

    <span class="value">
      ${screenName}
    </span>
  </div>

  <div class="row">
    <span class="label">
      Date
    </span>

    <span class="value">
      ${selectedDate}
    </span>
  </div>

  <div class="row">
    <span class="label">
      Show Time
    </span>

    <span class="value">
      ${showTime}
    </span>
  </div>

  <div class="row">
    <span class="label">
      Seats
    </span>

    <span class="value">
      ${seatsText}
    </span>
  </div>

  <div class="row">
    <span class="label">
      Number of Seats
    </span>

    <span class="value">
      ${lastBooking.seats}
    </span>
  </div>

  <div class="row">
    <span class="label">
      Payment Method
    </span>

    <span class="value">
      ${paymentMethod}
    </span>
  </div>

  <div class="total">
    Total: ₹${lastBooking.totalAmount}
  </div>

  <div class="footer">
    Thank you for booking with CinePass.
    <br />
    Enjoy your movie!
  </div>

</div>

</body>
</html>
`;

    const blob = new Blob(
      [receiptHTML],
      {
        type: "text/html",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `CinePass-Receipt-${lastBooking.id}.html`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================
  // PRINT / SAVE PDF
  // =========================
  const printReceipt = () => {
    window.print();
  };

  // =========================
  // LOAD BOOKINGS
  // =========================
  const loadBookings = async () => {
    if (!user?.id) {
      setMessage(
        "User information unavailable."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await api.get(
          "/api/bookings",
          auth
        );

      const allBookings =
        response.data || [];

      const myBookings =
        allBookings.filter(
          (booking) =>
            Number(
              booking.userId
            ) ===
            Number(user.id)
        );

      setBookings(myBookings);

      setPage("bookings");
    } catch (error) {
      console.error(
        "BOOKINGS ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CANCEL BOOKING
  // =========================
  const cancelBooking = async (id) => {
    try {
      setLoading(true);

      await api.put(
        `/api/bookings/${id}/cancel`,
        null,
        auth
      );

      await loadBookings();
    } catch (error) {
      console.error(
        "CANCEL ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // AUTH PAGE
  // =========================
  if (!token) {
    return (
      <div className="auth-page">

        <div className="auth-card">

          <div className="logo">
            🎬 CinePass
          </div>

          <h1>
            {isRegister
              ? "Create your account"
              : "Welcome back"}
          </h1>

          <p className="auth-subtitle">
            {isRegister
              ? "Book movies, choose your seats and enjoy."
              : "Sign in to continue booking movies."}
          </p>

          <form
            onSubmit={
              isRegister
                ? register
                : login
            }
          >

            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />

            <button
              className="red-btn"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isRegister
                ? "Create Account"
                : "Login"}
            </button>

          </form>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <div className="switch">

            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              onClick={() => {
                setIsRegister(
                  !isRegister
                );

                setMessage("");
              }}
            >
              {isRegister
                ? "Login"
                : "Register"}
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =========================
  // NAVBAR
  // =========================
  const Navbar = () => (
    <header className="navbar">

      <div
        className="navbar-logo"
        onClick={() =>
          setPage("movies")
        }
      >
        🎬 CinePass
      </div>

      <nav>

        <button
          onClick={() =>
            setPage("movies")
          }
        >
          Movies
        </button>

        <button
          onClick={loadBookings}
        >
          My Bookings
        </button>

        <span className="welcome">
          Hi, {user?.name || "Siva"}
        </span>

        <button
          className="logout"
          onClick={logout}
        >
          Logout
        </button>

      </nav>

    </header>
  );

  // =========================
  // MOVIES PAGE
  // =========================
  const MoviesPage = () => (
    <div>

      <section className="hero">

        <div className="hero-content">

          <span>
            YOUR MOVIE EXPERIENCE
          </span>

          <h1>
            Movies made for
            <br />
            unforgettable moments.
          </h1>

          <p>
            Discover movies, select your
            theatre, choose your seats and
            book instantly.
          </p>

        </div>

      </section>

      <section className="content">

        <div className="page-heading">

          <div>

            <h2>
              Now Showing
            </h2>

            <p>
              Choose a movie to book
            </p>

          </div>

          <span className="location">
            📍 Vijayawada
          </span>

        </div>

        {movies.length === 0 ? (
          <div className="empty">
            No movies available.
          </div>
        ) : (
          <div className="movie-grid">

            {movies.map((movie) => (

              <div
                className="movie-card"
                key={movie.id}
              >

                <div className="poster">
                  {getMoviePoster(movie) ? (
                    <img
                      src={getMoviePoster(movie)}
                      alt={`${movie.title} poster`}
                      className="movie-poster-image"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}

                  <div
                    className="poster-placeholder"
                    style={{
                      display: getMoviePoster(movie) ? "none" : "flex"
                    }}
                  >
                    🎬
                  </div>
                </div>

                <div className="movie-body">

                  <h3>
                    {movie.title}
                  </h3>

                  <p>
                    {movie.description}
                  </p>

                  <div className="tags">

                    <span>
                      {movie.language}
                    </span>

                    <span>
                      {movie.genre}
                    </span>

                    <span>
                      {movie.duration} min
                    </span>

                  </div>

                  <button
                    className="red-btn"
                    onClick={() =>
                      selectMovie(movie)
                    }
                  >
                    Book Tickets
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );

  // =========================
  // DATE + THEATRE + SHOW PAGE
  // =========================
  const ShowsPage = () => {

    const dates = getDates();

    return (
      <section className="content booking-flow">

        <button
          className="back-link"
          onClick={() =>
            setPage("movies")
          }
        >
          ← Back to Movies
        </button>

        {/* MOVIE */}
        <div className="selected-movie-header">

          <div className="mini-poster">
            {selectedMovie && getMoviePoster(selectedMovie) ? (
              <img
                src={getMoviePoster(selectedMovie)}
                alt={`${selectedMovie.title} poster`}
                className="mini-poster-image"
              />
            ) : (
              <span>🎬</span>
            )}
          </div>

          <div>

            <h1>
              {selectedMovie?.title}
            </h1>

            <p>
              {selectedMovie?.language}
              {" • "}
              {selectedMovie?.genre}
              {" • "}
              {selectedMovie?.duration} min
            </p>

          </div>

        </div>

        {/* DATE */}
        <h2 className="flow-title">
          1. Select Date
        </h2>

        <div className="date-grid">

          {dates.map((date) => (

            <button
              key={date.value}
              className={
                selectedDate === date.value
                  ? "date-card active"
                  : "date-card"
              }
              onClick={() =>
                selectDate(
                  date.value
                )
              }
            >

              <span>
                {date.day}
              </span>

              <strong>
                {date.date}
              </strong>

              <small>
                {date.month}
              </small>

            </button>

          ))}

        </div>

        {/* SHOWS */}
        {selectedDate && (

          <div className="theatre-section">

            <h2 className="flow-title">
              2. Select Theatre
            </h2>

            {loading && (
              <div className="message">
                Loading theatres and shows...
              </div>
            )}

            {!loading &&
              shows.length === 0 && (
                <div className="empty">
                  No shows available for{" "}
                  {selectedDate}.
                </div>
              )}

            {shows.length > 0 && (

              <>

                {/* THEATRES */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(250px,1fr))",
                    gap: "15px",
                    marginBottom: "25px",
                  }}
                >

                  {theatres.map(
                    (theatre) => (

                      <button
                        key={theatre.id}
                        onClick={() =>
                          selectTheatre(
                            theatre.id
                          )
                        }
                        style={{
                          padding: "20px",
                          borderRadius:
                            "12px",
                          border:
                            selectedTheatre ===
                            theatre.id
                              ? "3px solid #ef0b17"
                              : "1px solid #ddd",
                          background:
                            selectedTheatre ===
                            theatre.id
                              ? "#fff1f1"
                              : "#fff",
                          textAlign:
                            "left",
                          cursor:
                            "pointer",
                        }}
                      >

                        <h3>
                          🎬 {theatre.name}
                        </h3>

                        <p>
                          📍{" "}
                          {theatre.address}
                        </p>

                        <p>
                          {theatre.city}
                        </p>

                      </button>

                    )
                  )}

                </div>

                {/* SHOW TIMES */}
                {selectedTheatre && (

                  <div>

                    <h2 className="flow-title">
                      3. Select Show Time
                    </h2>

                    <div
                      className="theatre-list"
                    >

                      {theatreShows.length ===
                      0 ? (
                        <div className="empty">
                          No shows available
                          at this theatre.
                        </div>
                      ) : (
                        theatreShows.map(
                          (show) => (

                            <div
                              className="theatre-card"
                              key={show.id}
                            >

                              <div className="theatre-info">

                                <h3>
                                  {
                                    show
                                      .screen
                                      ?.theatre
                                      ?.name
                                  }
                                </h3>

                                <p>
                                  🖥️{" "}
                                  {
                                    show
                                      .screen
                                      ?.name
                                  }
                                </p>

                                <p>
                                  🎟️{" "}
                                  {
                                    show
                                      .screen
                                      ?.totalSeats
                                  }{" "}
                                  seats
                                </p>

                              </div>

                              <div className="show-area">

                                <span className="price">
                                  ₹{show.price}
                                </span>

                                <button
                                  className="time-btn"
                                  disabled={
                                    loading
                                  }
                                  onClick={() =>
                                    selectShow(
                                      show
                                    )
                                  }
                                >
                                  {formatTime(
                                    show.startTime
                                  )}
                                </button>

                              </div>

                            </div>

                          )
                        )
                      )}

                    </div>

                  </div>

                )}

              </>

            )}

          </div>

        )}

      </section>
    );
  };

  // =========================
  // SEATS PAGE
  // =========================
  const SeatsPage = () => {

    if (!selectedShow) {
      return null;
    }

    return (
      <section className="content seat-page">

        <button
          className="back-link"
          onClick={() =>
            setPage("dates")
          }
        >
          ← Back to Shows
        </button>

        {/* HEADER */}
        <div className="seat-header">

          <div>

            <h1>
              {selectedMovie?.title}
            </h1>

            <p>

              {
                selectedShow
                  ?.screen
                  ?.theatre
                  ?.name
              }

              {" • "}

              {
                selectedShow
                  ?.screen
                  ?.name
              }

              {" • "}

              {formatTime(
                selectedShow.startTime
              )}

            </p>

          </div>

          <div className="seat-price">
            ₹{selectedShow.price}/seat
          </div>

        </div>

        {/* STEP 4 */}
        <h2
          className="flow-title"
          style={{
            marginTop: "20px",
          }}
        >
          4. Select Number of Seats
        </h2>

        <select
          value={seatCount}
          onChange={(e) =>
            changeSeatCount(
              e.target.value
            )
          }
          style={{
            padding: "12px 18px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "25px",
          }}
        >

          {[1, 2, 3, 4, 5, 6, 7, 8].map(
            (number) => (

              <option
                key={number}
                value={number}
              >
                {number} seat
                {number > 1
                  ? "s"
                  : ""}
              </option>

            )
          )}

        </select>

        {/* SCREEN */}
        <div className="screen-large">
          SCREEN
        </div>

        {/* LEGEND */}
        <div className="legend">

          <span>
            <i className="available"></i>
            Available
          </span>

          <span>
            <i className="selected"></i>
            Selected
          </span>

          <span>
            <i className="booked"></i>
            Booked
          </span>

        </div>

        {/* SEATS */}
        <div className="seat-grid-real">

          {seats
            .slice()
            .sort(
              (a, b) =>
                Number(a.seatNumber) -
                Number(b.seatNumber)
            )
            .map((seat) => {

              const seatNumber =
                String(
                  seat.seatNumber
                );

              const isSelected =
                selectedSeats.includes(
                  seatNumber
                );

              const isBooked =
                seat.status?.toUpperCase() ===
                "BOOKED";

              return (
                <button
                  key={seat.id}
                  disabled={isBooked}
                  className={
                    isBooked
                      ? "real-seat booked"
                      : isSelected
                      ? "real-seat selected"
                      : "real-seat"
                  }
                  onClick={() =>
                    toggleSeat(seat)
                  }
                >
                  {seat.seatNumber}
                </button>
              );
            })}

        </div>

        {/* PAYMENT */}
        <div
          className="checkout"
          style={{
            marginTop: "35px",
          }}
        >

          <div>

            <h2>
              5. Booking Summary
            </h2>

            <p>
              Required seats:{" "}
              <strong>
                {seatCount}
              </strong>
            </p>

            <p>
              Selected:{" "}
              <strong>
                {selectedSeats.length}
              </strong>
            </p>

            <p>
              Seats:{" "}
              {selectedSeats.length
                ? selectedSeats.join(", ")
                : "None"}
            </p>

          </div>

          <div className="checkout-right">

            <div className="payment">

              <label>
                6. Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              >

                <option value="UPI">
                  UPI
                </option>

                <option value="CARD">
                  Card
                </option>

                <option value="NET_BANKING">
                  Net Banking
                </option>

              </select>

            </div>

            <div className="total">
              ₹{totalAmount}
            </div>

            <button
              className="red-btn"
              disabled={
                loading ||
                selectedSeats.length !==
                  seatCount
              }
              onClick={bookTickets}
            >

              {loading
                ? "Processing..."
                : selectedSeats.length !==
                  seatCount
                ? `Select ${seatCount} Seat${
                    seatCount > 1
                      ? "s"
                      : ""
                  }`
                : `Pay ₹${totalAmount} & Confirm`}

            </button>

          </div>

        </div>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

      </section>
    );
  };

  // =========================
  // CONFIRMATION + RECEIPT
  // =========================
  const ConfirmationPage = () => (
    <section className="confirmation">

      <div className="success">
        ✓
      </div>

      <h1>
        Booking Confirmed!
      </h1>

      <p>
        Your tickets have been booked successfully.
      </p>

      <div
        className="ticket"
        id="receipt"
      >

        <div className="ticket-top">
          🎬 CinePass
        </div>

        <div className="ticket-content">

          <h2>
            {selectedMovie?.title}
          </h2>

          <p>
            {
              selectedShow
                ?.screen
                ?.theatre
                ?.name
            }
          </p>

          <p>
            {
              selectedShow
                ?.screen
                ?.theatre
                ?.address
            }
            {" "}
            {
              selectedShow
                ?.screen
                ?.theatre
                ?.city
            }
          </p>

          <p>
            {
              selectedShow
                ?.screen
                ?.name
            }
          </p>

          <div className="ticket-row">

            <span>
              Date
            </span>

            <strong>
              {selectedDate}
            </strong>

          </div>

          <div className="ticket-row">

            <span>
              Time
            </span>

            <strong>
              {selectedShow
                ? formatTime(
                    selectedShow.startTime
                  )
                : "-"}
            </strong>

          </div>

          <div className="ticket-row">

            <span>
              Seats
            </span>

            <strong>
              {lastBooking?.seatNumbers}
            </strong>

          </div>

          <div className="ticket-row">

            <span>
              Number of Seats
            </span>

            <strong>
              {lastBooking?.seats}
            </strong>

          </div>

          <div className="ticket-row">

            <span>
              Booking ID
            </span>

            <strong>
              #{lastBooking?.id}
            </strong>

          </div>

          <div className="ticket-row">

            <span>
              Payment ID
            </span>

            <strong>
              #{lastBooking?.paymentId}
            </strong>

          </div>

          <div className="ticket-row">

            <span>
              Payment Method
            </span>

            <strong>
              {paymentMethod}
            </strong>

          </div>

          <div className="ticket-row">

            <span>
              Total
            </span>

            <strong>
              ₹{lastBooking?.totalAmount}
            </strong>

          </div>

          <div className="confirmed">
            ✓ PAYMENT SUCCESSFUL
          </div>

        </div>

      </div>

      {/* RECEIPT BUTTONS */}
      <div
        className="confirmation-actions"
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >

        <button
          className="red-btn"
          onClick={
            downloadReceipt
          }
        >
          ⬇ Download Receipt
        </button>

        <button
          className="secondary-btn"
          onClick={
            printReceipt
          }
        >
          🖨️ Print / Save as PDF
        </button>

        <button
          className="secondary-btn"
          onClick={() =>
            setPage("movies")
          }
        >
          Browse Movies
        </button>

        <button
          className="secondary-btn"
          onClick={loadBookings}
        >
          My Bookings
        </button>

      </div>

    </section>
  );

  // =========================
  // BOOKINGS PAGE
  // =========================
  const BookingsPage = () => (
    <section className="content">

      <div className="page-heading">

        <div>

          <h1>
            My Bookings
          </h1>

          <p>
            Your movie tickets
          </p>

        </div>

        <button
          className="secondary-btn"
          onClick={() =>
            setPage("movies")
          }
        >
          Browse Movies
        </button>

      </div>

      {bookings.length === 0 ? (

        <div className="empty">

          🎟️

          <h2>
            No bookings yet
          </h2>

          <p>
            Your booked tickets will appear here.
          </p>

        </div>

      ) : (

        <div className="booking-list">

          {bookings.map(
            (booking) => (

              <div
                className="booking-item"
                key={booking.id}
              >

                <div className="booking-icon">
                  🎬
                </div>

                <div className="booking-details">

                  <h3>
                    Booking #{booking.id}
                  </h3>

                  <p>
                    Movie ID:{" "}
                    {booking.movieId}
                  </p>

                  <p>
                    Show ID:{" "}
                    {booking.showId}
                  </p>

                  <p>
                    Seats:{" "}
                    {booking.seatNumbers ||
                      booking.seats}
                  </p>

                  <p>
                    Amount: ₹
                    {booking.totalAmount}
                  </p>

                  <span
                    className={
                      booking.status ===
                      "CONFIRMED"
                        ? "status confirmed"
                        : "status cancelled"
                    }
                  >
                    {booking.status}
                  </span>

                </div>

                {booking.status ===
                  "CONFIRMED" && (

                  <button
                    className="cancel-btn"
                    onClick={() =>
                      cancelBooking(
                        booking.id
                      )
                    }
                  >
                    Cancel
                  </button>

                )}

              </div>

            )
          )}

        </div>

      )}

    </section>
  );

  // =========================
  // MAIN RENDER
  // =========================
  return (
    <div className="app">

      <Navbar />

      {page === "movies" && (
        <MoviesPage />
      )}

      {page === "dates" && (
        <ShowsPage />
      )}

      {page === "seats" && (
        <SeatsPage />
      )}

      {page === "confirmation" && (
        <ConfirmationPage />
      )}

      {page === "bookings" && (
        <BookingsPage />
      )}

    </div>
  );
}

export default App;