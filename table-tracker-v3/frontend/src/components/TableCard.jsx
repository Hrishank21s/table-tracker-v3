import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function TableCard({ table, user }) {
  const [activeSession, setActiveSession] = useState(null);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [splitPlayers, setSplitPlayers] = useState(1);
  const [history, setHistory] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);

  useEffect(() => {
    fetchActiveSession();
    fetchHistory();
  }, [table.id]);

  useEffect(() => {
    let interval;
    if (activeSession && !isPaused) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(activeSession.start_time);
        const elapsed = Math.floor((now - start - pausedTime) / 1000);
        setElapsedTime(elapsed);
        
        const minutes = Math.ceil(elapsed / 60);
        const amount = Math.ceil(minutes * table.price_per_minute);
        setCurrentAmount(amount);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession, isPaused, pausedTime, table.price_per_minute]);

  const fetchActiveSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/sessions/active/${table.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveSession(response.data);
    } catch (error) {
      console.error('Error fetching active session:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/sessions/table/${table.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const startSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/sessions/start`,
        { table_id: table.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveSession(response.data);
      setCurrentAmount(0);
      setElapsedTime(0);
      setPausedTime(0);
      setIsPaused(false);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/sessions/${activeSession.id}/end`,
        { split_players: splitPlayers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveSession(null);
      setCurrentAmount(0);
      setElapsedTime(0);
      setPausedTime(0);
      setIsPaused(false);
      setSplitPlayers(1);
      fetchHistory();
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const togglePause = () => {
    if (isPaused) {
      // Resume
      const now = new Date();
      const pauseDuration = now - new Date(pausedTime);
      setPausedTime(prev => prev + pauseDuration);
    } else {
      // Pause
      setPausedTime(new Date());
    }
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateSplit = () => {
    if (splitPlayers > 1 && currentAmount > 0) {
      return Math.ceil(currentAmount / splitPlayers);
    }
    return currentAmount;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-2">
      <h3 className="text-xl font-bold mb-4 text-center">
        {table.name}
      </h3>
      
      <div className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-blue-600">
            {formatTime(elapsedTime)}
          </div>
          <div className="text-sm text-gray-500">
            Rate: ₹{table.price_per_minute}/min
          </div>
        </div>

        {/* Current Amount */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            ₹{currentAmount}
          </div>
          <div className="text-sm text-gray-500">Current Amount</div>
        </div>

        {/* Split Section */}
        {activeSession && (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={splitPlayers}
              onChange={(e) => setSplitPlayers(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border rounded text-center"
            />
            <span className="text-sm">players</span>
            <button
              onClick={() => setSplitPlayers(prev => prev)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Split
            </button>
            {splitPlayers > 1 && (
              <span className="text-sm font-bold">
                ₹{calculateSplit()} each
              </span>
            )}
          </div>
        )}

        {/* Control Buttons */}
        <div className="space-y-2">
          {!activeSession ? (
            <button
              onClick={startSession}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Start
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={togglePause}
                className={`w-full font-bold py-2 px-4 rounded ${
                  isPaused 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={endSession}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                End
              </button>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="mt-6">
          <h4 className="font-bold mb-2">Recent History</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {history.slice(0, 5).map((session) => (
              <div key={session.id} className="text-xs bg-gray-100 p-2 rounded">
                <div>₹{session.total_amount} • {session.total_minutes}min</div>
                {session.split_players > 1 && (
                  <div className="text-gray-600">Split-{session.split_players} players</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableCard;
