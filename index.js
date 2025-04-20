const express = require("express");
const path = require("path");

const server = express();

//setting up parsers for form
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//setting up public static fie
server.use(express.static(path.join(__dirname, "public")));

//setting up ejs for ejs pages
server.set("view engine", "ejs");

//routes
server.get("/", (req, res) => {
  res.render("index");
  //   const people = ["daud", "saad", "hafsa", "bilal"];
  //   res.render("index", { people: people });
});

server.get("/profile/:username", (req, res) => {
  const name = req.params.username;
  res.send(
    `Hello ${name}! </br> Congratulations your profile has been activated.`
  );
});

//listening
server.listen(3000, () => {
  console.log("listening...");
});
