const trips = document.querySelector(`.trips-container`);
const name = document.querySelector(`.name`);

const randomNum = function () {
  const num = Math.floor(Math.random() * 11 + 1);
  return num;
};

const renderTrips = function (data) {
  name.textContent = `Hello ${data.name}`;

  const tripsFiltered = data.trips.filter(
    (trip) => !trip.Description.toLowerCase().includes("cancel")
  );

  tripsFiltered.forEach((trip) => {
    const startDate = new Date(trip.TripStart).toDateString();
    const endDate = new Date(trip.TripEnd).toDateString();
    const num = randomNum();
    trips.insertAdjacentHTML(
      "afterbegin",
      `
            <div class="trip-card">
          <div class="img-container">
            <img src="/tripsImages/trip--${num}.jpg" alt="" />
          </div>
          <div class="content">
            <h1>${trip.Destination}</h1>
            <p>Trip Start: ${startDate}</p>
            <p>Trip End: ${endDate}</p>
            <button><a href="/profile/trip/tripId=${trip.BookingId}&img=${num}">View Trip</a></button>
          </div>
        </div>
            `
    );
  });
};

fetch("/api/profile", { method: "GET" })
  .then((res) => res.json())
  .then((data) => renderTrips(data));
