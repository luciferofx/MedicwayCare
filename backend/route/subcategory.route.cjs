const express = require("express");
const router = express.Router();
const SubCategoryController = require("../controller/subcategory.controller.cjs");
const { upload } = require("../Utils/cloudinaryUpload");

router.post(
  "/add",
  upload.single("image"),
  SubCategoryController.addSubCategory
);

router.get("/list", SubCategoryController.getAllSubcategory);

router.put(
  "/:id",
  upload.single("image"),
  SubCategoryController.updateSubcategory
);

router.delete("/:id", SubCategoryController.deleteSubcategory);

module.exports = router;