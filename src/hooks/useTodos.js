import { useEffect, useState } from "react";
import { list } from "../services/todoService";

const useTodos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(async () => {
    const data = await list();
    setTodos(data);
  }, []);

  return [todos, setTodos];
}

export default useTodos;