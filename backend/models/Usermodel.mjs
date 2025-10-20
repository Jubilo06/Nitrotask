import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  // You mentioned username, so we'll add it. Email is still best for uniqueness.
  // firstName: { type: String, required: true },
  // lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please fill a valid email address"],
    required: true,
    unique: true,
  }, // For login
  password: { type: String, required: true },
});

// This part automatically scrambles the password before saving a new user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log("--- Inside comparePassword Method ---");
    console.log("Plaintext password from form:", candidatePassword);
    console.log("Hashed password from database:", this.password);

    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    console.log("Bcrypt comparison result:", isMatch); // This is the crucial log!

    return isMatch;
  } catch (error) {
    console.error("Error during bcrypt comparison:", error);
    return false;
  }
};

export default mongoose.model("User", userSchema);
