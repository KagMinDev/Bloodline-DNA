// 🧪 Gửi dữ liệu mẫu test
export interface SampleTestRequest {
  kitId: string;
  sampleCode: string;
  donorName: string;
  relationshipToSubject: number; // gửi dưới dạng số
  collectedById: string;
  collectedAt: Date;
  sampleType: number; // gửi dưới dạng số
  labReceivedAt: Date;
}

// ✅ Nhận dữ liệu từ API
export interface SampleTestResponse {
  id: string;
  kitId: string;
  sampleCode: string;
  donorName: string;
  relationshipToSubject: number; // giữ nguyên số để map label
  sampleType: number;            // giữ nguyên số để map label
  collectedById: string;
  collectedAt: Date;
  labReceivedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  kit: {
    id: string;
    bookingId: string;
    shippedAt: Date;
    receivedAt: Date;
    sentToLabAt: Date;
    labReceivedAt: Date;
    note: string;
    samples: string[];
    sampleCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface SampleTestUpdateRequest {
  id: string;
  sampleCode: string;
  donorName: string;
  relationshipToSubject: number;
  sampleType: number;
  collectedById: string;
  collectedAt: Date;
  labReceivedAt: Date;
}

// 🇻🇳 Mối quan hệ (RelationshipToSubject) enum → Tiếng Việt
export const RelationshipToSubjectLabelVi: Record<number, string> = {
  0: "Không xác định",
  1: "Cha",
  2: "Mẹ",
  3: "Con",
  4: "Ông",
  5: "Bà",
  6: "Cháu",
  7: "Anh/Em trai",
  8: "Chị/Em gái",
  9: "Chú/Bác/Cậu",
  10: "Cô/Dì",
  11: "Cháu trai",
  12: "Cháu gái",
  99: "Khác",
};

// 🇻🇳 Loại mẫu (SampleType) enum → Tiếng Việt
export const SampleTypeLabelVi: Record<number, string> = {
  0: "Không xác định",
  1: "Tăm bông miệng",
  2: "Máu",
  3: "Tóc có chân",
  4: "Móng tay",
  5: "Nước bọt",
  6: "Mẫu khác",
};

// 🧠 (Tùy chọn) Hàm lấy chuỗi từ mã số:
export const getRelationshipLabelVi = (value: number) =>
  RelationshipToSubjectLabelVi[value] || "Không xác định";

export const getSampleTypeLabelVi = (value: number) =>
  SampleTypeLabelVi[value] || "Không xác định";
