const express = require('express')
const app = express()

app.use(express.json())

let items = [
  { id: 1, name: 'Producto A', description: 'Descripción A', price: 10, stock: 5 },
  { id: 2, name: 'Producto B', description: 'Descripción B', price: 20, stock: 3 }
]
let nextId = 3

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' })
})

app.get('/items', (req, res) => {
  res.status(200).json(items)
})

app.get('/items/:id', (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id))
  if (!item) return res.status(404).json({ error: 'Item not found' })
  res.json(item)
})

app.post('/items', (req, res) => {
  const { name, description, price, stock } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })
  const item = { id: nextId++, name, description: description || '', price: price || 0, stock: stock || 0 }
  items.push(item)
  res.status(201).json(item)
})

app.put('/items/:id', (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Item not found' })
  const { name, description, price, stock } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })
  items[index] = { ...items[index], name, description: description || '', price: price || 0, stock: stock || 0 }
  res.json(items[index])
})

app.delete('/items/:id', (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Item not found' })
  items.splice(index, 1)
  res.status(204).send()
})

module.exports = app
