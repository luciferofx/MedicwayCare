const CountryModel = require('../model/country.model.cjs');
const LanguageModel = require('../model/language.model.cjs');
const { tryCatchFn } = require('../Utils/tryCatch.utils');
const responseHandler = require('../Utils/responseHandler.utils');
const CategoryModel = require('../model/category.model.cjs');
const SubCategoryModel = require('../model/subcategory.model.cjs');

const slugify = require("slugify");

async function addSlugToOldCountries() {
  const countries = await CountryModel.find({
    slug: { $exists: false },
    is_deleted: false,
  });

  for (const country of countries) {
    let baseSlug = slugify(country.country_name, { lower: true, strict: true, trim: true });
    let slug = baseSlug;
    let count = 1;

    while (await CountryModel.exists({ slug, is_deleted: false, _id: { $ne: country._id } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    country.slug = slug;
    await country.save();
  }

  console.log(" Old data slug migration completed");
}

// run script
// addSlugToOldCountries()
//   .then(() => process.exit(0))
//   .catch(err => {
//     console.error(err);
//     process.exit(1);
//   });


class dropdownController {

  country = tryCatchFn(async (req, res) => {
    const countries = await CountryModel.find({
      is_deleted: false, is_active: true,
    }, {
      country_name: 1, _id: 1
    }).sort({ country_name: 1 });

    // Transform to match frontend expectations
    const transformedCountries = countries.map(country => ({
      _id: country._id,
      name: country.country_name,
      country_name: country.country_name
    }));

    return responseHandler.successResponse(
      res, 200, "Countries fetched successfully",
      transformedCountries);
  })

  language = tryCatchFn(async (req, res) => {
    const languages = await LanguageModel.find({
      is_deleted: false, is_active: true,
    }, {
      language_name: 1, _id: 1, code: 1
    }).sort({ language_name: 1 });

    // Transform to match frontend expectations
    const transformedLanguages = languages.map(language => ({
      _id: language._id,
      name: language.language_name,
      language_name: language.language_name,
      code: language.code
    }));

    return responseHandler.successResponse(
      res,
      200, "Languages fetched successfully",
      transformedLanguages);
  })

  category = tryCatchFn(async (req, res) => {
    const categories = await CategoryModel.find({
      is_deleted: false, is_active: true,
    }, {
      category_name: 1, _id: 1
    }).sort({ category_name: 1 });

    // Transform to match frontend expectations
    const transformedCategories = categories.map(category => ({
      _id: category._id,
      name: category.category_name,
      category_name: category.category_name
    }));

    return responseHandler.successResponse(
      res,
      200,
      "Categories fetched successfully",
      transformedCategories);
  })

  subcategory = tryCatchFn(async (req, res) => {
    const subcategories = await SubCategoryModel.find({
      is_deleted: false, is_active: true,
    }, {
      subcategory_name: 1, _id: 1, categoryId: 1
    }).sort({ subcategory_name: 1 });

    // Transform to match frontend expectations
    const transformedSubcategories = subcategories.map(sub => ({
      _id: sub._id,
      name: sub.subcategory_name,
      subcategory_name: sub.subcategory_name,
      categoryId: sub.categoryId
    }));

    return responseHandler.successResponse(
      res,
      200,
      "Subcategories fetched successfully",
      transformedSubcategories);
  })

  countryCategory = tryCatchFn(async (req, res) => {

    const countries = await CountryModel.find({ is_active: true, is_deleted: false },
      { _id: 1, country_name: 1, slug: 1 }
    )
    const categories = await CategoryModel.find({ is_active: true, is_deleted: false },
      { _id: 1, category_name: 1, slug: 1 }
    )

    const result = countries.map(country => ({
      countryId: country._id,
      countryName: country.country_name,
      slugName: country.slug,
      categories: categories.map(cat => ({
        categoryId: cat._id,
        categoryName: cat.category_name,
        slugName: cat.slug
      }))
    }));



    return responseHandler.successResponse(
      res,
      200,
      "Categories Cuntry fetched successfully",
      {
        result
      }
    );
  })




}


module.exports = new dropdownController();