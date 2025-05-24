// import { NextRequest, NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const DOCUMENT = `
// CHƯƠNG 4: DÂN CHỦ XÃ HỘI CHỦ NGHĨA VÀ NHÀ NƯỚC XÃ HỘI CHỦ NGHĨA
// II. NHÀ NƯỚC XÃ HỘI CHỦ NGHĨA

// 1. Khái niệm nhà nước xã hội chủ nghĩa
// - Là hình thức tổ chức quyền lực chính trị của giai cấp công nhân, dưới sự lãnh đạo của Đảng Cộng sản.
// - Là công cụ để bảo vệ lợi ích của nhân dân lao động, hướng tới xây dựng xã hội công bằng, dân chủ, văn minh.

// 2. Bản chất của nhà nước xã hội chủ nghĩa
// - Mang bản chất giai cấp công nhân, đồng thời thể hiện tính nhân dân rộng rãi và tính dân tộc sâu sắc.
// - Khác biệt với nhà nước tư sản ở chỗ không nhằm duy trì sự thống trị giai cấp bóc lột, mà nhằm thủ tiêu sự áp bức giai cấp, xây dựng xã hội không có giai cấp.

// 3. Chức năng của nhà nước xã hội chủ nghĩa
// - Chức năng chính trị: Duy trì sự ổn định chính trị, bảo vệ chế độ xã hội chủ nghĩa.
// - Chức năng kinh tế: Tổ chức và điều hành nền kinh tế theo định hướng XHCN.
// - Chức năng xã hội: Bảo đảm quyền lợi cho nhân dân, phát triển văn hóa, giáo dục, y tế, an sinh xã hội.
// - Chức năng đối ngoại: Tăng cường hợp tác quốc tế vì hòa bình và phát triển.

// 4. Hình thức tổ chức và nguyên tắc hoạt động
// - Nhà nước pháp quyền XHCN dưới sự lãnh đạo của Đảng.
// - Bảo đảm quyền lực thuộc về nhân dân, thực hiện nguyên tắc tập trung dân chủ.
// - Quản lý xã hội bằng pháp luật, gắn với đạo đức và văn hóa.

// III. DÂN CHỦ XÃ HỘI CHỦ NGHĨA VÀ NHÀ NƯỚC PHÁP QUYỀN XÃ HỘI CHỦ NGHĨA Ở VIỆT NAM
// 1. Dân chủ xã hội chủ nghĩa ở Việt Nam

// 1. Khái niệm và đặc trưng
// - Dân chủ XHCN là nền dân chủ của đại đa số nhân dân, đảm bảo quyền làm chủ của nhân dân trên tất cả các lĩnh vực.
// - Đặc trưng: Là dân chủ gắn liền với kỷ cương, pháp luật, dưới sự lãnh đạo của Đảng.

// 2. Vai trò của dân chủ XHCN ở Việt Nam
// - Là mục tiêu, đồng thời là động lực của sự nghiệp đổi mới.
// - Góp phần phát huy sức mạnh đại đoàn kết dân tộc, thúc đẩy phát triển kinh tế - xã hội.

// 3. Biểu hiện của dân chủ trong các lĩnh vực
// - Chính trị: Quyền bầu cử, ứng cử, giám sát các hoạt động của cơ quan nhà nước.
// - Kinh tế: Tham gia quản lý kinh tế, sở hữu tư liệu sản xuất.
// - Văn hóa - xã hội: Quyền học tập, tiếp cận thông tin, tự do tín ngưỡng, tôn giáo.

// 4. Thực tiễn phát triển dân chủ XHCN ở Việt Nam
// - Hiến pháp và pháp luật ngày càng hoàn thiện.
// - Các thiết chế dân chủ như Quốc hội, Hội đồng nhân dân các cấp, MTTQ và các tổ chức chính trị - xã hội ngày càng được củng cố.
// - Công cuộc phòng chống tham nhũng, cải cách hành chính được đẩy mạnh nhằm tăng cường tính minh bạch, trách nhiệm giải trình.

// Câu hỏi:
// Mô hình tam quyền phân lập được xem là mô hình đối trọng, hạn chế quyền lực tốt nhất. Ở Việt Nam hiện nay mô hình này có được áp dụng trong cách thức tổ chức quyền lực nhà nước không? Liệu rằng vi phạm mô hình này có phải quyền lực nhà nước đang tập trung quá lớn vào tay một cá nhân không?

// Trả lời:
// Ở Việt Nam hiện nay, không áp dụng mô hình tam quyền phân lập theo kiểu phương Tây, mà thay vào đó là mô hình phân công, phối hợp và kiểm soát giữa các cơ quan quyền lực nhà nước trong việc thực hiện quyền lập pháp, hành pháp và tư pháp.

// 1. Về nguyên tắc tổ chức quyền lực nhà nước ở Việt Nam:
// - Theo Hiến pháp năm 2013, quyền lực nhà nước là thống nhất, có sự phân công, phối hợp và kiểm soát giữa các cơ quan nhà nước trong việc thực hiện các quyền:
//   - Quốc hội thực hiện quyền lập pháp.
//   - Chính phủ thực hiện quyền hành pháp.
//   - Tòa án nhân dân tối cao thực hiện quyền tư pháp.
// - Đảng Cộng sản Việt Nam là lực lượng lãnh đạo Nhà nước và xã hội, nhưng không thay thế các cơ quan nhà nước trong hoạt động quản lý.

// 2. Mục đích khác biệt với tam quyền phân lập:
// - Tam quyền phân lập là mô hình đối trọng giữa ba quyền để kiềm chế lẫn nhau.
// - Ở Việt Nam, mô hình hiện tại không đặt ba quyền này trong trạng thái đối lập, mà nhằm phát huy vai trò lãnh đạo thống nhất của Đảng, bảo đảm sự vận hành thông suốt của bộ máy nhà nước, nhưng vẫn có cơ chế kiểm soát quyền lực thông qua hoạt động giám sát của Quốc hội, kiểm tra của Đảng, giám sát của nhân dân và báo chí.

// 3. Về nguy cơ tập trung quyền lực:
// - Việc không thực hiện mô hình tam quyền phân lập không có nghĩa là quyền lực tập trung vào một cá nhân duy nhất.
// - Trong mô hình của Việt Nam, quyền lực thuộc về tập thể nhân dân, được thực hiện thông qua bộ máy nhà nước và dưới sự giám sát của nhiều cơ quan.
// - Cơ chế kiểm soát quyền lực ngày càng được hoàn thiện, ví dụ như tăng cường minh bạch, trách nhiệm giải trình, cải cách tư pháp, tăng cường giám sát cán bộ, công chức.

// Kết luận:
// Việt Nam không áp dụng mô hình tam quyền phân lập, mà vận hành theo nguyên tắc quyền lực nhà nước là thống nhất, có sự phân công và phối hợp chặt chẽ. Điều này không đồng nghĩa với việc quyền lực tập trung vào một cá nhân, mà là nhằm bảo đảm sự lãnh đạo thống nhất và hiệu quả của Nhà nước dưới sự lãnh đạo của Đảng. Cơ chế kiểm soát quyền lực vẫn đang được cải tiến để ngăn ngừa lạm quyền và đảm bảo dân chủ.
// `;

// export async function POST(req: NextRequest) {
//     try {
//       const { message, history } = await req.json();
  
//       if (!message) {
//         return NextResponse.json({ error: 'No message provided' }, { status: 400 });
//       }
  
//       // Format chat history for the prompt
//       const formattedHistory = history
//         .map((msg: { sender: string; text: string }) => {
//           const role = msg.sender === 'user' ? 'Bạn' : 'Chatbot';
//           return `${role}: ${msg.text}`;
//         })
//         .join('\n');
  
//       const prompt = `
//   You are a chatbot designed to assist students studying "Dân chủ xã hội chủ nghĩa và nhà nước xã hội chủ nghĩa" in Vietnam. Your role is to provide clear, concise, and academically rigorous explanations based **only** on the provided document. Follow these guidelines:
  
//   - **Response Format**: Structure responses in a formal, academic style with the following sections:
//     1. **Trả lời**: Provide a direct, precise answer to the question, using formal language suitable for academic study.
//     2. **Giải thích và ví dụ**: Elaborate on the answer with a clear explanation in simple, student-friendly terms, incorporating a relatable analogy (e.g., comparing the state to a school council) to enhance understanding.
//     3. **Câu hỏi ôn tập**: Suggest 1-2 relevant study questions to deepen the student's understanding of the topic, phrased in an academic tone.
//   - **Contextual Continuity**: Use the conversation history to ensure responses are coherent and contextually relevant. Reference previous questions or answers if they relate to the current question to maintain a seamless conversation flow (e.g., "Như đã đề cập trước đó").
//   - **General Learning Requests**: If the user expresses a desire to learn the subject (e.g., "Tôi muốn học môn này"), provide a structured study guide with:
//     - Clear steps to approach the topic.
//     - Key concepts to focus on.
//     - Practical applications, all based on the document.
//   - **Unrelated Questions**: If the question is unrelated to the document, respond politely: "Kính thưa bạn, tôi chỉ có thể trả lời các câu hỏi liên quan đến tài liệu về dân chủ xã hội chủ nghĩa và nhà nước xã hội chủ nghĩa. Bạn có muốn tìm hiểu thêm về chủ đề này không?" Avoid repeating this unnecessarily if the user has already clarified their focus on the topic.
//   - **Language**: Respond in Vietnamese, using formal yet accessible language suitable for students, ensuring accuracy and adherence to the document.
  
//   Document:
//     ${DOCUMENT}
//   Conversation History:
//   ${formattedHistory}
  
//   Current Question: ${message}
//   `;
  
//     const completion = await openai.chat.completions.create({
//       model: 'gpt-4.1-nano',
//       messages: [
//         { role: 'system', content: prompt },
//         { role: 'user', content: message },
//       ],
//       max_tokens: 500,
//       temperature: 0.7,
//     });

//     const reply = completion.choices[0].message.content || 'Không có câu trả lời phù hợp.';

//     return NextResponse.json({ reply });
//   } catch (error) {
//     console.error('API Error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }