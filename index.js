const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

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

app.get("/api/", (request, response) => {
  response.send("<h1>Mainpage</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// info sivu

app.get("/api/info", (request, response) => {
  const date = new Date();
  const personListSize = persons.length;
  response.send(`<p> Phonebook has info for ${personListSize} people <p/>
   ${date}`);
});

//Yksittäisen resurssin GET

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id); //Muutetaan id string -> integer
  const personToGet = persons.find(person => person.id === id); //etsii henkilön listasta, jolla vastaava id
  if (personToGet) {
    response.json(personToGet);
  } else {
    response.status(404).end(); //Jos henkilöä ei löydy vastaan statuskoodilla 404
  }
});

// Resurssin poisto

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id); //Filtteröidään vaan henkilöt joiden id ei vastaa poistettavaa id:ta

  response.status(204).end();
});

const generateNewId = () => {
  const newID = persons.length > 0 ? Math.floor(Math.random() * 1001) : 0; //Luo id:n 0-1000 joukosta
  return newID;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "Person name is missing"
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "Person number is missing"
    });
  }

  const allNames = persons.map(person => person.name); // Tallentaa kaikki nimet taulukkoon
  //Tarkistaa onko nimi serverillä
  if (allNames.includes(body.name)) {
    return response.status(409).json({
      error: "Person name must be unique"
    });
  }

  const person = {
    content: body.name,
    number: body.number,
    id: generateNewId()
  };

  persons = persons.concat(person); //Päivittää persons listan
  response.json(person); //palauttaa juuri luodun henkilön
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
