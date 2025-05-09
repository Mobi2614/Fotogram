const express = require("express");
const authRoute = require("./auth.route");
const users = require("./user.route");
const videos = require("./video.route");
const uploader = require("./uploader.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: users,
  },
  {
    path: "/upload",
    route: uploader,
  },
  {
    path: "/videos",
    route: videos,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
