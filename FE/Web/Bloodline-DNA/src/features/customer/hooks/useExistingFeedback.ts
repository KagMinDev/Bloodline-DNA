import { useCallback, useRef, useState } from "react";
import {
  getFeedbackByIdApi,
  getUserFeedbacksApi,
  type UserFeedback,
} from "../api/existingFeedbackApi";

export const useExistingFeedback = () => {
  const [existingFeedbackMap, setExistingFeedbackMap] = useState<Record<string, UserFeedback | null>>({});
  const [isCheckingFeedback, setIsCheckingFeedback] = useState<Record<string, boolean>>({});
  const [feedbackErrors, setFeedbackErrors] = useState<Record<string, string>>({});

  // Use refs to access current state without causing re-renders
  const existingFeedbackMapRef = useRef(existingFeedbackMap);
  const isCheckingFeedbackRef = useRef(isCheckingFeedback);

  // Update refs when state changes
  existingFeedbackMapRef.current = existingFeedbackMap;
  isCheckingFeedbackRef.current = isCheckingFeedback;

  const checkExistingFeedback = useCallback(
    async (userId: string, testServiceId: string) => {
      if (!userId || !testServiceId) {
        console.log("❌ Missing userId or testServiceId for feedback check");
        return null;
      }

      const feedbackKey = `${userId}_${testServiceId}`;

      // ⏳ Nếu đang gọi API cho key này → không gọi lại
      if (isCheckingFeedbackRef.current[feedbackKey]) {
        console.log(`⏳ Already checking feedback for ${feedbackKey}, skipping...`);
        return existingFeedbackMapRef.current[feedbackKey] || null;
      }

      // ✅ Nếu đã có kết quả thì không gọi nữa (including null results)
      if (feedbackKey in existingFeedbackMapRef.current) {
        console.log(`✅ Using cached feedback for ${feedbackKey}`);
        return existingFeedbackMapRef.current[feedbackKey];
      }

      try {
        setIsCheckingFeedback(prev => ({ ...prev, [feedbackKey]: true }));
        setFeedbackErrors(prev => ({ ...prev, [feedbackKey]: "" }));

        console.log(`🔄 Checking existing feedback for ${feedbackKey}`);

        const userFeedbacksResponse = await getUserFeedbacksApi(userId);

        if (userFeedbacksResponse.success && userFeedbacksResponse.data) {
          const feedbacks: UserFeedback[] = Array.isArray(userFeedbacksResponse.data)
            ? userFeedbacksResponse.data
            : [userFeedbacksResponse.data];

          const matchingFeedback = feedbacks.find(
            (feedback) => feedback.testServiceId === testServiceId
          );

          if (matchingFeedback) {
            console.log(`✅ Found feedback for ${feedbackKey}:`, matchingFeedback);

            // Lấy chi tiết nếu có
            try {
              const feedbackDetailsResponse = await getFeedbackByIdApi(matchingFeedback.id);

              if (feedbackDetailsResponse.success && feedbackDetailsResponse.data) {
                const detailedFeedback = Array.isArray(feedbackDetailsResponse.data)
                  ? feedbackDetailsResponse.data[0]
                  : feedbackDetailsResponse.data;

                console.log(`✅ Got detailed feedback for ${feedbackKey}:`, detailedFeedback);

                setExistingFeedbackMap(prev => ({
                  ...prev,
                  [feedbackKey]: detailedFeedback,
                }));
                return detailedFeedback;
              }
            } catch (detailError) {
              console.warn("⚠️ Error getting detailed feedback:", detailError);
            }

            // Nếu không lấy được chi tiết, dùng bản gốc
            setExistingFeedbackMap(prev => ({
              ...prev,
              [feedbackKey]: matchingFeedback,
            }));
            return matchingFeedback;
          } else {
            console.log(`📝 No feedback found for ${feedbackKey}`);
            // Cache the "no feedback" result to avoid repeated API calls
            setExistingFeedbackMap(prev => ({
              ...prev,
              [feedbackKey]: null,
            }));
            return null;
          }
        } else {
          console.log(`📝 No feedbacks returned for user ${userId}`);
          // Cache the "no feedback" result to avoid repeated API calls
          setExistingFeedbackMap(prev => ({
            ...prev,
            [feedbackKey]: null,
          }));
          return null;
        }
      } catch (error) {
        console.error(`❌ Error checking feedback for ${feedbackKey}:`, error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setFeedbackErrors(prev => ({ ...prev, [feedbackKey]: errorMessage }));
        return null;
      } finally {
        setIsCheckingFeedback(prev => ({ ...prev, [feedbackKey]: false }));
      }
    },
    [] // Remove dependencies to prevent recreation
  );

  const getExistingFeedback = useCallback(
    (userId: string, testServiceId: string) => {
      const feedbackKey = `${userId}_${testServiceId}`;
      return existingFeedbackMap[feedbackKey] || null;
    },
    [existingFeedbackMap]
  );

  const isCheckingFeedbackFor = useCallback(
    (userId: string, testServiceId: string) => {
      const feedbackKey = `${userId}_${testServiceId}`;
      return isCheckingFeedback[feedbackKey] || false;
    },
    [isCheckingFeedback]
  );

  const getFeedbackError = useCallback(
    (userId: string, testServiceId: string) => {
      const feedbackKey = `${userId}_${testServiceId}`;
      return feedbackErrors[feedbackKey] || "";
    },
    [feedbackErrors]
  );

  const clearFeedbackCache = useCallback(() => {
    setExistingFeedbackMap({});
    setIsCheckingFeedback({});
    setFeedbackErrors({});
  }, []);

  return {
    checkExistingFeedback,
    getExistingFeedback,
    isCheckingFeedbackFor,
    getFeedbackError,
    clearFeedbackCache,
    // expose raw maps if needed
    existingFeedbackMap,
    isCheckingFeedback,
    feedbackErrors,
  };
};
