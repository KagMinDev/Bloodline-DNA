import { SearchIcon } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface BlogSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const BlogSearchFilter: React.FC<BlogSearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <SearchIcon
          size={20}
          color="#9ca3af"
          style={styles.icon}
        />
        <TextInput
          placeholder="Tìm kiếm bài viết, tác giả, chủ đề..."
          style={styles.input}
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
    </View>
  );
};

export default BlogSearchFilter;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20, // tương đương py-12
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // gray-200
    // paddingHorizontal: 16,
  },
  searchWrapper: {
    maxWidth: 600,
    alignSelf: "center",
    position: "relative",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    left: 16,
    top: "50%",
    marginTop: -10,
  },
  input: {
    width: 383,
    height: 48,
    paddingLeft: 44,
    paddingRight: 16,
    fontSize: 15,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 9999,
    color: "#111827",
  },
});
