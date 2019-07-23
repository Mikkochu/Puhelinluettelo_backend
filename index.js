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

// uusi infosivu
app.get("/api/info", (request, response) => {
  const date = new Date();
  Person.find({})
    .then(allPersons => {
      response.send(`<p> Phonebook has info for ${allPersons.length} people <p/>
      ${date}`);
    })
    .catch(error => next(error));
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
    .catch(error => next(error));
});

//Yksittäisen resurssin GET MONGO
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
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
    .catch(error => next(error));
});

//PUT
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});

// MIDDLEWARE

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

// olemattomien osoitteiden käsittely
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

//Virheidenkäsittely
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError" && error.kind == "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};
app.use(errorHandler);

//PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
