//author: Erin Bough

const date = new Date();
fetch("/api/home", { method: "GET" })
  .then((res) => res.json())
  .then((data) => displayPackages(data));

//takes package information from pre-defined arrays and displays it in a table
function displayPackages(data) {
  function isLaterThan(subject, comparison) {
    //for the values of year,month,day compare the subject and comparison values in that order.
    //if subject is later than comparison, return true.
    //if subject is earlier than comparison, return false.
    //if they are equal, compare the next value.
    //if all values are equal, return false.

    for (let i = 0; i < 3; i++) {
      if (subject[i] > comparison[i]) return true;
      if (subject[i] < comparison[i]) return false;
    }
    return false;
  }
  //takes a string of the format "yyyy-mm-dd" and directly slices out and parses the date values
  function dateParse(date) {
    y = parseInt(date.slice(0, 4));
    m = parseInt(date.slice(5, 7));
    d = parseInt(date.slice(8));
    return [y, m, d];
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
  for (let i = 0; i < n; i++) {
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
    //if the start date is later than the end date, skip the rest of the loop and go to the next iteration
    if (isLaterThan(sdi, edi)) {
      continue;
    }
    curYear = date.getFullYear();
    curMonth = date.getMonth() + 1; //getMonth() returns an int from 0-11, therefore +1 must be added
    curDay = date.getDay();
    curDate = [curYear, curMonth, curDay];
    console.log(curDate, sdi);
    //if the current date is later than the start date, make the text red
    if (isLaterThan(curDate, sdi)) {
      tableDocumentID = '<td id="tdidRed">';
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
