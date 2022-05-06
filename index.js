// const http = require('http')
const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('./loggerMiddleware')

app.use(cors())
app.use(express.json())

app.use(logger)

const date = new Date(Date.now())

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '222',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
]

app.get('/', (request, response, next) => {
  response.send('<h3>Hello world</h3>')
  console.log(response)
  next()
})

app.get('/info', (request, response, next) => {
  response.send(`<p>Phonebook has info for ${persons.length}
  <p>${date}</p>
  </>`)
  next()
})

app.get('/api/persons', (request, response, next) => {
  response.json(persons)
  next()
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

  next()
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
  next()
})

app.post('/api/persons', (request, response, next) => {
  const person = request.body

  console.log(person.content)
  // if (!person || !person.content) {
  //   return response.status(400).json({
  //     error: 'persons content is missing'
  //   })
  // }
  const ids = persons.map(person => person.id)
  const maxId = Math.max(...ids)

  const newPerson = {
    name: person.name,
    number: person.number,
    id: maxId + 1
  }

  persons = [...persons, newPerson]

  response.json(newPerson)
  next()
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not Found'
  })
})

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json'})
//   response.end(JSON.stringify(persons))
// })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`)
})
