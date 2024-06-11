const trips = document.querySelector(`.trips-container`);

const renderTrips = function (data) {
  console.log(data);
  data.forEach((trip) => {
    trips.insertAdjacentHTML(
      "afterbegin",
      `
            <h1></h1>
            <p></p>
            <p></p>
            <p></p>
            `
    );
  });
};

fetch("/api/profile", { method: "GET" })
  .then((res) => res.json())
  .then((data) => renderTrips(data));
