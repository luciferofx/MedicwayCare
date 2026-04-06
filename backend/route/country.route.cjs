const express = require("express");
const router = express.Router();
const CountryController = require("../controller/country.controller.cjs");

router.post("/add", CountryController.addCountry);
router.get("/list", CountryController.getCountries);
router.get("/:id", CountryController.getCountryById);
router.put("/:id", CountryController.updateCountry);
router.delete("/:id", CountryController.deleteCountry);

module.exports = router;