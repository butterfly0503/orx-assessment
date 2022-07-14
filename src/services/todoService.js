import axios from "axios";

const dataURL = 'https://jsonplaceholder.typicode.com/todos';

export const list = async () => {
  try {
    const response = await axios.get(dataURL);
    return response.data;
  } catch (ex) {
    return [];
  }
}