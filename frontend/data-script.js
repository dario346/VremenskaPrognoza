document.addEventListener('DOMContentLoaded', () => {
    const weatherTable = document.getElementById('weatherTable');
    const weatherTableBody = document.getElementById('weatherTableBody');
    const sortByIdButton = document.getElementById('sortByIdButton');
    const sortByTemperatureButton = document.getElementById('sortByTemperatureButton');
    const sortByDatetimeButton = document.getElementById('sortByDatetimeButton');

      
  function createTableRow(entry) {
    const row = document.createElement('tr');
    // Create id cell
    const idCell = document.createElement('td');
    idCell.textContent = entry.id;
    row.appendChild(idCell);

    // Create name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = entry.name;
    row.appendChild(nameCell);

    // Create temperature cell
    const tempCell = document.createElement('td');
    tempCell.textContent = entry.temperature;
    row.appendChild(tempCell);

    // Create datetime cell
    const datetimeCell = document.createElement('td');
    datetimeCell.textContent = entry.datetime;
    row.appendChild(datetimeCell);

    //Add row to table

    return row;
  }

  fetch('http://localhost:3000/weatherData')
    .then(response => response.json())
    .then(data => {
      data.forEach(entry => {
        // Create a row with editable cells
        const tableRow = createTableRow(entry);

        // Append the editable row to the table
        weatherTableBody.appendChild(tableRow);
      });
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
  });

    // Function to sort the table by temperature in ascending order
      let isAscendingTemp = true;
      function sortTableByTemperature() {
        const rows = [...weatherTableBody.querySelectorAll('tr')];
        rows.sort((rowA, rowB) => {
            const tempA = parseFloat(rowA.querySelector('td:nth-child(3)').textContent);
            const tempB = parseFloat(rowB.querySelector('td:nth-child(3)').textContent);
            return isAscendingTemp ? tempA - tempB : tempB - tempA;
        });
        
        // Clear the existing table rows
        weatherTableBody.innerHTML = '';
        
        // Append the sorted rows back to the table
        rows.forEach(row => {
          weatherTableBody.appendChild(row);
        });

        isAscendingTemp =!isAscendingTemp;
      }
      // Add an event listener to the "Sort by Temperature" button
      sortByTemperatureButton.addEventListener('click', () => {
          console.log('Button clicked');
          sortTableByTemperature(); // Call the sortTableByTemperature function
      });
      let isAscendingDate = true;
      function sortTableByDatetime() {
        const rows = [...weatherTableBody.querySelectorAll('tr')];
        rows.sort((rowA, rowB) => {
            const datetimeA = rowA.querySelector('td:nth-child(4)').textContent;
            const datetimeB = rowB.querySelector('td:nth-child(4)').textContent;

            return isAscendingDate ? datetimeA.localeCompare(datetimeB) : datetimeB.localeCompare(datetimeA);
        });
        
        // Clear the existing table rows
        weatherTableBody.innerHTML = '';
        
        // Append the sorted rows back to the table
        rows.forEach(row => {
            weatherTableBody.appendChild(row);
        });

        isAscendingDate = !isAscendingDate;
      }

    // Add an event listener to the "Sort by Date and Time" button
    sortByDatetimeButton.addEventListener('click', () => {
        console.log('Button clicked');
        sortTableByDatetime(); // Call the sortTableByDatetime function
    });


});