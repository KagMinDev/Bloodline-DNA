import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import styles from "./styles";

// Spinner component sử dụng Animated để tạo hiệu ứng xoay
export const LoadingSpinner = () => {
  // Khai báo animated value
  const spinValue = useRef(new Animated.Value(0)).current;

  // Hàm xoay liên tục
  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Chuyển từ 0 độ sang 360 độ
  });

  useEffect(() => {
    // Khởi tạo animation xoay liên tục
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000, // Thời gian để hoàn thành một vòng xoay
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            transform: [{ rotate: rotate }],
          },
        ]}
      />
    </View>
  );
};
