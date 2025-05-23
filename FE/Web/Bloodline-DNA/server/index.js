import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DOCUMENT = `
DỊCH VỤ XÉT NGHIỆM ADN HUYẾT THỐNG

1. Khái niệm xét nghiệm ADN huyết thống
- Xét nghiệm ADN huyết thống là phương pháp khoa học sử dụng phân tích ADN để xác định mối quan hệ huyết thống giữa các cá nhân, như cha-con, mẹ-con, hoặc anh chị em.
- Dựa trên việc so sánh các đoạn ADN (locus) để xác định mức độ tương đồng di truyền.

2. Quy trình xét nghiệm ADN
- Thu thập mẫu: Mẫu ADN thường được lấy từ niêm mạc miệng (tế bào má), máu, hoặc tóc có chân.
- Phân tích mẫu: Sử dụng công nghệ PCR (Polymerase Chain Reaction) và giải trình tự ADN để xác định các marker di truyền.
- So sánh và báo cáo: Kết quả được phân tích để xác định xác suất huyết thống (thường đạt 99,9% trở lên nếu có quan hệ).

3. Độ chính xác và ý nghĩa
- Độ chính xác: Xét nghiệm ADN có độ chính xác cao, thường trên 99,9% khi xác định quan hệ huyết thống.
- Ý nghĩa: Giúp xác định quan hệ gia đình, giải quyết tranh chấp pháp lý (như quyền nuôi con), hoặc hỗ trợ thủ tục di trú.

4. Ứng dụng của xét nghiệm ADN huyết thống
- Pháp lý: Cung cấp bằng chứng trong các vụ kiện dân sự, như xác định cha mẹ trong tranh chấp thừa kế.
- Cá nhân: Xác định mối quan hệ gia đình để giải đáp thắc mắc cá nhân.
- Y khoa: Hỗ trợ chẩn đoán bệnh di truyền hoặc tìm người hiến tạng phù hợp.

5. Thực tiễn tại Việt Nam
- Các trung tâm xét nghiệm ADN uy tín tại Việt Nam, như Viện Công nghệ Sinh học, cung cấp dịch vụ đạt chuẩn quốc tế.
- Quy định pháp luật: Kết quả xét nghiệm ADN được công nhận trong các vụ án dân sự nếu được thực hiện bởi cơ sở được cấp phép.
- Chi phí: Tùy thuộc vào loại xét nghiệm, dao động từ vài triệu đến chục triệu đồng.

Câu hỏi:
Xét nghiệm ADN huyết thống có thể được sử dụng trong những trường hợp nào tại Việt Nam, và độ chính xác của nó ra sao?

Trả lời:
1. Trả lời: Xét nghiệm ADN huyết thống tại Việt Nam được sử dụng trong các trường hợp pháp lý (như xác định quyền nuôi con, thừa kế), cá nhân (xác định quan hệ gia đình), và y khoa (chẩn đoán bệnh di truyền). Độ chính xác của xét nghiệm đạt trên 99,9% khi xác định quan hệ huyết thống.
2. Giải thích và ví dụ: Xét nghiệm ADN huyết thống hoạt động bằng cách so sánh các đoạn ADN giữa hai cá nhân, giống như so sánh hai cuốn sách để tìm những trang giống nhau. Ví dụ, trong một vụ tranh chấp quyền nuôi con, xét nghiệm ADN có thể xác định chính xác người cha để宣告 quyền nuôi con.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const formattedHistory = history
      .map((msg) => {
        const role = msg.sender === "user" ? "Bạn" : "Chatbot";
        return `${role}: ${msg.text}`;
      })
      .join("\n");

    const prompt = `
You are a chatbot designed to assist users studying "Dịch vụ xét nghiệm ADN huyết thống" in Vietnam. Your role is to provide clear, concise, and academically rigorous explanations based **only** on the provided document. Follow these guidelines:

- **Response Format**: Structure responses in a formal, academic style with the following sections:
  1. **Trả lời**: Provide a direct, precise answer to the question, using formal language suitable for academic study.
  2. **Giải thích và ví dụ**: Elaborate on the answer with a clear explanation in simple, user-friendly terms, incorporating a relatable analogy (e.g., comparing DNA testing to matching puzzle pieces) to enhance understanding.
  3. **Câu hỏi ôn tập**: Suggest 1-2 relevant study questions to deepen the user's understanding of the topic, phrased in an academic tone.
- **Contextual Continuity**: Use the conversation history to ensure responses are coherent and contextually relevant. Reference previous questions or answers if they relate to the current question to maintain a seamless conversation flow (e.g., "Như đã đề cập trước đó").
- **General Learning Requests**: If the user expresses a desire to learn the subject (e.g., "Tôi muốn học môn này"), provide a structured study guide with:
  - Clear steps to approach the topic.
  - Key concepts to focus on.
  - Practical applications, all based on the document.
- **Unrelated Questions**: If the question is unrelated to the document, respond politely: "Kính thưa bạn, tôi chỉ có thể trả lời các câu hỏi liên quan đến tài liệu về dịch vụ xét nghiệm ADN huyết thống. Bạn có muốn tìm hiểu thêm về chủ đề này không?" Avoid repeating this unnecessarily if the user has already clarified their focus on the topic.
- **Language**: Respond in Vietnamese, using formal yet accessible language suitable for users, ensuring accuracy and adherence to the document.

Document:
${DOCUMENT}
Conversation History:
${formattedHistory}

Current Question: ${message}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply =
      completion.choices[0].message.content || "Không có câu trả lời phù hợp.";

    res.json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
