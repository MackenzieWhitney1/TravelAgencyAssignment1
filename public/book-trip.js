const tripSelector = document.getElementById("tripSelector");
const tripTypes = document.getElementById("tripTypes");
const request1 = fetch('/api/book-trip-packages').then(response => response.json());
const request2 = fetch('/api/book-trip-types').then(response => response.json());
Promise.all([request1, request2])
.then(([packageData, tripTypeData]) => {
  populateFormDropdowns(packageData, tripTypeData);
}).catch(error => {
  console.error(error);
});

function populateFormDropdowns(packageData, tripTypeData){
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
    })
}

function submitTripValidation(){
    
}