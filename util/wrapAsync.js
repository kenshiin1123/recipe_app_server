export default function (func) {
  return function (req, res, next) {
    func(req, res, next).catch((e) => next(e));
  };
}
