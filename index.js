require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Person = require("./models/person");
const morgan = require("morgan");
const cors = require("cors");

app.use(express.static("build"));
app.use(bodyParser.json());
app.use(cors());

//MORGAN
morgan.token("data", request => {
  return JSON.stringify(request.body); //Muuttaa json-muotoon
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
  //post, url, status, pituus, viive ms, dataObjekti
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

// info sivu
app.get("/api/info", (request, response) => {
  const date = new Date();
  const personListSize = persons.length;
  response.send(`<p> Phonebook has info for ${personListSize} people <p/>
   ${date}`);
});

//ETUSIVU
app.get("/api/", (request, response) => {
  response.send("<h1>Mainpage</h1>");
});

//GET ALL, MONGO
app.get("/api/persons", (request, response) => {
  Person.find({})
    .then(allPersons => {
      response.json(allPersons.map(person => person.toJSON()));
    })
    .catch(errorMsg => {
      console.log("Error GET ALL: ", errorMsg);
      response.status(404).end();
    });
});

//Yksittäisen resurssin GET MONGO
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person.toJSON());
  });
});

// Resurssin poisto
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

//POST
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: "number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON());
    })
    .catch(errorMsg => {
      console.log("Error GET ALL: ", errorMsg);
      response.status(404).end();
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
