import React, { useState } from "react";

interface JoinRoomProps {
  socket: any;
  setUsername: (username: string) => void;
  setRoom: (room: string) => void;
  setShowChat: (show: boolean) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({
  socket,
  setUsername,
  setRoom,
  setShowChat,
}) => {
  const [usernameInput, setUsernameInput] = useState("");
  const [roomInput, setRoomInput] = useState("");

  const joinRoom = () => {
    if (usernameInput && roomInput) {
      setUsername(usernameInput);
      setRoom(roomInput);
      socket.emit("join_room", { username: usernameInput, room: roomInput });
      setShowChat(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Join A Room</h1>
      <input
        className="mb-2 p-2 border rounded w-full max-w-sm"
        placeholder="Enter Username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
      <input
        className="mb-2 p-2 border rounded w-full max-w-sm"
        placeholder="Enter Room ID"
        value={roomInput}
        onChange={(e) => setRoomInput(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
        onClick={joinRoom}
      >
        Join Room
      </button>
    </div>
  );
};

export default JoinRoom;
