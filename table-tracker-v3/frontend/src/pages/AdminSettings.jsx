import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function AdminSettings() {
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });

  useEffect(() => {
    fetchUsers();
    fetchTables();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/auth/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/tables`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/auth/register`,
        newUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewUser({ username: '', password: '', role: 'staff' });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/auth/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateTablePrice = async (tableId, newPrice) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/tables/${tableId}/price`,
        { price_per_minute: parseFloat(newPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTables();
    } catch (error) {
      console.error('Error updating table price:', error);
    }
  };

  const clearTableData = async (tableId) => {
    if (window.confirm('Are you sure you want to clear all session data for this table?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${API_URL}/tables/${tableId}/sessions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Table data cleared successfully');
      } catch (error) {
        console.error('Error clearing table data:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Settings</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          
          {/* Add User Form */}
          <form onSubmit={addUser} className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Add User
            </button>
          </form>
          
          {/* Users List */}
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span>{user.username} ({user.role})</span>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Table Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Table Settings</h2>
          
          <div className="space-y-4">
            {tables.map((table) => (
              <div key={table.id} className="p-4 border rounded">
                <h3 className="font-bold">{table.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span>Price: ₹</span>
                  <input
                    type="number"
                    step="0.1"
                    value={table.price_per_minute}
                    onChange={(e) => updateTablePrice(table.id, e.target.value)}
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <span>/min</span>
                </div>
                <button
                  onClick={() => clearTableData(table.id)}
                  className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Clear Data
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
