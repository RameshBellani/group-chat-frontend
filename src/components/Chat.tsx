import { useEffect, useState } from "react";

interface User {
  username: string;
  id: string;
  status: string;
}

interface Message {
  room: string;
  author: string;
  message: string;
  time: string;
}

interface ChatProps {
  socket: any;
  username: string;
  room: string;
}

const CustomAvatar = ({ username, status }: { username: string; status: string }) => {
  const avatarContent = username ? username[0].toUpperCase() : "";
  const avatarColor = status === "online" ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`w-10 h-10 rounded-full ${avatarColor} text-white flex justify-center items-center mr-2`}>
      {avatarContent}
    </div>
  );
};

const Chat = ({ socket, username, room }: ChatProps) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on("chat_history", (history: Message[]) => {
      setMessageList(history);
    });

    return () => {
      socket.off("chat_history");
    };
  }, [socket]);

  useEffect(() => {
    const handleDisconnecting = () => {
      socket.emit("disconnecting");
    };

    window.addEventListener("beforeunload", handleDisconnecting);

    return () => {
      window.removeEventListener("beforeunload", handleDisconnecting);
    };
  }, [socket]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data: Message) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    socket.on("update_users", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on("typing_users", (typingData: string[]) => {
      setTypingUsers(typingData);
    });

    return () => {
      socket.off("update_users");
      socket.off("typing_users");
    };
  }, [socket]);

  const isUserTyping = (userId: string) => typingUsers.includes(userId);

  return (
        <div className="flex flex-col md:flex-row w-full h-screen">
  {/* Chat Window */}
  <div className="flex-1 bg-white shadow-lg p-4 h-full flex flex-col">
    {/* Header */}
    <div className="flex items-center bg-gray-200 p-4">
      <CustomAvatar username={username} status="online" />
      <h2 className="text-xl font-semibold ml-2">Live Chat - {username}</h2>
    </div>

    {/* Message List */}
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {messageList.map((messageContent, index) => (
          <div
            key={index}
            className={`flex ${
              username === messageContent.author ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`$ {
                username === messageContent.author ? "bg-green-500" : "bg-blue-400"
              } text-white rounded-lg p-2 max-w-[80%] break-words`}
            >
              <p>{messageContent.message}</p>
            </div>
            <div className="flex text-xs mt-1 ml-2">
              <span>{messageContent.time}</span>
              <span className="ml-1 font-bold">{messageContent.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Message Input */}
    <div className="p-4 flex items-center">
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        value={currentMessage}
        placeholder="Type a message..."
        onChange={(event) => setCurrentMessage(event.target.value)}
        onKeyPress={(event) => event.key === "Enter" && sendMessage()}
      />
      <button
        className="ml-2 p-2 bg-blue-500 text-white rounded-md"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  </div>

  {/* Online Users List */}
  <div
    className="bg-blue-100 p-4 md:w-[300px] md:flex-shrink-0 hidden md:block"
  >
    <h3 className="text-2xl font-bold italic">Online Users</h3>
    <ul>
      {users.map((user) => (
        <li key={user.username} className="flex items-center space-x-2">
          <CustomAvatar username={user.username} status={user.status} />
          <span className="text-lg font-semibold">{user.username}</span>
          <span className="text-sm text-gray-500">({user.status})</span>
          {isUserTyping(user.id) && (
            <span className="ml-2 text-sm italic">Typing...</span>
          )}
        </li>
      ))}
    </ul>
  </div>
</div>
  );
};

export default Chat;

