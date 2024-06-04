//author: Erin Bough
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
//takes package information from pre-defined arrays and displays it in a table
function displayPackages() {
  let table = document.getElementById("tb");
  let n = pkgsName.length;//n represents the number of packages
  let s = 350 * n;
  //set the width of the table to 350 x n pixels, where n is the number of packages.
  //in other words, there are 350 pixels allocated for each package
  table.style.width = s + "px";
  //create rows, insert them into tables, save them as variables
  let agentCommissionRow = table.insertRow(0);
  let basePriceRow = table.insertRow(0);
  let descriptionRow = table.insertRow(0);
  let endDateRow = table.insertRow(0);
  let startDateRow = table.insertRow(0);
  let nameRow = table.insertRow(0);
  //create table elements with ids for easy manipulation with css
  let tableHeaderID = '<th id="thid">';
  let tableDocumentID = '<td id="tdid">';
  //for each package, add the data of that package to the table
  for (i = 0; i < n; i++) {
    //the hardcoded arrays are placed into variables, so that the hardcoded arrays can easily be replaced
    //by simply inserting a different input into the existing variables
    packageName = pkgsName[i];
    startDate = pkgsStartDate[i];
    endDate = pkgsEndDate[i];
    description = pkgsDescription[i];
    basePrice = pkgsBasePrice[i];
    basePrice.toString();
    agencyCommission = pkgsAgencyCommission[i];
    agencyCommission.toString();

    //create a cell, set the outerHTML of the cell to a table element with an ID and with information
    //insert the cell in the 0th place of its respective row (the last element added will appear first)
    nameRow.insertCell(0).outerHTML = tableHeaderID + packageName + "</th>";
    startDateRow.insertCell(0).outerHTML = tableDocumentID + startDate + "</td>";
    endDateRow.insertCell(0).outerHTML = tableDocumentID + endDate + "</td>";
    descriptionRow.insertCell(0).outerHTML = tableDocumentID + description + "</td>";
    basePriceRow.insertCell(0).outerHTML = tableDocumentID + "$" + basePrice + "</td>";
    agentCommissionRow.insertCell(0).outerHTML = tableDocumentID + "$" + agencyCommission + "</td>";
  }
  //finally, add the legend/header of each row in the very first (leftmost) cell
  nameRow.insertCell(0).outerHTML = tableHeaderID + "Package</th>";
  startDateRow.insertCell(0).outerHTML = tableDocumentID + "Start Date</td>";
  endDateRow.insertCell(0).outerHTML = tableDocumentID + "End Date</td>";
  descriptionRow.insertCell(0).outerHTML = tableDocumentID + "Description</td>";
  basePriceRow.insertCell(0).outerHTML = tableDocumentID + "Price</td>";
  agentCommissionRow.insertCell(0).outerHTML = tableDocumentID + "Agent Commission</td>";
}

displayPackages();
