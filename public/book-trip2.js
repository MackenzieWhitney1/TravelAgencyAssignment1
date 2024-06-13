const tripSelector = document.getElementById("tripSelector");
const tripTypes = document.getElementById("tripTypes");
const regionSelector = document.getElementById("regionSelector");
const classSelector = document.getElementById("classSelector");
const productSelect = document.getElementById("productId");
const addSupply = document.querySelector(`.addSupply`);
const removeSupply = document.querySelector(`.removeSupply`);

const addOrRemoveSupply = function (value, data, e) {
  const supplies = document.querySelectorAll(`.supply`);
  e.preventDefault();
  if (supplies.length >= 1) {
    //  prettier-ignore
    if ( value === "remove" && document.querySelector(`.productId${supplies.length}`) !== null) {
      document.querySelector(`.productId${supplies.length}`).remove();
      document.querySelector(`.labelId${supplies.length}`).remove();
    } else if (value === "add") {

      // prettier-ignore
      document.querySelector(`${supplies.length === 1 ? ".productId" : ".productId" + supplies.length}`)
        .insertAdjacentHTML("afterend",`
          <label class=labelId${supplies.length + 1} for="productId${
            supplies.length + 1
          }">Supply ${supplies.length + 1}</label>
        <select class="supply productId${supplies.length + 1}" name="productId"><select>
        `);

      const el = document.querySelector(`.productId${supplies.length + 1}`);
      data.forEach((supply) =>
        insertOption(el, supply.ProdName, supply.ProductId)
      );
    }
  }
};

const insertOption = function (el, data, value) {
  el.insertAdjacentHTML(
    "afterbegin",
    `
    <option ${value ? "value=" + value : ""}>${data.trim()}</option>
    `
  );
};

const renderData = function (data) {
  console.log(data);
  // prettier-ignore
  data.packages.forEach((package) => insertOption(tripSelector, package.PkgName, package.PackageId));
  // prettier-ignore
  data.tripTypes.forEach((trip) => insertOption(tripTypes, trip.TTName, trip.TripTypeId));
  // prettier-ignore
  data.regions.forEach((region) => insertOption(regionSelector, region.RegionName, region.RegionId));
  // prettier-ignore
  data.classes.forEach((classType) => insertOption(classSelector, classType.ClassName, classType.ClassId));
  // prettier-ignore
  data.products.forEach((product) => insertOption(productSelect, product.ProdName, product.ProductId));
  removeSupply.addEventListener(`click`, (e) =>
    addOrRemoveSupply("remove", data, e)
  );

  addSupply.addEventListener(`click`, (e) =>
    addOrRemoveSupply("add", data.products, e)
  );
};

fetch("/api/book-trip2")
  .then((res) => res.json())
  .then((data) => renderData(data));
