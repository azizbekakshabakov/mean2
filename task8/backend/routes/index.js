var express = require('express');
var router = express.Router();
const {Task, validate} = require('../schemas/task');
const authMiddleware = require('../middleware/auth');
const {cities} = require('../cities/cities');
const axios = require('axios');

router.post("/", authMiddleware, async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) res.status(400).send({ message: error.details[0].message });

  const task = await Task(req.body).save();
  res.status(201).send({ data: task, message: "Задача создана" });
});

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
    // console.log(response.data);
    res.status(200).send({ data: response.data });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
});

router.get("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id });
  res.status(200).send({ data: task });
});

router.put("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).send({ data: task, message: "Обновлена задача" });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Задача удалена" });
});

module.exports = router;
