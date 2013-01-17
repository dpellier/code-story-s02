var express = require("express");
var change = require("./change.js");

var answer = function(question, req, res) {
  switch(question) {
    case "Quelle est ton adresse email":
      return "dpellier@gmail.com";
      break;
    case "Es tu heureux de participer(OUI/NON)":
    case "Es tu abonne a la mailing list(OUI/NON)":
    case "Es tu pret a recevoir une enonce au format markdown par http post(OUI/NON)":
    case "As tu bien recu le premier enonce(OUI/NON)":
      return "OUI";
      break;
    case "Est ce que tu reponds toujours oui(OUI/NON)":
      return "NON";
      break;
    default:
      return "I'm sorry but I can't understand the question.";
      break;
  }
};

// Server declaration
var app = express();
app.use(express.cookieParser());
app.use(express.session({
  "secret": "my little secret"
}));

// Routing
app.post("/enonce/:id", function(req, res) {
  console.log("New enonce request received - " + new Date().toTimeString());

  req.on('data', function(data) {
    console.log("Enonce : ");
    console.log(data.toString());
  });
  
  res.send(200);
});

app.get("/scalaskel/change/:value", function(req, res) {
  var value = req.params.value;
  
  console.log("New change request received - " + new Date().toTimeString());
  console.log("Value : " + value);
  
  var a = change.changeMonade(value);
  
  console.log("Result : " + a);
  
  res.end(a);
}); 

app.get("/", function(req, res) {
  var q = req.param("q");
  var a = answer(q, req, res);

  console.log("New request received - " + new Date().toTimeString());
  console.log("Question : " + q);
  console.log("Answer : " + a);

  res.end(a);
});

app.listen(process.env.PORT);
console.log("Server running");