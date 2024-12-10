import { useState } from "react";
import { io } from "socket.io-client";
import Chat from "./components/Chat";
import './App.css'
const socket = io('https://group-chat-backend-urgu.onrender.com');

const App = () => {
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const joinRoom = async () => {
    try {
      setLoading(true);
      if (username !== "" && room !== "") {
        await socket.emit("join_room", { username, room });
        setShowChat(true);
      }
    } catch (error) {
      setError("Failed to join the room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      {!showChat ? (
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg text-center">
          <img
            src="https://res.cloudinary.com/dwffepf9q/image/upload/v1701420370/d0lroksyakj08y70bpwr.png"
            alt="Chat"
            className="max-w-full mb-6 rounded-lg"
          />
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">Join A Chat</h1>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full p-3 mb-4 border rounded-lg text-gray-700"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter room ID"
            className="w-full p-3 mb-6 border rounded-lg text-gray-700"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            onClick={joinRoom}
            className="w-full p-3 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center">
                <svg
                  className="w-6 h-6 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0116 0"
                  ></path>
                </svg>
              </div>
            ) : (
              "Join A Room"
            )}
          </button>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
};

export default App;
