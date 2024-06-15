// GAVIN
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
  const uniqueObjects = new Map(
    data.trips.map((item) => [item.BookingId, item])
  );
  const uniques = [...uniqueObjects.values()];
  name.textContent = `Hello ${data.name}`;
  // FILTERS CANCELLED TRIPS
  const cancelledTrips = data.trips.filter((trip) =>
    trip.Description.toLowerCase().includes("cancel")
  );

  // FILTERS ALL RELATED CANCELLED TRIPS
  let cancelFiltered =
    cancelledTrips[0] === undefined ? unique : cancelledTrips[0] === undefined;
  cancelFiltered = uniques.filter((trip) => {
    const val = cancelledTrips.some((canTrip) => {
      return (
        canTrip.TripStart !== trip.TripStart && canTrip.TripEnd !== trip.TripEnd
      );
    });
    return val;
  });

  // REMOVE ALL TRIPS WITH SAME START DATE AND END DATE INTO ONE TRIP AND ADDS IT'S BOOKING ID TO SINGLE TRIP
  const data1 = cancelFiltered.reduce((acc, cur) => {
    const lastIndex = acc.length - 1;
    if (
      lastIndex >= 0 &&
      acc[lastIndex].TripStart !== cur.TripStart &&
      acc[lastIndex].TripEnd !== cur.TripEnd
    ) {
      acc.push(cur);
    } else if (
      lastIndex >= 0 &&
      acc[lastIndex].TripStart === cur.TripStart &&
      acc[lastIndex].TripEnd === cur.TripEnd
    ) {
      acc[lastIndex].BookingId += `, ${cur.BookingId}`;
    } else if (lastIndex === -1) {
      acc.push(cur);
    }
    return acc;
  }, []);

  // RENDERS TRIPS
  data1.forEach((trip) => {
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
