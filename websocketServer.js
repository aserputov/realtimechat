const express = require("express");
const kafka = require("kafka-node");
const WebSocket = require("ws");
const port = 8080;

class WebSocketServer {
  constructor(wss, Consumer, client, producer) {
    this.wss = wss;
    this.Consumer = Consumer;
    this.client = client;
    this.producer = producer;
    this.topic = "i1";
    this.data = [{ topic: "i1", partition: 0 }];
    this.consumer = new Consumer(client, this.data, {
      autoCommit: false,
    });

    this.wss.on("connection", (ws) => {
      console.log("Client connected");
      console.log("Data" + JSON.stringify(this.data));
      this.consumer.on("message", (message) => {
        console.log("Client" + message);
        ws.send(JSON.stringify(message));
      });
      ws.on("message", (message) => {
        let json = JSON.parse(message);
        console.log(json.topic);
        this.topic = json.topic;

        const payloads = [{ topic: json.topic, messages: json.message }];
        this.consumer.removeTopics([{ topic: this.topic }], (err, removed) => {
          if (!err) {
            this.consumer.addTopics(
              [{ topic: json.topic, partition: 0 }],
              (err, added) => {
                if (!err) {
                  this.topic = json.topic;
                }
              }
            );
          }
        });
        this.data = [{ topic: this.topic, partition: 0 }];
        console.log("Data" + JSON.stringify(this.data));
        this.producer.send(payloads, (err, data) => {
          console.log(data);
        });
        console.log(`Received message from client: ${JSON.stringify(message)}`);
      });
    });
  }
  start() {
    console.log("Server started");
  }
}

const wss = new WebSocket.Server({ port: port });
const consume = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
let Consumer = kafka.Consumer;
let client = new kafka.KafkaClient();
const producer = new kafka.Producer(consume);
const webSocket = new WebSocketServer(wss, Consumer, client, producer);
webSocket.start();
