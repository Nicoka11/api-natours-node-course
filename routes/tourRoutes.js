const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours);

router.route('/').get(tourController.getTours).post(tourController.addTour);

router.route('/monthly-plan/:year').get(tourController.getMonthlyplan);

router.route('/stats').get(tourController.getToursStats);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.modifyTour)
  .delete(tourController.deleteTour);

module.exports = router;
