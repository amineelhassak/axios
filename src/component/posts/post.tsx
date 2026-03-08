// Importer la bibliothèque axios pour faire des requêtes HTTP
import axios from "axios";
// Importer les hooks useEffect et useState depuis React
import { useEffect, useState } from "react";

// Définir l'URL de base de l'API (json-server sur le port 8000)
const API = "http://localhost:8000/users";

// Définir l'interface TypeScript pour typer un utilisateur
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

  // LIRE - Fonction pour récupérer tous les utilisateurs depuis l'API
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
  }, []); // [] = exécuter une seule fois au montage du composant

  const addUser = async () => {
    // Si le champ nom est vide, ne rien faire
    if (!name.trim()) return;
    try {
      // Envoyer une requête POST avec le nom et un userId unique
      await axios.post(API, { name, userId: Date.now() });
      // Vider le champ de saisie après l'ajout
      setName("");
      // Recharger la liste des utilisateurs
      fetchUsers();
    } catch (err) {
      // En cas d'erreur, stocker le message d'erreur
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // MODIFIER - Fonction pour mettre à jour un utilisateur existant
  const updateUser = async (id: string) => {
    // Si le champ de modification est vide, ne rien faire
    if (!editName.trim()) return;
    try {
      // Envoyer une requête PUT avec le nouveau nom
      await axios.put(`${API}/${id}`, { name: editName });
      // Quitter le mode édition
      setEditingId(null);
      // Vider le champ de modification
      setEditName("");
      // Recharger la liste des utilisateurs
      fetchUsers();
    } catch (err) {
      // En cas d'erreur, stocker le message d'erreur
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // SUPPRIMER - Fonction pour supprimer un utilisateur
  const deleteUser = async (id: string) => {
    try {
      // Envoyer une requête DELETE pour supprimer l'utilisateur par son ID
      await axios.delete(`${API}/${id}`);
      // Recharger la liste des utilisateurs
      fetchUsers();
    } catch (err) {
      // En cas d'erreur, stocker le message d'erreur
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Le rendu JSX du composant
  return (
    // Conteneur principal centré avec une largeur max de 2xl
    <div className="max-w-2xl mx-auto px-4">
      {/* Titre de la page */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Users CRUD
      </h2>

      {/* Bannière d'erreur - affichée uniquement s'il y a une erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          {/* Afficher le message d'erreur */}
          <span>{error}</span>
          {/* Bouton pour fermer la bannière d'erreur */}
          <button
            onClick={() => setError(null)}
            className="font-bold text-red-700 hover:text-red-900"
          >
            &times;
          </button>
        </div>
      )}

      {/* Formulaire pour ajouter un utilisateur */}
      <div className="flex gap-2 mb-8">
        {/* Champ de saisie du nom */}
        <input
          type="text"
          placeholder="Enter user name..."
          value={name}
          // Mettre à jour l'état à chaque frappe
          onChange={(e) => setName(e.target.value)}
          // Ajouter l'utilisateur si on appuie sur Entrée
          onKeyDown={(e) => e.key === "Enter" && addUser()}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Bouton pour ajouter l'utilisateur */}
        <button
          onClick={addUser}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Add
        </button>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          {/* En-tête du tableau */}
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
          {/* Corps du tableau avec une ligne de séparation entre chaque ligne */}
          <tbody className="divide-y divide-gray-200">
            {/* Si aucun utilisateur, afficher un message */}
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                  No users found. Add one above!
                </td>
              </tr>
            ) : (
              // Parcourir la liste des utilisateurs et afficher chaque ligne
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  {/* Colonne ID */}
                  <td className="px-6 py-4 text-gray-500 text-sm">{user.id}</td>
                  {/* Colonne Nom - affiche un input si on est en mode édition */}
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      // Mode édition : afficher un champ de saisie
                      <input
                        type="text"
                        value={editName}
                        // Mettre à jour le nom modifié à chaque frappe
                        onChange={(e) => setEditName(e.target.value)}
                        // Sauvegarder si on appuie sur Entrée
                        onKeyDown={(e) =>
                          e.key === "Enter" && updateUser(user.id)
                        }
                        className="border border-blue-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        autoFocus
                      />
                    ) : (
                      // Mode lecture : afficher le nom
                      <span className="text-gray-800 font-medium">
                        {user.name}
                      </span>
                    )}
                  </td>
                  {/* Colonne Actions */}
                  <td className="px-6 py-4 text-right space-x-2">
                    {editingId === user.id ? (
                      // Si en mode édition : afficher Sauvegarder et Annuler
                      <>
                        {/* Bouton Sauvegarder */}
                        <button
                          onClick={() => updateUser(user.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                        >
                          Save
                        </button>
                        {/* Bouton Annuler - quitter le mode édition */}
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
                      // Si en mode lecture : afficher Modifier et Supprimer
                      <>
                        {/* Bouton Modifier - activer le mode édition pour cet utilisateur */}
                        <button
                          onClick={() => {
                            setEditingId(user.id);
                            setEditName(user.name);
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
                        >
                          Edit
                        </button>
                        {/* Bouton Supprimer - supprimer cet utilisateur */}
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
