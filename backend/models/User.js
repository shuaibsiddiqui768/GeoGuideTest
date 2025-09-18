const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: [true, "Email must be unique"], // creates a unique index
      lowercase: true, // ensures stored lowercased
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"], // basic email syntax check
      set: (v) => (typeof v === "string" ? v.trim().toLowerCase() : v), // normalize on set
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6 characters"],
      // do not make select: false if comparePassword expects it present on find();
      // for stricter security, consider select: false and explicitly select('+password') when needed.
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: false, // keeping createdAt from above; set true if you want updatedAt auto
    toJSON: {
      transform(doc, ret) {
        delete ret.password; // hide password in API responses
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash the password if modified/new
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
