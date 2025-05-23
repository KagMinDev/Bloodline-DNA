import { WechatOutlined, WechatWorkOutlined } from "@ant-design/icons";
import { Button, Input, Spin } from "antd";
import axios, { AxiosError } from "axios";
import { XCircle } from "lucide-react";
import { useState } from "react";

const ChatbotAI: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    {
      sender: "bot",
      text: "👋 Chào bạn! Tôi là trợ lý hỗ trợ tư vấn về dịch vụ xét nghiệm ADN huyết thống. Bạn cần tìm hiểu gì?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Thêm tin nhắn người dùng
    setMessages((prev) => [...prev, { sender: "user", text: inputText }]);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/openai", {
        message: inputText,
        history: messages,
      });

      const botReply = response.data.reply;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      // Gõ err là AxiosError hoặc unknown
      const error = err as AxiosError<{ error?: string; details?: string }>;
      console.error("Lỗi gọi backend:", error.response?.data || error.message);

      // Xử lý lỗi chi tiết
      const errorMessage = error.response?.data?.details
        ? `Lỗi: ${error.response.data.details}`
        : "❗Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";
      setMessages((prev) => [...prev, { sender: "bot", text: errorMessage }]);
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed z-50 p-4 text-white bg-blue-600 rounded-full shadow-lg bottom-6 right-6 hover:bg-blue-700"
        style={{
          boxShadow: "0 4px 20px rgba(0, 123, 255, 1)",
          borderRadius: "100%",
          background: "rgba(0, 123, 255, 1)",
          color: "white",
          fontSize: "30px",
          padding: "10px",
          height: "60px",
          width: "60px",
        }}
      >
        <WechatWorkOutlined style={{ fontSize: 24 }} />
      </Button>

      {isChatOpen && (
        <div className="fixed bottom-26 right-9 w-[360px] h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-xl shadow-[0_4px_20px_rgba(0,123,255,0.3)] border-b-2 border-blue-800">
          <div className="flex items-center gap-2">
              <WechatOutlined style={{ fontSize: 20 }} />
              <span className="text-base font-medium">Chat tư vấn ADN huyết thống</span>
            </div>
            <Button
              onClick={toggleChat}
              icon={<XCircle size={20} />}
              className="hover:bg-blue-700"
            />
          </div>

          {/* Message area */}
          <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[75%] text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 bg-gray-200 rounded-xl">
                  <Spin size="small" /> <span>Đang xử lý...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-3 bg-white border-gray-200 border-t-1">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập câu hỏi..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPressEnter={handleSendMessage}
                disabled={isLoading}
              />
              <Button
                type="primary"
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-600"
              >
                Gửi
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotAI;