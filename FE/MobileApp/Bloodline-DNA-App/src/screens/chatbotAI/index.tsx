import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { sendMessage } from "./api/chatbotAI.api";
import { styles } from "./styles";

type ChatMsg = { sender: "user" | "bot"; text: string };

const ChatbotAI: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: "bot",
      text: "👋 Chào bạn! Tôi là trợ lý hỗ trợ tư vấn về dịch vụ xét nghiệm ADN huyết thống. Bạn cần tìm hiểu gì?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  /* ------------------ SEND ------------------ */
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // push tin nhắn của user
    setMessages((prev) => [...prev, { sender: "user", text: inputText }]);
    setIsLoading(true);

    try {
      /* gọi helper đã xử lý lỗi, time‑out, network */
      const { reply } = await sendMessage(inputText);

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (error: unknown) {
      let errMsg = "❗Đã xảy ra lỗi, vui lòng thử lại.";

      if (error instanceof Error) {
        // chuyển sang tiếng Việt nếu là lỗi quá tải
        errMsg = error.message.includes("overloaded")
          ? "⚠️ Gemini đang quá tải, thử lại sau ít phút."
          : `❗${error.message}`;
      }

      setMessages((prev) => [...prev, { sender: "bot", text: errMsg }]);
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  return (
    <>
      {/* FAB */}
      <TouchableOpacity style={styles.chatButton} onPress={toggleChat}>
        <Icon name="wechat" size={20} color="white" />
      </TouchableOpacity>

      {/* Modal chat */}
      <Modal
        visible={isChatOpen}
        animationType="slide"
        transparent
        onRequestClose={toggleChat}
      >
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitle}>
                <Icon name="wechat" size={18} color="white" />
                <Text style={styles.headerText}>
                  Chat tư vấn ADN huyết thống
                </Text>
              </View>
              <TouchableOpacity onPress={toggleChat}>
                <Icon name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
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
                  {msg.sender === "bot" && (
                    <Icon
                      name="android"
                      size={18}
                      color="#007bff"
                      style={styles.avatarBot}
                    />
                  )}
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
                  {msg.sender === "user" && (
                    <Icon
                      name="user"
                      size={15}
                      color="white"
                      style={styles.avatarUser}
                    />
                  )}
                </View>
              ))}

              {isLoading && (
                <View style={styles.messageLeft}>
                  <View style={styles.botBubble}>
                    <ActivityIndicator size="small" color="#000" />
                    <Text style={styles.botText}> Đang trả lời...</Text>
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
        </View>
      </Modal>
    </>
  );
};

export default ChatbotAI;
