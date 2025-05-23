import { WechatOutlined, WechatWorkOutlined } from "@ant-design/icons";
import { Button, Input, Spin } from "antd";
import axios from "axios";
import { XCircle } from "lucide-react";
import { useState } from "react";

const Chatbot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    {
      sender: "bot",
      text: "👋 Chào bạn! Tôi là trợ lý hỗ trợ xét nghiệm ADN. Bạn cần giúp gì?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: inputText }]);
    setIsLoading(true);

    try {
      const response = await axios.post("/api/openai", {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Bạn là một chatbot hỗ trợ khách hàng về xét nghiệm ADN huyết thống. Trả lời bằng tiếng Việt, chuyên nghiệp, thân thiện, và cung cấp thông tin chính xác liên quan đến xét nghiệm ADN.",
          },
          {
            role: "user",
            content: inputText,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const botReply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❗Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        },
      ]);
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
        <WechatWorkOutlined size={24} />
      </Button>

      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 text-white bg-blue-600 rounded-t-xl">
            <div className="flex items-center gap-2">
              <WechatOutlined style={{ fontSize: 20}} />
              <span className="text-base font-medium">Chat hỗ trợ DNA</span>
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
          <div className="p-3 bg-white border-t">
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

export default Chatbot;
