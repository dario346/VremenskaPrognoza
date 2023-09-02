document.addEventListener('DOMContentLoaded', () => {
    const weatherTable = document.getElementById('weatherTable');
    const weatherTableBody = document.getElementById('weatherTableBody');
    const sortByIdButton = document.getElementById('sortByIdButton');
  
      // Function to create and append a table row for editing
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

  function sortTableById() {
    const rows = Array.from(weatherTableBody.querySelectorAll('tr'));
    console.log('Sorting table by ID');

    rows.sort((a, b) => {
    
      const idA = parseInt(a.querySelector('td:first-child').textContent);
      const idB = parseInt(b.querySelector('td:first-child').textContent);
      console.log('ID A:', idA, 'ID B:', idB);
      return idA - idB;
    });

    // Remove all rows from the table
    rows.forEach(row => {
      weatherTableBody.removeChild(row);
    });

    // Append sorted rows back to the table
    rows.forEach(row => {
      weatherTableBody.appendChild(row);
    });
  }

  sortByIdButton.addEventListener('click', () => {
    console.log('Button clicked'); 
    sortTableById(); // Call the sortTableById function
  });



  fetch('http://localhost:3000/weatherData')
    .then(response => response.json())
    .then(data => {
      data.forEach(entry => {
        // Create a row with editable cells
        const tableRow = createTableRow(entry);

        // Append the editable row to the table
        weatherTable.appendChild(tableRow);
      });
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
});