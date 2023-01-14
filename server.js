const clientSessions = require("client-sessions");
const bodyParser = require("body-parser");
const kafka = require("kafka-node");
const express = require("express");
const cors = require("cors");
const main = require("./routes/main");
const users = require("./routes/users");
const chats = require("./routes/chats");
const index = require("./routes/index");
const list = require("./routes/list");
const reg = require("./routes/reg");
const login = require("./routes/login");
const logout = require("./routes/logout");
const ins = require("./routes/ins");
const messages = require("./routes/messages");

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });

const app = express();
const port = 3000;

class WebServer {
  corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };

  constructor() {
    this.app = app;
    this.port = port;
    this.client = client;

    app.set("view engine", "ejs");
    app.use(
      clientSessions({
        cookieName: "session", // this is the object name that will be added to 'req'
        secret: "week10example_web322", // this should be a long un-guessable string.
        duration: 5 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
        activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
      })
    );
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(cors(this.corsOptions));

    this.app.use("/", index);
    this.app.use("/main", main);
    this.app.use("getchats", chats);
    this.app.use("/users", users);
    this.app.use("/list", list);
    this.app.use("/logout", logout);
    this.app.use("/reg", reg);
    this.app.use("/login", login);
    this.app.use("/ins", ins);
    this.app.use("/messages", messages);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Web Server app listening at http://localhost:${this.port}`);
    });
  }
}

const webserver = new WebServer(app, 3000, client);
webserver.start();
