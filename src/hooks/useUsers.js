import { useEffect, useState } from "react";
import { list } from "../services/userService";

const useUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    const data = await list();
    setUsers(data);
  }, []);

  return users;
}

export default useUsers;