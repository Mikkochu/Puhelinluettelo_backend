const express = require("express");
const app = express();

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
