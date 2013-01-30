var express = require("express");
var change = require("./change.js");
var calc = require("./calculate.js");
var jajascript = require("./jajascript_v2.js");

var answer = function(question) {
  switch(question) {
    case "Quelle est ton adresse email":
      return "dpellier@gmail.com";
      break;
    case "Es tu heureux de participer(OUI/NON)":
    case "Es tu abonne a la mailing list(OUI/NON)":
    case "Es tu pret a recevoir une enonce au format markdown par http post(OUI/NON)":
    case "As tu bien recu le premier enonce(OUI/NON)":
    case "As tu bien recu le second enonce(OUI/NON)":
      return "OUI";
      break;
    case "As tu passe une bonne nuit malgre les bugs de l etape precedente(PAS_TOP/BOF/QUELS_BUGS)":
      return "QUELS_BUGS";
      break;
    case "Est ce que tu reponds toujours oui(OUI/NON)":
    case "As tu copie le code de ndeloof(OUI/NON/JE_SUIS_NICOLAS)":
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

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

// Routing
app.post("/enonce/:id", function(req, res) {
  console.log("New enonce request received - " + new Date().toTimeString());

  req.on('data', function(data) {
    console.log("Enonce : ");
    console.log(data.toString());
  });
  
  res.send(200);
});

app.post("/jajascript/optimize", function(req, res) {
  console.log("New enonce request received - " + new Date().toTimeString());

  var a = "";
  req.on('data', function(data) {
    console.log("Reservation : ");
    console.log(data.toString());
    a = jajascript.optimize(data.toString());
    
    console.log("Result : " + a);
    res.end(a);
  });
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
  var q = req.param("q"),
      a = "";
  
  /^[0-9\(\),\s\*\/-]+$/gi.test(q) ? a = calc.calculate(q) : a = answer(q);

  console.log("New request received - " + new Date().toTimeString());
  console.log("Question : " + q);
  console.log("Answer : " + a);

  res.end(a);
});

app.listen(process.env.PORT);
console.log("Server running");