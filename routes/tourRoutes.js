const express = require('express');
const fs = require('fs');
const router = express.Router();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const reqTour = tours.find((tour) => tour.id === +req.params.id);

  if (!reqTour) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour available for the given Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: reqTour,
    },
  });
};

const addTour = (req, res) => {
  // console.log(req.body)

  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  console.log(newTour);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const modifyTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour available for the given Id',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Updated Tour',
    id: req.params.id,
  });
};

router.route('/').get(getTours).post(addTour);

router.route('/:id').get(getTour).patch(modifyTour);

module.exports = router;
