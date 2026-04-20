import http from 'k6/http'
import { check, sleep } from 'k6'
import { Trend, Rate } from 'k6/metrics'

const healthDuration = new Trend('health_duration')
const itemsDuration = new Trend('items_duration')
const errorRate = new Rate('error_rate')

export const options = {
  ext: {
    loadimpact: {
      projectID: 7330162,
      name: 'crud-app load test'
    }
  },
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m',  target: 10 },
    { duration: '20s', target: 0  }
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    error_rate: ['rate<0.05']
  }
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export default function () {
  // ── Vista 1: Health check ────────────────────────────────────────────────
  const healthRes = http.get(`${BASE_URL}/health`)
  healthDuration.add(healthRes.timings.duration)
  const healthOk = check(healthRes, {
    'GET /health → status 200':     (r) => r.status === 200,
    'GET /health → body status OK': (r) => r.json('status') === 'OK'
  })
  errorRate.add(!healthOk)

  sleep(1)

  // ── Vista 2: Listado de items ────────────────────────────────────────────
  const itemsRes = http.get(`${BASE_URL}/items`)
  itemsDuration.add(itemsRes.timings.duration)
  const itemsOk = check(itemsRes, {
    'GET /items → status 200':       (r) => r.status === 200,
    'GET /items → respuesta es array': (r) => Array.isArray(r.json())
  })
  errorRate.add(!itemsOk)

  sleep(1)

  // ── Vista 3: Crear item (POST) ───────────────────────────────────────────
  const payload = JSON.stringify({ name: 'Item K6', price: 99, stock: 5 })
  const postRes = http.post(`${BASE_URL}/items`, payload, {
    headers: { 'Content-Type': 'application/json' }
  })
  check(postRes, {
    'POST /items → status 201': (r) => r.status === 201,
    'POST /items → tiene id':   (r) => r.json('id') !== undefined
  })

  sleep(1)
}
