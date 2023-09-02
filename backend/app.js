const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const API_KEY = 'ca6af8906199bb7638bf0d0baeb8028b';
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Projekt_db',
  password: 'postgres',
  port: 5432,
});

app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(cors({
  allowedHeaders: ['Content-Type'], // Add other headers if needed
}));

app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=ca6af8906199bb7638bf0d0baeb8028b`);
    const weatherData = response.data;

    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;

    res.json({
      temperature: temperature,
      description: description
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching weather data' });
  }
});

app.post('/save-weather-data', (req, res) => {
  const { temperature, datetime, name } = req.body;

  const insertQuery = `INSERT INTO weather_data (temperature, datetime, name) VALUES ($1, $2, $3)`;

  pool.query(insertQuery, [temperature, datetime, name], (error, results) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ message: 'An error occurred while inserting data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully', redirect:'/' });
    }
  });
});

app.get('/weatherData', async (req, res) => {
    console.log('Received request for weather data');
    try {
      const selectQuery = 'SELECT * FROM weather_data';
      const result = await pool.query(selectQuery);
  
      // Convert and format datetime values
      const formattedData = result.rows.map(entry => ({
        id: entry.id,
        name: entry.name,
        temperature: entry.temperature,
        datetime: new Date(entry.datetime).toLocaleString(),
      }));
  
      res.json(formattedData);
    } catch (error) {
      console.error('Error fetching data from database:', error);
      res.sendStatus(500);
    }
  });

const port = 3000;// Port for your Express API
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.post('/update-weather-data', (req, res) => {
  const { id, name, temperature, datetime } = req.body;
  console.log('Received Data:', { id, name, temperature, datetime });

  const updateQuery = `UPDATE weather_data SET name = $1, temperature = $2, datetime = $3 WHERE id = $4`;

  pool.query(updateQuery, [name, temperature, datetime, id], (error, results) => {
    if (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ message: 'An error occurred while updating data' });
    } else {
      console.log('Data updated successfully');
      res.status(200).json({ message: 'Data updated successfully' });
    }
  });
});