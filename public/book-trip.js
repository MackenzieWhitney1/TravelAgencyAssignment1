// Author: Mackenzie Whitney
const tripSelector = document.getElementById("tripSelector");
const tripTypes = document.getElementById("tripTypes");
const regionSelector = document.getElementById("regionSelector");
const classSelector = document.getElementById("classSelector");

const request1 = fetch('/api/book-trip-packages').then(response => response.json());
const request2 = fetch('/api/book-trip-types').then(response => response.json());
const request3 = fetch('/api/book-trip-regions').then(response => response.json());
const request4 = fetch('/api/book-trip-classes').then(response => response.json());

Promise.all([request1, request2, request3, request4])
.then(([packageData, tripTypeData, regionData, travelClassData]) => {
  populateFormDropdowns(packageData, tripTypeData, regionData, travelClassData);
}).catch(error => {
  console.error(error);
});

function populateFormDropdowns(packageData, tripTypeData, regionData, travelClassData){
    packageData.forEach((package) => {
        var opt = document.createElement('option');
        opt.value = package.PackageId;
        opt.innerHTML = package.PkgName;
        tripSelector.appendChild(opt);
    })
    tripTypeData.forEach((tripType) => {
      var radioInput = document.createElement('input');
      radioInput.type = "radio";
      radioInput.value = tripType.TripTypeId;
      radioInput.name = "tripType"
      tripTypes.appendChild(radioInput);
      var label = document.createElement('label');
      label.textContent = tripType.TTName;
      tripTypes.appendChild(label);
      var firstRadioButton = document.getElementsByName("tripType")[0];
      firstRadioButton.checked = "checked";
   })
   regionData.forEach((region) => {
    var opt = document.createElement('option');
    opt.value = region.RegionId;
    opt.innerHTML = region.RegionName;
    regionSelector.appendChild(opt);
})
    travelClassData.forEach((travelClass) => {
      var opt = document.createElement('option');
      opt.value = travelClass.ClassId;
      opt.innerHTML = travelClass.ClassName;
      classSelector.appendChild(opt);
    })
}