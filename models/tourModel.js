const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, 'Please mention the duration of the tour'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Please mention a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Please mention a difficulty'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    ratingsAverage: Number,
    ratingsQuantity: Number,
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function () {
  console.log(`💚${this}💚`);
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
