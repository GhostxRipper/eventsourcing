const { writeFileSync, appendFileSync, readFileSync } = require('fs')
const { join } = require('path')
const { EOL } = require('os')

const { parse, stringify } = JSON

const EVENT_LOG_PATH = join(__dirname, '../logs', 'todo.log')

const EVENT = {
  new: 'new',
  complete: 'complete',
  uncomplete: 'uncomplete',
  remove: 'remove',
}

const reset = () => {
  writeFileSync(EVENT_LOG_PATH, '')
}

const eventKeys = ['type', 'id', 'todo']
const todoKeys = ['id', 'text', 'complete']

const checkEvent = event =>
  Object.keys(event).every(v => eventKeys.includes(v))
  && Object.keys(event.todo).every(v => todoKeys.includes(v))

const cloneTodos = data =>
  Object.values(data).reduce(
    (todos, todo) => ({
      ...todos,
      [todo.id]: Object.create(todo),
    }),
    {},
  )

const append = event => {
  if (!checkEvent(event)) {
    throw new TypeError(
      `Missing property on Todo Event\n${stringify(event, null, 2)}`,
    )
  }
  appendFileSync(EVENT_LOG_PATH, stringify(event) + EOL)
}

const getEvents = () =>
  readFileSync(EVENT_LOG_PATH, 'utf-8')
    .split(EOL)
    .filter(Boolean)
    .map(event => {
      try {
        return parse(event)
      } catch (err) {
        console.error(err)
        return {}
      }
    })

const query = number => {
  let events = getEvents()

  if (!Number.isNaN(number)) {
    events = events.slice(0, number)
  }

  return events.reduce((todos, event) => {
    switch (event.type) {
      case EVENT.new:
        return {
          ...todos,
          [event.id]: event.todo,
        }
      case EVENT.complete:
        return {
          ...todos,
          [event.id]: {
            ...todos[event.id],
            complete: true,
          },
        }
      case EVENT.uncomplete:
        return {
          ...todos,
          [event.id]: {
            ...todos[event.id],
            complete: false,
          },
        }
      case EVENT.remove: {
        const { [event.id]: d, ...rest } = todos
        return rest
      }
      default:
        return todos
    }
  }, {})
}

const rebuild = () => query()

const undo = (data, last) =>
  getEvents()
    .slice(-last)
    .reduceRight((todos, event) => {
      switch (event.type) {
        case EVENT.new: {
          const { [event.id]: d, ...rest } = todos
          return rest
        }
        case EVENT.complete:
          return {
            ...todos,
            [event.id]: {
              ...todos[event.id],
              complete: false,
            },
          }
        case EVENT.uncomplete:
          return {
            ...todos,
            [event.id]: {
              ...todos[event.id],
              complete: true,
            },
          }
        case EVENT.remove:
          return {
            ...todos,
            [event.id]: event.todo,
          }
        default:
          return todos
      }
    }, cloneTodos(data))

module.exports = {
  reset,
  append,
  rebuild,
  undo,
  query,
  EVENT,
}
