const express = require("express");
const router = express.Router();
const DoctorController = require("../controller/doctor.controller.cjs");

const { upload } = require("../Utils/cloudinaryUpload");

router.post("/add", 
  DoctorController.addDoctor
);
router.get("/get-all", DoctorController.getAllDoctorList);
router.get("/get-by-slug/:slug", DoctorController.getDoctorBySlug);
router.get("/list", DoctorController.getAllDoctors);
router.get("/:id", DoctorController.getDoctorById);


router.put(
  "/update/:id",
  DoctorController.updateDoctor
);

router.delete("/delete/:id", DoctorController.deleteDoctor);




module.exports = router;