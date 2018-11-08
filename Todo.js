const TodoEvents = require('./events/todo')

const db = {}
function* idMaker() {
  let index = 0
  while (true) yield (index += 1)
}

const genId = idMaker()

const getNewId = () => genId.next().value

const getAll = () => db

const createTodo = (text, complete = false) => {
  const id = getNewId()
  const todo = {
    id,
    text,
    complete,
  }

  db[id] = todo

  TodoEvents.append({
    type: TodoEvents.EVENT.new,
    id,
    todo,
  })

  return db
}

const toogle = id => {
  const old = db[id]
  if (old) {
    const todo = {
      ...old,
      complete: !old.complete,
    }
    db[id] = todo
    const type = todo.complete
      ? TodoEvents.EVENT.complete
      : TodoEvents.EVENT.uncomplete

    TodoEvents.append({ id, type, todo })

    return todo
  }
  return null
}

const remove = id => {
  const todo = db[id]
  if (todo) {
    delete db[id]

    TodoEvents.append({ id, type: TodoEvents.EVENT.remove, todo })
    return todo
  }
  return null
}

module.exports = {
  getAll,
  createTodo,
  get: id => db[id],
  toogle,
  remove,
}
