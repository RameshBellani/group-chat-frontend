import React, { useState, useEffect } from "react";

interface NavbarProps {
  socket: any;
  setRoom: (room: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ socket, setRoom }) => {
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("get_rooms");
    socket.on("room_list", (roomList: string[]) => {
      setRooms(roomList);
    });

    return () => socket.off("room_list");
  }, [socket]);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-lg font-bold">Chat App</div>
      <div className="flex items-center space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded"
          onClick={() => socket.emit("get_rooms")}
        >
          Refresh Rooms
        </button>
        <div className="relative">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded">
            Rooms ({rooms.length})
          </button>
          <ul className="absolute bg-white text-black rounded shadow-md mt-2 hidden group-hover:block">
            {rooms.map((room) => (
              <li
                key={room}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => setRoom(room)}
              >
                {room}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
