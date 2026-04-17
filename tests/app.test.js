const request = require('supertest')
const app = require('../src/app')
const { calculateValue } = require('../src/logic')

describe('Suite de Pruebas de Calidad de Software', () => {

  // ─── PRUEBAS UNITARIAS ────────────────────────────────────────────────────
  describe('Pruebas Unitarias - Lógica de Inventario', () => {

    test('Debe calcular correctamente el valor total (10 * 5 = 50)', () => {
      const result = calculateValue(10, 5)
      expect(result).toBe(50)
    })

    test('Debe retornar 0 si se ingresan valores negativos', () => {
      const result = calculateValue(-10, 5)
      expect(result).toBe(0)
    })

    // ── Validaciones adicionales unitarias ────────────────────────────────
    test('[Extra 1] Debe retornar 0 si precio y stock son 0', () => {
      const result = calculateValue(0, 0)
      expect(result).toBe(0)
    })

    test('[Extra 2] Debe retornar 0 si el stock es negativo', () => {
      const result = calculateValue(15, -3)
      expect(result).toBe(0)
    })
  })

  // ─── PRUEBAS DE INTEGRACIÓN ───────────────────────────────────────────────
  describe('Pruebas de Integración - API Endpoints', () => {

    test('GET /health - Debe responder con status 200 y JSON correcto', async () => {
      const response = await request(app).get('/health')
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('status', 'OK')
    })

    test('GET /items - Debe validar la estructura del inventario', async () => {
      const response = await request(app).get('/items')
      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('stock')
    })

    // ── Validaciones adicionales de integración ───────────────────────────
    test('[Extra 3] POST /items - Debe crear un item y responder con status 201', async () => {
      const nuevoItem = { name: 'Producto Test', description: 'Desc test', price: 50, stock: 10 }
      const response = await request(app).post('/items').send(nuevoItem)
      expect(response.statusCode).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.name).toBe('Producto Test')
    })

    test('[Extra 4] GET /items/:id - Debe retornar 404 para un ID inexistente', async () => {
      const response = await request(app).get('/items/9999')
      expect(response.statusCode).toBe(404)
      expect(response.body).toHaveProperty('error', 'Item not found')
    })
  })
})
