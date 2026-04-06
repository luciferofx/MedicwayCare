const express = require("express");
const dropdownRoute = express.Router();
const dropdownController = require("../controller/dropdown.controller.cjs");

dropdownRoute.get("/country", dropdownController.country);
dropdownRoute.get("/language", dropdownController.language);
dropdownRoute.get("/category", dropdownController.category);
dropdownRoute.get("/subcategory", dropdownController.subcategory);
dropdownRoute.get('/counter-category', dropdownController.countryCategory)
module.exports = dropdownRoute;