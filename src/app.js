const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = { id: uuid(), title: title, url: url, techs: techs, likes: 0 };

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;

  if(!isUuid(id)){
    return res.status(400).json({ error: 'Invalid id.' });
  }

  const repIndex = repositories.findIndex(rep => rep.id === id);

  if(repIndex < 0){
    return res.status(400).json({ error: 'Repository not found.' })
  }

  const { title, url, techs } = req.body;

  const rep = {
    id,
    title,
    url,
    techs,
    likes: repositories[repIndex].likes,
  };

  repositories[repIndex] = rep;

  return res.json(repositories[repIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  if(!isUuid(id)){
    return res.status(400).json({ error: 'Invalid id.' });
  }

  const repIndex = repositories.findIndex(rep => rep.id === id);
  
  if(repIndex < 0){
    return res.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  if(!isUuid(id)){
    return res.status(400).json({ error: 'Invalid id.' });
  }

  const repIndex = repositories.findIndex(rep => rep.id === id);

  if(repIndex < 0){
    return res.status(400).json({ error: 'Repository not found.' });
  }

  const { likes } = repositories[repIndex];

  repositories[repIndex].likes = likes + 1;

  return res.json(repositories[repIndex]);
});

module.exports = app;
