//author: Erin Bough

fetch("api/home", { method: "GET" })
  .then((res) => res.json())
  .then((data) => displayPackages(data));

//takes package information from pre-defined arrays and displays it in a table
function displayPackages(data) {
  function dateParse(date) {
    y = parseInt(date.slice(0, 4));
    m = parseInt(date.slice(5, 7));
    d = parseInt(date.slice(8));
    return y * 366 + m * 32 + d;
  }
  let table = document.getElementById("tb");
  let n = data.length;
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
    packageName = data[i].PkgName;
    startDate = data[i].PkgStartDate;
    dateLen = 10;
    startDate = startDate.slice(0, dateLen);
    sdi = dateParse(startDate);
    endDate = data[i].PkgEndDate;
    endDate = endDate.slice(0, dateLen);
    edi = dateParse(endDate);
    description = data[i].PkgDesc;
    basePrice = data[i].PkgBasePrice;
    agencyCommission = data[i].PkgAgencyCommission;
    if (sdi >= edi) {
      continue;
    }

    //create a cell, set the outerHTML of the cell to a table element with an ID and with information
    //insert the cell in the 0th place of its respective row (the last element added will appear first)
    nameRow.insertCell(0).outerHTML = tableHeaderID + packageName + "</th>";
    startDateRow.insertCell(0).outerHTML =
      tableDocumentID + startDate + "</td>";
    endDateRow.insertCell(0).outerHTML = tableDocumentID + endDate + "</td>";
    descriptionRow.insertCell(0).outerHTML =
      tableDocumentID + description + "</td>";
    basePriceRow.insertCell(0).outerHTML =
      tableDocumentID + "$" + basePrice + "</td>";
    agentCommissionRow.insertCell(0).outerHTML =
      tableDocumentID + "$" + agencyCommission + "</td>";
  }
  //finally, add the legend/header of each row in the very first (leftmost) cell
  nameRow.insertCell(0).outerHTML = tableHeaderID + "Package</th>";
  startDateRow.insertCell(0).outerHTML = tableDocumentID + "Start Date</td>";
  endDateRow.insertCell(0).outerHTML = tableDocumentID + "End Date</td>";
  descriptionRow.insertCell(0).outerHTML = tableDocumentID + "Description</td>";
  basePriceRow.insertCell(0).outerHTML = tableDocumentID + "Price</td>";
  agentCommissionRow.insertCell(0).outerHTML =
    tableDocumentID + "Agent Commission</td>";
}
