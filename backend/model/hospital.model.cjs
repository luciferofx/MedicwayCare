const mongoose = require("mongoose");
const slugify = require("slugify");

const { Schema } = mongoose;

const hospitalSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    country: {
      type: String,
      default: "India",
    },
    city: {
      type: String,
      default: "Unknown",
    },
    specialties: {
      type: [String],
      default: ["General Medicine"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    image: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    blurb: {
      type: String,
      default: "",
    },
    beds: {
      type: Number,
      default: 0,
    },
    accreditation: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      type: Schema.Types.Mixed,
      default: {}
    },
    hospitalType: {
      type: String,
      trim: true
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "Country"
    },
    categoryIds: [{
      type: Schema.Types.ObjectId,
      ref: "Category"
    }],
    numberOfBeds: {
      type: Number,
      default: 0
    },
    hospitalIntro: {
      type: String,
      default: ""
    },
    infrastructure: {
      type: Schema.Types.Mixed,
      default: ""
    },
    facilities: {
      type: Schema.Types.Mixed,
      default: ""
    },
    youtubeVideos: {
      type: Schema.Types.Mixed,
      default: {}
    },
    teamAndSpeciality: {
      type: Schema.Types.Mixed,
      default: ""
    },
    photo: {
      type: String,
      default: ""
    },
    gallery: [{
      type: String
    }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: "EN",
    },
  },
  {
    timestamps: true,
  }
);

hospitalSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});

const HospitalModel = mongoose.models.Hospital || mongoose.model("Hospital", hospitalSchema, "hospitals");
module.exports = HospitalModel;
