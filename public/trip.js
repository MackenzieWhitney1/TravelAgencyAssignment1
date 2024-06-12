// VARIABLES
const url = window.location.href.split("=");
const img = url[2];
const tripId = url[1].split("&")[0];
const body = document.querySelector(`body`);

// FUNCTIONS
const reformatDate = function (date) {
  return new Date(date).toDateString();
};

// REDNERS TRIP
const renderTrip = function (data) {
  const data1 = data[0];
  const tripStart = reformatDate(data1.TripStart);
  const tripEnd = reformatDate(data1.TripEnd);
  const bookingDate = reformatDate(data1.BookingDate);
  const creditCard = data1.CCNumber.slice(
    data1.CCNumber.length - 4,
    data1.CCNumber.length
  );
  const creditCardExpiry = reformatDate(data1.CCExpiry);
  const description = data1.Description.split(/[-\ \/]/);

  body.insertAdjacentHTML(
    `afterbegin`,
    `
    <nav>
      <a href="/sign-out">Sign Out</a>
      <a href="/profile">Profile</a>
    </nav>
    <article>
      <section class="img-container">
        <img src="/tripsImages/trip--1.jpg" alt="" />
          <aside>
            <h3>Enjoy</h3>
            <h1>${description[0]} - ${description[1]}</h1>
          </aside>
      </section>
      <section class="dates">
        <h1>Travel Dates</h1>
        <p><ion-icon name="airplane"></ion-icon>Departure: ${tripStart}</p>
        <p><ion-icon name="airplane"></ion-icon>Return: ${tripEnd}</p>
        <p><ion-icon name="calendar"></ion-icon>Booked on: ${bookingDate}</p>
        <p><ion-icon name="briefcase"></ion-icon>Class: ${data1.TTName}</p>
      </section>
      <section class="details">
        <h1>Details</h1>
        <div class="trip-supplies">
          <div class="trip-supply-container">
            <h1>Trip Supplies</h1>
            <div class="trip-supply">
              <p><ion-icon name="restaurant"></ion-icon>Commodity: ${
                data1.ProdName
              }</p>
            </div>
            <div class="supply-contact">
              <h1>Contact info</h1>
              <p><ion-icon name="reader"></ion-icon>Name: ${
                data1.SupConFirstName || "Unavailable"
              } ${data1.SupConLastName || ""}</p>
              <p><ion-icon name="business"></ion-icon>Company name: ${
                data1.SupConCompany || "Unavailable"
              }</p>
              <p><ion-icon name="mail"></ion-icon>Email: ${
                data1.SupConEmail || "Unavailable"
              }</p>
              <p><ion-icon name="call"></ion-icon>Phone number: ${
                data1.SupConBusPhone || "Unavailable"
              }</p>
            </div>
          </div>
        </div>
      </section>
      <section class="fees">
        <h1>Fees</h1>
        <div class="fee-container">
          <p><ion-icon name="cash"></ion-icon>Agency Commission: $${
            data1.AgencyCommission
          }</p>
          <p><ion-icon name="cash"></ion-icon>Base price: $${
            data1.BasePrice
          }</p>
        </div>
        <div class="card">
          <h1>Card details</h1>
          <p><ion-icon name="reader"></ion-icon>Name: ${data1.CustFirstName} ${
      data1.CustLastName
    }</p>
          <p><ion-icon name="card"></ion-icon>Card (Last 4): ${creditCard}</p>
          <p><ion-icon name="calendar"></ion-icon>Expires: ${creditCardExpiry}</p>
        </div>
      </section>
      <section class="contact">
        <h1>Contact</h1>
        <p>If you have any questions, please contact:</p>
        <div>
          <img src="" alt="" />
          <p><ion-icon name="reader"></ion-icon>Name: ${data1.AgtFirstName} ${
      data1.AgtLastName
    }</p>
          <p><ion-icon name="mail"></ion-icon>Email: ${data1.AgtEmail}</p>
          <p><ion-icon name="call"></ion-icon>Phone: ${data1.AgtBusPhone}</p>
          <p><ion-icon name="person"></ion-icon>Position: ${
            data1.AgtPosition
          }</p>
        </div>
      </section>
    </article>
    <button><a href="/profile">Back</a></button>    
    `
  );
};

// FETCHES TRIP DATA
fetch("/api/trip", {
  method: "POST",
  headers: { Accept: "application/json", "Content-type": "application/json" },
  body: JSON.stringify({ tripId }),
})
  .then((res) => res.json())
  .then((data) => renderTrip(data));
