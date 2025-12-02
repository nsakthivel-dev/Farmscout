import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";

interface ChatHistoryItem {
  id: string;
  timestamp: number;
  title: string;
  preview: string;
}

export default function RagAssistant() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(() => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('chatHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Load chat history from localStorage whenever the page loads
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Function to add a new chat to history
  const addToHistory = (question: string, answer: string) => {
    const newEntry: ChatHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      title: question.length > 30 ? question.substring(0, 30) + "..." : question,
      preview: answer.length > 50 ? answer.substring(0, 50) + "..." : answer
    };

    const updatedHistory = [newEntry, ...chatHistory.slice(0, 19)]; // Keep only last 20 items
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  // Function to clear all history
  const clearAllHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('chatMessages');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 text-primary">AI Assistant</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ask questions about crops, pests, diseases, or specific document content. 
            I can help with both general agriculture knowledge and specific information from your documents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* History Sidebar */}
          <div className="col-span-1 hidden lg:block">
            <div className="bg-white rounded-lg shadow-lg border h-[70vh] flex flex-col">
              <div className="border-b p-3 flex justify-between items-center bg-muted/50">
                <h3 className="font-semibold">Chat History</h3>
                {chatHistory.length > 0 && (
                  <button
                    onClick={clearAllHistory}
                    className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/80 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm p-4">
                    No chat history yet. Start a conversation to see history here.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chatHistory.map((item) => (
                      <div 
                        key={item.id}
                        className="p-3 rounded border cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="font-medium text-sm truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">{item.preview}</div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Chat Window */}
          <div className="col-span-1 lg:col-span-3">
            <ChatWindow onAddToHistory={addToHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}