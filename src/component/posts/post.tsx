import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Post() {
  // 1. State to store your posts
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // 2. Define the function properly inside the component
  const fetchUsers = async () => {
    try {
      const  dataInf  = await axios.get(
        "http://localhost:8000/users",
      );
      setUsers(dataInf.data);
      console.log(dataInf);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const postUser = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/users", data);
      console.log("User posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting user:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {error == null ? (
          users.map((user) => <li key={user.id}>{user.name}</li>)
        ) : (
          <p>Error fetching users: {error.message}</p>
        )}
      </ul>
      <div>
        <button onClick={() => {postUser({ name: "yassine", userId: 1 })}}>Add User</button>
      </div>
    </div>
  );
}
