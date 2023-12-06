function wrapAsync(fn) {
  return function (req, rex, next) {
    fn(req, res, next).catch(next);
  };
}

module.exports = wrapAsync;
