const Tour = require('../models/tourModel.js');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = function (req, res, next) {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,summary,difficulty';
  next();
};

exports.getTours = catchAsync(async (req, res) => {
  //build Query

  // 1) Filtering
  // const queryObj = { ...req.query };
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // let queryString = JSON.stringify(queryObj);
  // queryString = queryString.replace(
  //   /\b(gte|gt|lte|lt)\b/g,
  //   (match) => `$${match}`
  // );
  // let query = Tour.find(JSON.parse(queryString));

  // 2) Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.replace(/,/g, ' ');
  //   query = query.sort(sortBy);
  // }
  // // else {
  // //   query = query.sort('-createdAt');
  // // }

  // 3) Fields Limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.replace(/,/g, ' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  // 4) Pagination
  // const page = +req.query.page || 1;
  // const limit = +req.query.limit || 30;
  // const skip = (page - 1) * limit;
  // console.log(`The skip is ${skip}`);

  // query = query.skip(skip).limit(limit);

  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) {
  //     throw new Error('This page does not exist');
  //   }
  // }
  // Execute Query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pages();
  const tours = await features.query;

  //Send Response
  await res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);

  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

exports.addTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'created',
    data: newTour,
  });
});

exports.modifyTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  console.log(tour);

  res.status(200).json({
    status: 'success',
    message: 'Updated Tour',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    deletedTour,
  });
});

exports.getToursStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: '$difficulty',
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    stats,
  });
});

exports.getMonthlyplan = catchAsync(async (req, res) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        months: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { months: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    plan,
  });
});
