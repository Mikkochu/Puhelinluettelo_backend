const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please give 3 arguments");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Mikkochu:${password}@cluster0-bopqx.mongodb.net/puhelinluettelo-MongoDB?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
}); //Skeema

const Person = mongoose.model("Person", personSchema); //Model

//Tallenna databaseen
if (process.argv.length === 5) {
  const personObj = new Person({
    //Dokumentti jossa nimi ja numero, mitkä perustuu käyttäjän antamiin argumentteihin
    name: process.argv[3],
    number: process.argv[4]
  });

  console.log(
    `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
  );

  personObj.save().then(response => {
    console.log("Information saved");
    mongoose.connection.close();
  });
}

//Tulosta database
if (process.argv.length === 3) {
  console.log("Phonebook:");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
