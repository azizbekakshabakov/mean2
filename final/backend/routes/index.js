var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const {Car} = require('../schemas/car');
const { authModMiddleware } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/', authModMiddleware, upload.single('image'), async (req, res) => {
  try {
      const { name, description } = req.body;
      const image = req.file ? req.file.path : null;

      const newCar = new Car({
          name,
          description,
          image
      });

      await newCar.save();

      res.status(201).json({ message: 'Car entry created successfully', car: newCar });
  } catch (error) {
      res.status(404).json({ message: 'Error creating car entry', error });
  }
});

router.get("/", async (req, res) => {
  const cars = await Car.find();
  res.status(200).send({ data: cars });
});

router.get("/:id", async (req, res) => {
  const car = await Car.findOne({ _id: req.params.id });
  res.status(200).send({ data: car });
});

router.put("/:id", authModMiddleware, async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).send({ data: car, message: "Обновлен" });
});

router.delete("/:id", authModMiddleware, async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Задача удалена" });
});

module.exports = router;