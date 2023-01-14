const express = require("express");
const router = express.Router();
const User = require("../db/db");
const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });

router.get("/", async (req, res) => {
  async function getUser(name) {
    const foundUser = await User.findOne({ username: name });
    return foundUser.chats;
  }

  function getChats() {
    return "i4";
  }

  const user1 = await getUser(req.query.user1);
  const user2 = await getUser(req.query.user2);

  console.log(user1);
  console.log(user2);

  function getIntersection() {
    return user1.filter((element) => user2.includes(element));
  }

  console.log(getIntersection());

  let chat;

  if (getIntersection().length === 0) {
    chat = getChats();
    console.log(chat);

    // updateUser(req.query.user1, chat);
    // updateUser(req.query.user2, chat);
  } else {
    console.log("Not empty");
    chat = getIntersection()[0];
    console.log(chat);
  }

  //   async function updateUser(username, topic) {
  //     User.updateOne(
  //       { name: username },
  //       { $addToSet: { chats: topic } },
  //       function (err, res) {
  //         console.log("User updated");
  //       }
  //     );
  //   }

  const messages = [];
  console.log("Consumer created" + chat);
  const consumer = new kafka.Consumer(
    client,
    [{ topic: chat, partition: 0, offset: 0 }],
    { fromOffset: true }
  );

  console.log("Consumer created" + consumer);

  consumer.on("message", (message) => {
    messages.push(message);
  });

  consumer.on("error", (err) => {
    console.log("Error:", err);
  });

  consumer.on("offsetOutOfRange", (err) => {
    console.log("Error:", err);
  });

  await new Promise((resolve) => setTimeout(resolve, 20000));

  console.log(messages);

  if (messages.length === 0) {
    console.log("No messages");
    messages.push(chat);
  }

  consumer.close(true, () => {});

  console.log(messages);
  res.send(messages);
});

module.exports = router;
