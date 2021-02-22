module.exports = (fn) => {
  const catchFn = (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
  return catchFn;
};
