const express = require("express");
const mainRoute = express.Router();

mainRoute.use("/country", require("./country.route.cjs"));
mainRoute.use("/language", require("./language.route.cjs"));
mainRoute.use("/category", require("./category.route.cjs"));
mainRoute.use("/subcategory", require("./subcategory.route.cjs"));
mainRoute.use("/dropdown", require("./dropdown.route.cjs"));
mainRoute.use("/doctor", require("./doctor.route.cjs"));
mainRoute.use("/hospital", require("./hospital.route.cjs"));
mainRoute.use("/booking", require("../routes/bookings.cjs"));
mainRoute.use("/seo", require("../routes/seo.cjs"));

// mainRoute.use("/dashboard-doctor", require("./hospital.route.cjs"));


module.exports = mainRoute;
