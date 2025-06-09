import React from "react";
import { Dimensions, FlatList, Image, Text, View } from "react-native";
import { TeamMember } from "../../../../types/home/home.types";
import { styles } from "./styles";

const { width } = Dimensions.get("window");

const defaultImage = "https://png.pngtree.com/png-vector/20220901/ourlarge/pngtree-male-doctor-avatar-icon-illustration-png-image_6134271.png";

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
  const numColumns = width > 1024 ? 4 : width > 768 ? 2 : 1;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Đội ngũ chuyên gia của chúng tôi</Text>
        <FlatList
          scrollEnabled={false} /* Fix lỗi VirtualizedLists */
          data={team}
          keyExtractor={(_, index) => index.toString()}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <View style={styles.memberCard}>
              <Image
                source={{ uri: item.image || defaultImage }}
                style={styles.image}
                resizeMode="cover"
                defaultSource={{ uri: defaultImage }}
              />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.titleText}>{item.title}</Text>
            </View>
          )}
          key={numColumns.toString()}
          columnWrapperStyle={
            numColumns > 1 ? styles.columnWrapper : undefined
          }
        />
      </View>
    </View>
  );
};

export default TeamSection;