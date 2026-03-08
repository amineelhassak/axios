import axios from "axios";
import { useEffect, useState } from "react";

const API = "http://localhost:8000/users";

interface User {
  id: string;
  name: string;
  userId: number;
}

export default function Post() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(API);
      setUsers(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<User[]>(API);
        setUsers(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    load();
  }, []);

  const addUser = async () => {
    if (!name.trim()) return;
    try {
      await axios.post(API, { name, userId: Date.now() });
      setName("");
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const updateUser = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await axios.put(`${API}/${id}`, { name: editName });
      setEditingId(null);
      setEditName("");
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Users CRUD
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="font-bold text-red-700 hover:text-red-900"
          >
            &times;
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Enter user name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addUser()}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addUser}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Add
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Name
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                  No users found. Add one above!
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-500 text-sm">{user.id}</td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && updateUser(user.id)
                        }
                        className="border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-800 font-medium">
                        {user.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {editingId === user.id ? (
                      <>
                        <button
                          onClick={() => updateUser(user.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditName("");
                          }}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(user.id);
                            setEditName(user.name);
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
