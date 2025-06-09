import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "./styles";

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
      const error = err as AxiosError<{ error?: string; details?: string }>;
      console.error("Lỗi gọi backend:", error.response?.data || error.message);

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
      <TouchableOpacity style={styles.chatButton} onPress={toggleChat}>
        <Icon name="wechat" size={24} color="white" />
      </TouchableOpacity>

      {isChatOpen && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.chatContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Icon name="wechat" size={18} color="white" />
              <Text style={styles.headerText}>Chat tư vấn ADN huyết thống</Text>
            </View>
            <TouchableOpacity onPress={toggleChat}>
              <Icon name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Message Area */}
          <ScrollView style={styles.messages}>
            {messages.map((msg, i) => (
              <View
                key={i}
                style={[
                  styles.messageContainer,
                  msg.sender === "user"
                    ? styles.messageRight
                    : styles.messageLeft,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.sender === "user"
                      ? styles.userBubble
                      : styles.botBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.sender === "user"
                        ? styles.userText
                        : styles.botText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}

            {isLoading && (
              <View style={styles.messageLeft}>
                <View style={styles.botBubble}>
                  <ActivityIndicator size="small" color="#000" />
                  <Text style={styles.botText}> Đang xử lý...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputArea}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập câu hỏi..."
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={isLoading}
            >
              <Text style={styles.sendText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default ChatbotAI;
