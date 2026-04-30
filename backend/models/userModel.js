const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["ADMIN", "COMPANY", "BRANCH", "SUPERVISOR", "EMPLOYEE"],
      required: true,
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
