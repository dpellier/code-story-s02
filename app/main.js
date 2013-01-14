var express = require("express");

var answer = function(question, req, res) {
    switch(question) {
      case "Quelle est ton adresse email":
        return "dpellier@gmail.com"
        break;
      default:
        return "I'm sorry but I can't understand the question."
        break;
    }
};

var app = express();
app.use(express.cookieParser());
app.use(express.session({
    "secret": "my little secret"
}));

app.get("/", function(req, res) {
    var q = req.param("q");
    var a = answer(q, req, res);
    
    console.log("New request received - " + new Date().toTimeString());
    console.log("Question : \"" + q);
    console.log("Answer : \"" + a);
    
    res.end(a);
});

app.listen(80, "code-story-2.dpellier.cloudbees.net");
console.log("Server running");