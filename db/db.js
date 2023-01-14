const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  chats: [{ type: String, unique: true }],
  createdAt: { type: Date, default: Date.now },
});

mongoose.connect(
  "mongodb+srv://serputov:serputov@cluster0.ygg93tm.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
