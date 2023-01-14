const elem = document.getElementById("all");
const from = document.getElementById("from");
let text = from.innerText;
let global;

fetch("http://localhost:3000/users", { method: "GET" })
  .then((response) => response.json())
  .then((result) => {
    console.log("Ok" + result);
    result.forEach((element) => {
      const li = document.createElement("div");

      elem.appendChild(li);
      li.innerHTML = `${element.username}`;
      li.addEventListener("click", function () {
        console.log("clicked " + element.username + " " + text);
        display.innerHTML = "";
        const options = {
          method: "GET",
        };
        fetch(
          `http://localhost:3000/messages?user1=${text}&user2=${element.username}`,
          options
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then((result) => {
            console.log("R" + result);
            if (result.length === 1) {
              console.log(result[0]);
              global = result[0];
            } else {
              result.forEach((element) => {
                global = element.topic;
                console.log("OK1" + global);
                let a = document.createElement("p");
                const div = document.getElementById("display");
                div.scrollTop = div.scrollHeight;
                div.appendChild(a);
                a.innerHTML = `<strong>${element.value}</strong>`;
                console.log();
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });

      // console.log();
    });
  })
  .catch((error) => {
    console.error("err " + error);
  });

console.log(global + "global");

const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");

const ws = new WebSocket("ws://localhost:8080");
console.log(text);
console.log(global);

sendButton.addEventListener("click", () => {
  let topic = global;
  console.log(topic);
  // ws.send(topic + text + ": " + messageInput.value);
  let jsonMessage = {
    topic: topic,
    message: text + ": " + messageInput.value,
  };
  let stringMessage = JSON.stringify(jsonMessage);
  ws.send(stringMessage);
});

const container = document.getElementById("container");
const display = document.getElementById("display");

// const options = { method: "GET" };

ws.onmessage = function incoming(event) {
  console.log(`Received message from server: ${JSON.parse(event.data).value}`);
  const div = document.getElementById("display");
  const p = document.createElement("p");
  div.appendChild(p);
  p.innerHTML = `<strong>${JSON.parse(event.data).value}</strong>`;
};
