const express = require('express');
const path = require('path');

const app = express();

// View engine + middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Tiny method override (no dependency)
app.use((req, res, next) => {
  const override = (req.query._method || (req.body && req.body._method) || '').toUpperCase();
  if (override === 'PUT' || override === 'DELETE' || override === 'PATCH') {
    req.method = override;
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// In-memory "DB"
let items = []; // each item: { text: 'task', priority: 'low' | 'medium' | 'high' }

// Home + filter (GET /?filter=high|medium|low|all)
app.get('/', (req, res) => {
  const filter = (req.query.filter || 'all').toLowerCase();
  let todos = items.map((todo, i) => ({ ...todo, i })); // keep original index for edit/delete
  if (['high', 'medium', 'low'].includes(filter)) {
    todos = todos.filter(t => t.priority === filter);
  }
  res.render('list', { todos, filter });
});

// Create (POST /todos)
app.post('/todos', (req, res) => {
  const text = (req.body.text || '').trim();
  const rawPriority = (req.body.priority || 'medium').toLowerCase();
  const priority = ['low', 'medium', 'high'].includes(rawPriority) ? rawPriority : 'medium';

  if (text) items.push({ text, priority });
  res.redirect('/');
});

// Update (PUT /todos/:index)
app.put('/todos/:index', (req, res) => {
  const i = parseInt(req.params.index, 10);
  const updatedText = (req.body.updatedTask || '').trim();
  if (!Number.isNaN(i) && items[i] && updatedText) {
    items[i].text = updatedText;
  }
  res.redirect('/');
});

// Delete (DELETE /todos/:index)
app.delete('/todos/:index', (req, res) => {
  const i = parseInt(req.params.index, 10);
  if (!Number.isNaN(i) && items[i]) items.splice(i, 1);
  res.redirect('/');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server activated on port ${PORT}`));