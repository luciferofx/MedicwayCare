const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;


const LanguageSchema = new Schema(
  {
    language_name: { type: String, default: null },
    fullName: { type: String, default: null },
    shortCode: { type: String, default: null },
    code: { type: String },
    icon: { type: String },
    is_active: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LanguageSchema.index({ language_name: 1, is_deleted: 1 }, { unique: true });

const LanguageModel = mongoose.models.Language || mongoose.model("Language", LanguageSchema);

module.exports = LanguageModel;