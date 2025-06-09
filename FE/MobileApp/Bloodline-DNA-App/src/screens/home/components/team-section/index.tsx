import React from "react";
import { Dimensions, FlatList, Image, Text, View } from "react-native";
import { TeamMember } from "../../../../types/home/home.types";
import { styles } from "./styles";

const { width } = Dimensions.get("window");

const team: TeamMember[] = [
  {
    name: "TS. Nguyễn Minh",
    title: "Chuyên gia Di truyền học",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "PGS. Trần Hương",
    title: "Chuyên gia Phân tích ADN",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "BS. Lê Quang",
    title: "Tư vấn Huyết thống",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "ThS. Phạm Linh",
    title: "Chuyên viên Phòng thí nghiệm",
    image: ""
  },
];

const TeamSection: React.FC = () => {
  // Tính số cột dựa trên chiều rộng màn hình
  const numColumns = width > 1024 ? 4 : width > 768 ? 2 : 1;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Đội ngũ chuyên gia của chúng tôi</Text>
        <FlatList
          data={team}
          keyExtractor={(_, index) => index.toString()}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <View style={styles.memberCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.titleText}>{item.title}</Text>
            </View>
          )}
          key={numColumns.toString()} // Cập nhật key khi số cột thay đổi
          columnWrapperStyle={
            numColumns > 1 ? styles.columnWrapper : undefined
          }
        />
      </View>
    </View>
  );
};

export default TeamSection;