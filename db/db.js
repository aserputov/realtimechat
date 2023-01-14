const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  chats: [{ type: String, unique: true }],
  createdAt: { type: Date, default: Date.now },
});

mongoose.connect("PROCESS.ENV.MONGODB_URI", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
