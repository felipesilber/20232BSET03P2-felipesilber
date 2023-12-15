const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');


const app = express();
const port = 3000;

app.use(bodyParser.json());


const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE cats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, votes INT)");
  db.run("CREATE TABLE dogs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, votes INT)");
});

app.post('/cats', [
  body('name').isString().escape(),
], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const name = req.body.name;
  const instruction = db.prepare("INSERT INTO cats (name, votes) VALUES (?, 0)");

  instruction.run(name, function(err) {
    instruction.finalize();

    if (err) {
      res.status(500).json({ error: "Erro ao inserir no banco de dados" });
    } else {
      res.status(201).json({ id: this.lastID, name, votes: 0 });
    }
  });
});

app.post('/dogs', [
  body('name').isString().escape(),
], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const name = req.body.name;
  const instruction = db.prepare("INSERT INTO dogs (name, votes) VALUES (?, 0)");

  instruction.run(name, function(err) {
    instruction.finalize();

    if (err) {
      res.status(500).json({ error: "Erro ao inserir no banco de dados" });
    } else {
      res.status(201).json({ id: this.lastID, name, votes: 0 });
    }
  });
});

app.post('/vote/:animalType/:id', (req, res) => {
  const animalType = req.params.animalType;
  const id = req.params.id;

  const check = db.prepare(`SELECT COUNT(*) as count FROM ${animalType} WHERE id = ?`);
  check.get(id, (err, row) => {
    check.finalize();

    if (err) {
      res.status(500).json({ error: "Erro ao verificar o banco de dados" });
    } else {
      const count = row.count;

      if (count === 0) {
        res.status(404).json({ error: "Registro não encontrado" });
      } else {
        const update = db.prepare(`UPDATE ${animalType} SET votes = votes + 1 WHERE id = ?`);
        update.run(id, function (err) {
          update.finalize();

          if (err) {
            res.status(500).json({ error: "Erro ao atualizar o banco de dados" });
          } else {
            res.status(200).send("Voto computado");
          }
        });
      }
    }
  });
});

app.get('/cats', (req, res) => {
  db.all("SELECT * FROM cats", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});

app.get('/dogs', (req, res) => {
  db.all("SELECT * FROM dogs", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocorreu um erro!');
});

app.listen(port, () => {
  console.log(`Cats and Dogs Vote app listening at http://localhost:${port}`);
});