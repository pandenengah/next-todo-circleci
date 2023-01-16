const fetchTodo = {
  getTodos: jest.fn(),
  putTodos: jest.fn().mockResolvedValue({rawData: {}}),
  postTodos: jest.fn().mockResolvedValue({rawData: {}}),
  deleteTodos: jest.fn().mockResolvedValue({rawData: {}}),
}
export default fetchTodo
