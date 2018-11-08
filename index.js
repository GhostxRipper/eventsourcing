const Todo = require('./Todo')
const TodoEvents = require('./events/todo')

console.log('Get all todos should be empty')
console.log(Todo.getAll())

console.log('Create new Todo')
console.log(Todo.createTodo('Learn event sourcing', false))

console.log('Get all todo')
console.log(Todo.getAll())

console.log('Get todo with id `1`')
console.log(Todo.get(1))

console.log('Toogle todo with id `1`')
console.log(Todo.toogle(1))

console.log('Remove Todo with id `1`')
console.log(Todo.remove(1))

console.log('Get all todos')
console.log(Todo.getAll())

console.log('Undo')
console.log(TodoEvents.undo(Todo.getAll(), 1))

console.log('Query 1')
console.log(TodoEvents.query(1))

console.log('Query 2')
console.log(TodoEvents.query(2))

console.log('Query 3')
console.log(TodoEvents.query(3))

console.log('Reset')
TodoEvents.reset()
