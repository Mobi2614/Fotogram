const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const idMapper = {
  consumer: "userId",
  creator: "userId",
};
const verifyCallback =
  (req, resolve, reject, roles) => async (err, user, info) => {
    console.log(roles, roles.includes("public"));

    if ((err || info || !user) && !roles.includes("public")) {
      console.log(
        "THE ERROR OCCUR ERR:::::::::: " +
          err +
          "  THE INFO IS::::::::::::: " +
          info +
          "  THE USER IS::::::::" +
          user
      );
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }
    req.user = user;
    if (roles.length && !roles.includes("public")) {
      id = idMapper[user.role];
      if (!roles.includes(user.role)) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, "UnAuthorized"));
      } else if (req.params[id] && req.params[id] !== user.id)
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
    }

    resolve();
  };

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
