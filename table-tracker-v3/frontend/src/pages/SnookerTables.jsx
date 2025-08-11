import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableCard from '../components/TableCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


function SnookerTables({ user }) {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/tables`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const snookerTables = response.data.filter(table => table.type === 'snooker');
      setTables(snookerTables);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Snooker Tables</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {tables.map((table) => (
          <TableCard key={table.id} table={table} user={user} />
        ))}
      </div>
    </div>
  );
}

export default SnookerTables;
