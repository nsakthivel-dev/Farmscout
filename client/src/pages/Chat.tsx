import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, Mic, Image as ImageIcon, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useRouteChange } from "@/hooks/useRouteChange"; // Import our custom hook

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  timestamp: Date;
  messages: Message[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load saved session if exists
    const savedSession = localStorage.getItem('currentChatSession');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        return parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error("Failed to parse saved session", e);
      }
    }
    
    // Default welcome message
    return [
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AI farming assistant. I can help you diagnose crop diseases, provide treatment advice, and answer questions about farming practices. How can I help you today?",
        timestamp: new Date(),
      },
    ];
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save chat session to localStorage whenever messages change
  useEffect(() => {
    const session: ChatSession = {
      id: "current-session",
      timestamp: new Date(),
      messages: messages
    };
    localStorage.setItem('currentChatSession', JSON.stringify(session));
  }, [messages]);

  // Handle route changes to save chat to history
  useRouteChange(() => {
    // Add current session to chat history
    const session: ChatSession = {
      id: Date.now().toString(),
      timestamp: new Date(),
      messages: messages
    };
    
    // Get existing history or initialize empty array
    const chatHistoryStr = localStorage.getItem('chatHistory');
    let chatHistory: ChatSession[] = chatHistoryStr ? JSON.parse(chatHistoryStr) : [];
    
    // Add current session to history (limit to 20 recent sessions)
    chatHistory = [session, ...chatHistory.slice(0, 19)];
    
    // Save updated history
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
    // Remove current session since it's now in history
    localStorage.removeItem('currentChatSession');
    
    // Open new tab with the chat page
    window.open('/chat', '_blank');
  });

  // Handle page unload/close to save chat to history
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Add current session to chat history
      const session: ChatSession = {
        id: Date.now().toString(),
        timestamp: new Date(),
        messages: messages
      };
      
      // Get existing history or initialize empty array
      const chatHistoryStr = localStorage.getItem('chatHistory');
      let chatHistory: ChatSession[] = chatHistoryStr ? JSON.parse(chatHistoryStr) : [];
      
      // Add current session to history (limit to 20 recent sessions)
      chatHistory = [session, ...chatHistory.slice(0, 19)];
      
      // Save updated history
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
      
      // Remove current session since it's now in history
      localStorage.removeItem('currentChatSession');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/chat", {
        userId: "guest",
        role: "user",
        content,
      });
    },
    onSuccess: (data: any) => {
      if (data.assistantMessage) {
        const assistantMsg: Message = {
          id: data.assistantMessage.id,
          role: "assistant",
          content: data.assistantMessage.content,
          timestamp: new Date(data.assistantMessage.createdAt),
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    },
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    chatMutation.mutate(userMessage.content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">AI Farming Assistant</h1>
          <p className="text-muted-foreground">
            Get instant answers to your farming questions
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">AI Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">Always active</p>
                </div>
              </div>
              <Badge variant="secondary">Beta</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${message.role}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-muted mt-1">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 bg-primary mt-1">
                    <AvatarFallback>
                      <User className="h-4 w-4 text-primary-foreground" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 bg-muted">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t p-4">
            <Alert className="mb-4">
              <AlertDescription className="text-xs">
                AI responses are for educational purposes. Always verify with local agricultural experts.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" data-testid="button-upload-image">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" data-testid="button-voice-input">
                <Mic className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                data-testid="input-chat-message"
              />
              <Button onClick={handleSend} disabled={!input.trim()} data-testid="button-send-message">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}