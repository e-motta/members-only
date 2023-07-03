const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  hashed_password: { type: String, required: true },
  roles: [{ type: String, enum: ["admin", "member"] }],
  created_at: { type: Date, required: true },
});

UserSchema.virtual("full_name").get(function () {
  return this.first_name + " " + this.last_name;
});

module.exports = mongoose.model("User", UserSchema);
