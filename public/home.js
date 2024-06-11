console.log(`hello world`);

const pkgsName = [
  "Caribbean New Year",
  "Polynesian Paradise",
  "Asian Expedition",
  "European Vacation",
];
const pkgsStartDate = ["2017-12-25", "2016-12-12", "2016-05-14", "2016-11-01"];
const pkgsEndDate = ["2017-01-04", "2016-12-20", "2016-05-28", "2016-11-14"];
const pkgsDescription = [
  "Cruise the Caribbean & Celebrate the New Year.",
  "8 Day All Inclusive Hawaiian Vacation",
  "Airfaire, Hotel and Eco Tour.",
  "Euro Tour with Rail Pass and Travel Insurance",
];
const pkgsBasePrice = [4800.0, 3000.0, 2800.0, 3000.0];
const pkgsAgencyCommission = [400.0, 310.0, 300.0, 280.0];
function displayPackages() {
  let table = document.getElementById("tb");
  let n = pkgsName.length;
  let s = 350 * n;
  //s.toString();
  table.style.width = s + "px";
  let acRow = table.insertRow(0);
  let bpRow = table.insertRow(0);
  let desRow = table.insertRow(0);
  let edRow = table.insertRow(0);
  let sdRow = table.insertRow(0);
  let nameRow = table.insertRow(0);
  let thID = '<th id="thid">';
  let tdID = '<td id="tdid">';
  for (i = 0; i < 4; i++) {
    name = pkgsName[i];
    startDate = pkgsStartDate[i];
    endDate = pkgsEndDate[i];
    description = pkgsDescription[i];
    basePrice = pkgsBasePrice[i];
    basePrice.toString();
    agencyCommission = pkgsAgencyCommission[i];
    agencyCommission.toString();

    nameRow.insertCell(0).outerHTML = thID + name + "</th>";
    sdRow.insertCell(0).outerHTML = tdID + startDate + "</td>";
    edRow.insertCell(0).outerHTML = tdID + endDate + "</td>";
    desRow.insertCell(0).outerHTML = tdID + description + "</td>";
    bpRow.insertCell(0).outerHTML = tdID + "$" + basePrice + "</td>";
    acRow.insertCell(0).outerHTML = tdID + "$" + agencyCommission + "</td>";
  }
  nameRow.insertCell(0).outerHTML = thID + "Package</th>";
  sdRow.insertCell(0).outerHTML = tdID + "Start Date</td>";
  edRow.insertCell(0).outerHTML = tdID + "End Date</td>";
  desRow.insertCell(0).outerHTML = tdID + "Description</td>";
  bpRow.insertCell(0).outerHTML = tdID + "Price</td>";
  acRow.insertCell(0).outerHTML = tdID + "Agent Commission</td>";
}

displayPackages();
