document.addEventListener('DOMContentLoaded', () => {
    const weatherTable = document.getElementById('weatherTable').querySelector('tbody');
  
      // Function to create and append a table row for editing
  function createEditableRow(entry) {
    const row = document.createElement('tr');
    // Create id cell
    const idCell = document.createElement('td');
    const idInput = document.createElement('input');
    idInput.value = entry.id;
    idCell.appendChild(idInput);


    // Create name cell
    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.value = entry.name;
    nameCell.appendChild(nameInput);

    // Create temperature cell
    const tempCell = document.createElement('td');
    const tempInput = document.createElement('input');
    tempInput.value = entry.temperature;
    tempCell.appendChild(tempInput);

    // Create datetime cell
    const datetimeCell = document.createElement('td');
    const datetimeInput = document.createElement('input');
    datetimeInput.value = entry.datetime;
    datetimeCell.appendChild(datetimeInput);

    //Add row to table
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(tempCell);
    row.appendChild(datetimeCell);

    return row;
  }

  fetch('http://localhost:3000/weatherData')
    .then(response => response.json())
    .then(data => {
      data.forEach(entry => {
        // Create a row with editable cells
        const editableRow = createEditableRow(entry);

        // Append the editable row to the table
        weatherTable.appendChild(editableRow);
      });
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
});

  // script.js
document.addEventListener('DOMContentLoaded', () => {
  const weatherForm = document.getElementById('weatherForm');
  const weatherDataDiv = document.getElementById('weatherData');
  const sendToApiButton = document.getElementById('sendToApi');

  let weatherData = null; // Store the retrieved weather data here

  weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=ca6af8906199bb7638bf0d0baeb8028b`);
      weatherData = await response.json();
      const temperature = weatherData.list[0].main.temp;
      const name = weatherData.city.name;
      const datetime = weatherData.list[0].dt_txt;
      weatherDataDiv.innerHTML = `Temperature in ${name}: ${temperature}°C, Date: ${datetime}`;
    } catch (error) {
      weatherDataDiv.innerHTML = 'An error occurred while fetching weather data';
    }
  });

  sendToApiButton.addEventListener('click', async () => {
    if (weatherData) {
      const city = weatherData.city.name;
      const temperature = weatherData.list[0].main.temp;
      const datetime = weatherData.list[0].dt_txt;

      const dataToSend = {
        temperature: temperature,
        datetime: datetime,
        name: city
      };
      try {
        const response = await fetch('http://localhost:3000/save-weather-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
        
        const responseData = await response.json();
        console.log('API Response:', responseData);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    } else {
      console.log('No weather data available to send.');
    }
  });
});

weatherTable.addEventListener('input', (event) => {
  const editedCell = event.target; // The edited cell (input element)
  const editedRow = editedCell.closest('tr'); // The edited row
  const editedData = {
    id: editedRow.querySelector('td:nth-child(1) input').value, // Assuming you have a data attribute for the row ID
    name: editedRow.querySelector('td:nth-child(2) input').value,
    temperature: editedRow.querySelector('td:nth-child(3) input').value,
    datetime: editedRow.querySelector('td:nth-child(4) input').value,
  };

  // Send the edited data to the server
  fetch('http://localhost:3000/update-weather-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedData),
  })
    .then(response => {
      if (response.status === 200) {
        console.log('Data updated successfully');
      } else {
        console.error('Error updating weather data:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error updating weather data:', error);
    });
});

