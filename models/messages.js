const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  content: {
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, required: true },
});

MessageSchema.virtual("created_at_formatted").get(function () {
  return this.created_at.toLocaleTimeString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

module.exports = mongoose.model("Message", MessageSchema);
