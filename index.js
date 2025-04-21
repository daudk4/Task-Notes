const express = require("express");
const path = require("path");
const fs = require("fs");
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
  fs.readdir("./files", (err, files) => {
    if (err) console.log("error reading directory called files.");
    
    res.render("index", { files: files });
  });
  //   const people = ["daud", "saad", "hafsa", "bilal"];
  //   res.render("index", { people: people });
});

server.post("/create", (req, res) => {
  const fileName = req.body.title
    .split(" ")
    .map((el, index) => {
      let firstCharacter, remainingCharacters;
      if (index === 0) {
        firstCharacter = el.slice(0, 1).toLowerCase();
        remainingCharacters = el.slice(1).toLowerCase();
      } else {
        firstCharacter = el.slice(0, 1).toUpperCase();
        remainingCharacters = el.slice(1).toLowerCase();
      }
      return firstCharacter + remainingCharacters;
    })
    .join("");

  fs.writeFile(`./files/${fileName}.txt`, req.body.description, (err) => {
    if (err) console.log("Failed to create a file. ", err);
    res.redirect("/");
  });
});

server.get("/tasks/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const title = fileName
    .split(".")[0]
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (c) => c.toUpperCase()) // Capitalize first character
    .trim();

  fs.readFile(`./files/${fileName}.txt`, "utf-8", (err, data) => {
    if (err) console.log(`Error reading file named: ${fileName}.txt `);
    else {
      res.render("show", { title: title, description: data });
    }
  });
});

server.get(`/edit/:fileName`, (req, res) => {
  const fileName = req.params.fileName;
  fs.readFile(`./files/${fileName}.txt`, 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file named: ${fileName}.txt `);
      return;
    }
    res.render('edit', { fileName: fileName + '.txt', description: data })

  });
})

server.post('/edit', (req, res) => {
  const fileName = req.body.previous
  fs.writeFileSync(`./files/${fileName}`, req.body.description, 'utf-8', (err) => {
    if (err) {
      console.log(`Failed to update a file named: ${fileName}`)
      return
    }
  })
  fs.rename(`./files/${fileName}`, `./files/${req.body.new}`, (err) => {
    if (err) console.log('Failed to rename the file named: ' + fileName);
  })
  res.redirect('/')
})

//listening
server.listen(3000, () => {
  console.log("listening...");
});
