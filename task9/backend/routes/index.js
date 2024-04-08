var express = require('express');
var router = express.Router();
const {cities} = require('../cities/cities');
const axios = require('axios');

router.get("/:cityName", async (req, res) => {
  let latitude;
  let longitude;
  cities.forEach(element => {
    if (element['name'] == req.params.cityName) {
      latitude = element['latitude'].toFixed(4);
      longitude = element['longitude'].toFixed(4);
    }
  });

  axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum,snowfall_sum,windspeed_10m_max&forecast_days=8&timezone=auto`)
  .then(response => {
    console.log(response.data);
    res.status(200).send({ data: response.data });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
});

module.exports = router;
