// VARIABLES
const trips = document.querySelector(`.trips-container`);
const name = document.querySelector(`.name`);

const randomNum = function () {
  const num = Math.floor(Math.random() * 11 + 1);
  return num;
};

// IF MORE THAN ONE TRIP HAS THE SAME TRAVEL DATES, THEN ADD THE BOOKING ID TO THE FIRST TRIP
// IF A TRIP IS CANCELLED, THEN REMOVE ALL TRIPS WITH SAME TRAVEL DATES

// RENDERS TRIPS IN PROFILE PAGES
const renderTrips = function (data) {
  name.textContent = `Hello ${data.name}`;
  // FILTERS CANCELLED TRIPS
  const cancelledTrips = data.trips.filter((trip) =>
    trip.Description.toLowerCase().includes("cancel")
  );

  // FILTERS ALL RELATED CANCELLED TRIPS
  const tripsFiltered =
    cancelledTrips[0] === undefined
      ? data.trips
      : data.trips.filter((trip) => {
          for (let i = 0; i < cancelledTrips.length; i++) {
            if (
              trip !== cancelledTrips[i] &&
              trip.TripStart !== cancelledTrips[i].TripStart &&
              trip.TripEnd !== cancelledTrips[i].TripEnd
            ) {
              return trip;
            }
          }
        });

  const data1 = tripsFiltered.reduce((acc, cur, i) => {
    const lastIndex = acc.length - 1;
    if (acc[lastIndex] !== undefined) {
      if (acc[lastIndex].TripStart !== cur.TripStart) {
        acc.push(cur);
        return acc;
      } else if (acc[lastIndex].TripStart === cur.TripStart) {
        acc[lastIndex].BookingId += `, ${cur.BookingId}`;
        return acc;
      }
    } else if (i === 0) {
      acc.push(cur);
      return acc;
    }
  }, []);

  data1.forEach((trip) => {
    const startDate = new Date(trip.TripStart).toDateString();
    const endDate = new Date(trip.TripEnd).toDateString();
    const num = randomNum();
    console.log(trip);
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
