    // Author: Mackenzie Whitney
    const request1 = fetch('api/contactAgencies').then(response => response.json());
    const request2 = fetch('api/contactAgents').then(response => response.json());
    Promise.all([request1, request2])
    .then(([agencyData, agentData]) => {
        populateLocationsTable(agencyData, agentData);
    }).catch(error => {
    console.error(error);
  });
  function populateLocationsTable(agencyData, agentData) {
    let locations = [];
    agencyData.forEach((agency)=>{
        addressString = `${agency.AgncyAddress}, ${agency.AgncyCity}, ${agency.AgncyProv}, ${agency.AgncyPostal}`;
        agentsFilteredInAgency = agentData.filter(agent => agent.AgencyId === agency.AgencyId);
        agentsInAgency = [];
        agentsFilteredInAgency.forEach(agent => agentsInAgency.push({
          name: `${agent.AgtFirstName} ${agent.AgtLastName}`,
          phone: agent.AgtBusPhone
        }))
        locations.push({
          agency: agency.AgncyCity,
          address: addressString,
          googleMapLink: agency.AgncyMapLink,
          phone: agency.AgncyPhone,
          agents: agentsInAgency
        })
    });
    const locationsTable = document.getElementById("locationsTable");
    locations.forEach((location) => {
      const row = document.createElement("tr");
      const agencyCell = document.createElement("td");
      const agencyCellContent = document.createTextNode(location.agency);
      agencyCell.appendChild(agencyCellContent);
      const addressCell = document.createElement("td");
      const addressCellContent = document.createTextNode(location.address);
      addressCell.appendChild(addressCellContent);
      const phoneCell = document.createElement("td");
      const phoneCellContent = document.createTextNode(location.phone);
      phoneCell.appendChild(phoneCellContent);
      row.appendChild(agencyCell);
      row.appendChild(addressCell);
      row.appendChild(phoneCell);
      locationsTable.appendChild(row);
      const agentHeaderRow = document.createElement("th");
      const agentHeaderCell = document.createElement("td");
      const agentHeaderContent = document.createTextNode("Agents");
      agentHeaderRow.colSpan = 2;
      agentHeaderRow.align = "right";
      agentHeaderCell.appendChild(agentHeaderContent);
      agentHeaderRow.appendChild(agentHeaderCell);
      locationsTable.appendChild(agentHeaderRow);
      const locationsMap = document.getElementById("locationsMap");
      addressCell.addEventListener("mouseover", () => {
        locationsMap.setAttribute("src", location.googleMapLink);
      });
      addressCell.addEventListener("click", () => {
        const googleMapWindow = window.open(
          location.googleMapLink,
          "",
          "popup=yes"
        );
      });
      location.agents.forEach((agent) => {
        const row = document.createElement("tr");
        const agentNameCell = document.createElement("td");
        agentNameCell.colSpan = 2;
        agentNameCell.align = "right";
        const agentNameCellContent = document.createTextNode(agent.name);
        agentNameCell.appendChild(agentNameCellContent);
        const agentPhoneCell = document.createElement("td");
        const agentPhoneCellContent = document.createTextNode(agent.phone);
        agentPhoneCell.appendChild(agentPhoneCellContent);
        row.appendChild(agentNameCell);
        row.appendChild(agentPhoneCell);
        locationsTable.appendChild(row);
      });
    });
  }