import { useState, useEffect, useRef } from "react";
import {
  MicrophoneIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  SparklesIcon, // Re-add SparklesIcon for AI panel
} from "@heroicons/react/24/outline";

const conversationsDataInitial = [
  {
    id: 1,
    customer: "John Doe",
    lastMessage: "Hey, can you help me with my order?",
    timestamp: "10:30 AM",
    status: "unread",
    messages: [
      { from: "John Doe", text: "Hey, can you help me with my order?", time: "10:30 AM" },
      { from: "Agent", text: "Sure! What seems to be the problem?", time: "10:32 AM" },
    ],
  },
  {
    id: 2,
    customer: "Jane Smith",
    lastMessage: "Thanks for the quick response!",
    timestamp: "9:45 AM",
    status: "read",
    messages: [
      { from: "Jane Smith", text: "Thanks for the quick response!", time: "9:45 AM" },
    ],
  },
];

export default function ChatLayout() {
  // Existing customer chat states
  const [conversationsData, setConversationsData] = useState(conversationsDataInitial);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activePanel, setActivePanel] = useState("chat");
  const messagesEndRef = useRef(null);

  const filteredConversations = conversationsData.filter((conv) =>
    conv.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = conversationsData.find(
    (conv) => conv.id === selectedConversationId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageText, selectedConversationId, conversationsData]);

  function handleSendMessage() {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      from: "Agent",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversationsData((prevData) =>
      prevData.map((conv) =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageText,
              timestamp: newMessage.time,
              status: "read",
            }
          : conv
      )
    );

    setMessageText("");
    setIsTyping(false);
  }

  function handleQuickReply(text) {
    setMessageText(text);
    setIsTyping(true);
  }

  // --- AI chat panel states and functionality ---
  const [aiMessages, setAiMessages] = useState([
    {
      id: 0,
      from: "ai",
      text: "Hi! I'm your AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiIsTyping, setAiIsTyping] = useState(false); // New state for AI typing indicator
  const aiMessagesEndRef = useRef(null);

  useEffect(() => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, aiIsTyping]);

  async function handleAiSend() {
    if (!aiInput.trim()) return;

    const userMessage = {
      id: aiMessages.length,
      from: "user",
      text: aiInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Add user message to UI immediately
    setAiMessages((prev) => [...prev, userMessage]);

    // Map messages to OpenAI's 'role' and 'content' format for the backend
    const messagesForApi = [...aiMessages, userMessage].map(msg => ({
        role: msg.from === 'user' ? 'user' : 'assistant', // Assuming 'ai' from backend maps to 'assistant'
        content: msg.text,
    }));

    setAiInput("");
    setAiIsTyping(true); // Show AI typing indicator

    try {
      // **** UPDATED FETCH URL TO YOUR BACKEND ENDPOINT ****
      const response = await fetch('http://localhost:3001/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messagesForApi }), // Send all messages for context
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.reply || 'Failed to get AI response from backend');
      }

      const data = await response.json();
      const aiReply = {
        id: messagesForApi.length, // Use length of all messages as ID
        from: "ai",
        text: data.reply, // Your backend sends back { reply: "..." }
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setAiMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      // Optionally, add an error message to the chat
      setAiMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          from: "ai",
          text: "Sorry, I couldn't get a response from the AI. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setAiIsTyping(false); // Hide AI typing indicator
    }
  }

  function handleAiInputKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAiSend();
    }
  }

  return (
    <main className="flex flex-col md:flex-row h-[600px] w-full md:w-[1000px] overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 mx-auto border border-gray-300 rounded-lg shadow-lg">
      {/* Mobile Nav */}
      <nav className="flex md:hidden justify-around items-center h-12 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <button
          onClick={() => setActivePanel("sidebar")}
          className={`p-2 ${activePanel === "sidebar" ? "text-purple-600" : "text-gray-600"}`}
        >
          <UserGroupIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => setActivePanel("chat")}
          className={`p-2 ${activePanel === "chat" ? "text-purple-600" : "text-gray-600"}`}
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => setActivePanel("ai")}
          className={`p-2 ${activePanel === "ai" ? "text-purple-600" : "text-gray-600"}`}
        >
          <SparklesIcon className="h-6 w-6" />
        </button>
      </nav>

      {/* Sidebar */}
      <aside
        className={`md:block ${activePanel === "sidebar" ? "block" : "hidden"} w-full md:w-1/4 h-full border-r border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800`}
      >
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search conversations..."
          className="w-full mb-4 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {/* Removed overflow-y-auto from here, content might be clipped */}
        <ul className="h-[calc(100%-60px)]"> {/* Adjusted height to fit within parent */}
          {filteredConversations.map(({ id, customer, lastMessage, timestamp, status }) => (
            <li
              key={id}
              onClick={() => {
                setSelectedConversationId(id);
                setActivePanel("chat");
              }}
              className={`p-3 mb-2 rounded-lg cursor-pointer ${
                selectedConversationId === id
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-100 dark:hover:bg-purple-700"
              } ${status === "unread" ? "font-semibold" : "font-normal"} transition`}
            >
              <div className="flex justify-between items-center">
                <span>{customer}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</span>
              </div>
              <div className="text-sm truncate text-gray-700 dark:text-gray-300">{lastMessage}</div>
            </li>
          ))}
          {filteredConversations.length === 0 && (
            <li className="text-center text-gray-500 dark:text-gray-400 mt-4">No conversations found</li>
          )}
        </ul>
      </aside>

      {/* Chat */}
      <section
        className={`${
          activePanel === "chat" ? "flex" : "hidden"
        } md:flex flex-1 flex-col px-4 py-2 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden`}
      >
        {selectedConversation ? (
          <>
            <header className="py-2 border-b border-gray-300 dark:border-gray-700 mb-2">
              <h2 className="text-lg font-semibold truncate">{selectedConversation.customer}</h2>
            </header>

            {/* Removed overflow-y-auto and scrollbar classes from here, content will be clipped */}
            <div className="flex-1 pr-1 space-y-4 mb-4 h-[calc(100%-120px)]"> {/* Adjusted height */}
              {selectedConversation.messages.map(({ from, text, time }, idx) => (
                <div
                  key={idx}
                  className={`max-w-xs break-words p-3 rounded-lg ${
                    from === "Agent"
                      ? "bg-purple-600 text-white self-end ml-auto"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start"
                  }`}
                >
                  <p>{text}</p>
                  <span className="text-xs block mt-1 text-gray-600 dark:text-gray-400">{time}</span>
                </div>
              ))}
              {isTyping && (
                <div className="italic text-gray-500 dark:text-gray-400 ml-2">Agent is typing...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2 border-t border-gray-300 dark:border-gray-700 pt-2"
            >
              <button type="button" className="p-2 text-gray-500 hover:text-purple-600">
                <FaceSmileIcon className="h-6 w-6" />
              </button>
              <button type="button" className="p-2 text-gray-500 hover:text-purple-600">
                <MicrophoneIcon className="h-6 w-6" />
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  setIsTyping(e.target.value.trim().length > 0);
                }}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white disabled:bg-purple-400"
                disabled={!messageText.trim()}
              >
                <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
              </button>
            </form>

            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleQuickReply("Can you please provide more details?")}
                className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-700 dark:hover:bg-purple-600 text-purple-700 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
              >
                More details
              </button>
              <button
                onClick={() => handleQuickReply("Thank you for reaching out!")}
                className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-700 dark:hover:bg-purple-600 text-purple-700 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
              >
                Thanks
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </section>

      {/* AI Assistant Panel */}
      <section
        className={`${
          activePanel === "ai" ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-1/3 border-l border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2`}
      >
        <header className="py-2 border-b border-gray-300 dark:border-gray-700 mb-2">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </header>

        {/* Removed overflow-y-auto and scrollbar classes from here, content will be clipped */}
        <div className="flex-1 space-y-3 mb-4 h-[calc(100%-120px)]"> {/* Adjusted height */}
          {aiMessages.map(({ id, from, text, time }) => (
            <div
              key={id}
              className={`max-w-xs break-words p-3 rounded-lg ${
                from === "ai"
                  ? "bg-purple-600 text-white self-start"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-end ml-auto"
              }`}
            >
              <p>{text}</p>
              <span className="text-xs block mt-1 text-gray-600 dark:text-gray-400">{time}</span>
            </div>
          ))}
          {aiIsTyping && ( // AI typing indicator
            <div className="italic text-gray-500 dark:text-gray-400 ml-2">AI is typing...</div>
          )}
          <div ref={aiMessagesEndRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAiSend();
          }}
          className="flex items-center space-x-2 border-t border-gray-300 dark:border-gray-700 pt-2"
        >
          <button type="button" className="p-2 text-gray-500 hover:text-purple-600">
            <FaceSmileIcon className="h-6 w-6" />
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-purple-600">
            <MicrophoneIcon className="h-6 w-6" />
          </button>
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={handleAiInputKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white disabled:bg-purple-400"
            disabled={!aiInput.trim() || aiIsTyping} // Disable send button while AI is typing
          >
            <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
          </button>
        </form>
      </section>
    </main>
  );
}