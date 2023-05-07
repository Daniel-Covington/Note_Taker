const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  const newNote = { ...req.body, id: uuidv4() };
  notes.push(newNote);
  fs.writeFileSync('./db.json', JSON.stringify(notes), 'utf8');
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  const updatedNotes = notes.filter(note => note.id !== req.params.id);
  fs.writeFileSync('./db.json', JSON.stringify(updatedNotes), 'utf8');
  res.json(updatedNotes);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});