const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// In-memory store
let items = []
let nextId = 1

// GET all items
app.get('/api/items', (req, res) => {
  res.json(items)
})

// GET single item
app.get('/api/items/:id', (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id))
  if (!item) return res.status(404).json({ error: 'Item not found' })
  res.json(item)
})

// POST create item
app.post('/api/items', (req, res) => {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })

  const item = {
    id: nextId++,
    name,
    description: description || '',
    createdAt: new Date().toISOString()
  }
  items.push(item)
  res.status(201).json(item)
})

// PUT update item
app.put('/api/items/:id', (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Item not found' })

  const { name, description } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })

  items[index] = {
    ...items[index],
    name,
    description: description || '',
    updatedAt: new Date().toISOString()
  }
  res.json(items[index])
})

// DELETE item
app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Item not found' })

  items.splice(index, 1)
  res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
