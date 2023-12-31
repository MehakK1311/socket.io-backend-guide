const app = require("express")();
const http = require("http").Server(app);
const path = require("path");
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  const options = {
    root: path.join(__dirname),
  };
  const fileName = "index.html";
  res.sendFile(fileName, options);
});

let users = 0;

//rooms
let roomNum = 1;
//no. of users in room
let full = 0;

//using custom namespaces
const customNamespace = io.of("/custom-namespace");
// default namespace is '/'

//for default namespace
// io.on("connection", (socket) => {}

//for custom namespace
customNamespace.on("connection", (socket) => {
  console.log("user connected");
  users++;

  //Server Side Custom Event
  socket.emit("myCustomEventServer", {
    msg: "Welcome new User",
  });

  //Client Side Custom Event
  socket.on("myCustomEventClient", (data) => {
    console.log(data.desc);
  });

  //broadcasting a message

  //for default namespace
  // io.sockets.emit("broadcast", {
  //   msg: `Broadcast Message`,
  // });

  //for custom namespace
  customNamespace.emit("broadcast", {
    msg: `Broadcast Message`,
  });

  //broadcasting to already connected users when new user is connected
  socket.broadcast.emit("myCustomEventServer", {
    msg: `${users} users connected!`,
  });

  //join a room
  socket.join(`room-${roomNum}`);

  //for default namespace
  // io.sockets.in("", {});

  //for custom namespace
  customNamespace
    .in(`room-${roomNum}`)
    .emit("connectedRoom", `you are connected to room number ${roomNum}`);

  //creating a limit for no. of users in a rooms
  //and sending new user in next room
  full++
  if(full>=2){
    full=0
    roomNum++;
  }

  socket.on("disconnect", () => {
    console.log("user disconnected");

    users--;
    //broadcasting to already connected users when a user is disconnected
    socket.broadcast.emit("myCustomEventServer", {
      msg: `${users} users connected!`,
    });
  });
});

http.listen(3000, () => {
  console.log("app running");
});
