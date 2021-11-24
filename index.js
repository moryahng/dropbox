/**********************************************
 * Dropbox Challenge
 * ==================================
 ***********************************************/

// The purpose of this challenge is to ensure that you solidify your understanding of Node.js, as well as connect the frontend files to the backend.

/** # SETUP #
/*  ================== */
/** 1) Packages are already installed. Import them to this file */
// example: const express = require("express")

const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const bodyParser = require('body-parser')
const path = require("path");
const { nextTick } = require("process");

/** # Create a Server #
/*  ====================== */
/** 2) Create a Server */
// set up app and port

const app = express();
const port = 3000;

/** # Configure App #
/*  ====================== */
/** 3) Configure Application */

// This part has already been done for you! Just uncomment the lines below.

app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
const uploadDirectory = __dirname + "/uploaded";

app.use(express.static("uploaded"));
app.use(express.static("public/"));
app.use(express.static("pages/"));
let caches = {};

/** # Read File #
/*  ====================== */
/** 4) Create a readfile function */

// readFile is a function which takes the file as an input, it goes to the 'uploaded' directory
// that we serve via express. It will then look for the name of the file that we pass into the function,
// the promise will resolve with the body of the file (the data)

// Remember, a promise is an object that tells you whether an action
// is successful or not.  It accepts two arguments: resolve and reject
// Resolve: if the job finishes, the promise will return a resolve object
// Reject: if an error occurs, the promise will return an error object

function readFile(file) {
  console.log("readFile function running");
  console.log("Reading to directory: " + uploadDirectory + "/" + file);
  return new Promise((resolve, reject) => {
    // CODE BELOW THIS LINE
    // fs.readFile
    // resolve (fs.writeFileSync(uploadDirectory + "/" + JSON.stringify(file)))
    fs.readFile(uploadDirectory + "/" + file, function (err, data){
     if (err){
       reject ("error")
     } else {
       resolve (data)
     }
    })

  });
}

/** # Write File #
/*  ====================== */

/** 5) Create a write file function */

// writeFile is a function which takes the name of the file and the body (data)
// for storage - it will write the file to our uploadDirectory 'uploaded'
// this promise resolves with the name of the file

function writeFile(name, body) {
  console.log("writeFile function running");
  console.log("Writing to directory: " + uploadDirectory + "/" + name);
  return new Promise((resolve, reject) => {
    // CODE BELOW THIS LINE
    // fs.writeFile
    fs.writeFile(uploadDirectory + "/" + name, body, function (err){
      if (err){
        reject ("error")
      } else {
        resolve (name)
      }
     })
  });
}

/** # GET Method: Render index.html #
/*  ====================== */
/** 6) Render HTML page */

app.get("/", (req, res) => {
  console.log("GET Method: index.html");
  // CODE BELOW THIS LINE
  res.sendFile(__dirname + "/pages" + "/index.html");
});

app.get("/files", (req, res) => {
  // CODE BELOW THIS LINE
  res.sendFile(__dirname + "/pages" + "/files.html");
});


  var fileListHtml = ""

    fs.readdir(uploadDirectory, (err, files) => {
      if (err)
        console.log(err);
      else {
        files.forEach(file => {
          if (file !== ".DS_Store"){
          fileListHtml += `<br><a href="uploaded/${file}"><img src="download.png" width="25px" height="25px"></a>${file}`}
        })
        //console.log(fileListHtml)
        //res.send(fileListHtml)
      }
    }) 



/** # POST Method: Upload to /files #
/*  ====================== */
/** 7) Post Data */

app.post("/files", (req, res) => {
  console.log("POST Method: " + req.files.upload.name);
  console.log("req.files length:" + req.files.upload.length )
  // CODE BELOW THIS LINE
  if (req.files){
    const file = req.files.upload;

    writeFile(file.name, file.data)
    .then(readFile)
    .then((data) => {
      caches[file.name] = data;
      console.log(`caches${caches}`)
    })

    res.send (`
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Dongle:wght@300;400;700&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    
    body{
      font-family: 'Montserrat', sans-serif;
      color: #666;
      margin: 50px 35vw;
    }
    a{
      color: #666;
      text-decoration: none;
    }

    img{
      margin-left: 4px;
      margin-right: 4px;
    }
    </style>
    <a href="uploaded/${file.name}">
      <img src="download.png" width="25px" height="25px">
    </a>${file.name}<img src="new.png" width="25px" height="25px"><br>`+ fileListHtml +  `<br><br><a href="/"><b>Return to homepage</b></a>`
    )
  } else {
    res.redirect("/");
  }

});

/** # GET Method: See the file you uploaded #
/*  ====================== */
/** 8) Get Data */

app.get("/uploaded/:name", (req, res) => {
  console.log("GET method: uploaded/:name");
  // CODE BELOW THIS LINE
  const params = req.params.name;
  if (caches[params]) {
    res.send(caches[params]);
  } else {
    if (fs.existsSync(uploadDirectory + "/" + params)) {
      readFile(params)
      .then((data) => {
        caches[params] = data;
      })
      res.send(caches[params]);
    } else {
      res.redirect("/");
    }
  }
});

/** # Connecting to Server #
/*  ====================== */

app.listen(port, () => {
  console.log(`Connected to server! Go to localhost:${port}`);
});
