import { useState, useCallback } from "react";
import { getUserFeedbacksApi, getFeedbackByIdApi, type UserFeedback } from "../api/existingFeedbackApi";

export const useExistingFeedback = () => {
  const [existingFeedbackMap, setExistingFeedbackMap] = useState<Record<string, UserFeedback>>({});
  const [isCheckingFeedback, setIsCheckingFeedback] = useState<Record<string, boolean>>({});
  const [feedbackErrors, setFeedbackErrors] = useState<Record<string, string>>({});

  const checkExistingFeedback = useCallback(async (userId: string, testServiceId: string) => {
    if (!userId || !testServiceId) {
      console.log("❌ Missing userId or testServiceId for feedback check");
      return null;
    }

    const feedbackKey = `${userId}_${testServiceId}`;
    
    // If already checking, return existing promise to avoid race condition
    if (isCheckingFeedback[feedbackKey]) {
      console.log(`⏳ Already checking feedback for ${feedbackKey}, skipping...`);
      return existingFeedbackMap[feedbackKey] || null;
    }
    
    // If already have result, return it
    if (existingFeedbackMap[feedbackKey]) {
      console.log(`✅ Using cached feedback for ${feedbackKey}`);
      return existingFeedbackMap[feedbackKey];
    }

    try {
      setIsCheckingFeedback(prev => ({ ...prev, [feedbackKey]: true }));
      setFeedbackErrors(prev => ({ ...prev, [feedbackKey]: "" }));
      
      console.log(`🔄 Checking existing feedback for user ${userId} and testService ${testServiceId}`);

      // Get all user feedbacks
      const userFeedbacksResponse = await getUserFeedbacksApi(userId);
      
      if (userFeedbacksResponse.success && userFeedbacksResponse.data) {
        const feedbacks = Array.isArray(userFeedbacksResponse.data) 
          ? userFeedbacksResponse.data 
          : [userFeedbacksResponse.data];
        
        // Find feedback with matching testServiceId
        const matchingFeedback = feedbacks.find(
          (feedback: UserFeedback) => feedback.testServiceId === testServiceId
        );

        if (matchingFeedback) {
          console.log(`✅ Found existing feedback for ${feedbackKey}:`, matchingFeedback);
          
          // Get detailed feedback information
          try {
            const feedbackDetailsResponse = await getFeedbackByIdApi(matchingFeedback.id);
            
            if (feedbackDetailsResponse.success && feedbackDetailsResponse.data) {
              const detailedFeedback = Array.isArray(feedbackDetailsResponse.data) 
                ? feedbackDetailsResponse.data[0] 
                : feedbackDetailsResponse.data;
              
              console.log(`✅ Got detailed feedback for ${feedbackKey}:`, detailedFeedback);
              setExistingFeedbackMap(prev => ({ 
                ...prev, 
                [feedbackKey]: detailedFeedback as UserFeedback 
              }));
              return detailedFeedback as UserFeedback;
            } else {
              console.log("⚠️ Failed to get feedback details, using basic info");
              setExistingFeedbackMap(prev => ({ 
                ...prev, 
                [feedbackKey]: matchingFeedback 
              }));
              return matchingFeedback;
            }
          } catch (detailError) {
            console.warn("⚠️ Error getting feedback details, using basic info:", detailError);
            setExistingFeedbackMap(prev => ({ 
              ...prev, 
              [feedbackKey]: matchingFeedback 
            }));
            return matchingFeedback;
          }
        } else {
          console.log(`📝 No existing feedback found for ${feedbackKey}`);
          return null;
        }
      } else {
        console.log(`📝 No feedbacks found for user ${userId}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error checking existing feedback for ${feedbackKey}:`, error);
      const errorMessage = error instanceof Error ? error.message : "Error checking feedback";
      setFeedbackErrors(prev => ({ ...prev, [feedbackKey]: errorMessage }));
      return null;
    } finally {
      setIsCheckingFeedback(prev => ({ ...prev, [feedbackKey]: false }));
    }
  }, [existingFeedbackMap, isCheckingFeedback]);

  const getExistingFeedback = useCallback((userId: string, testServiceId: string) => {
    const feedbackKey = `${userId}_${testServiceId}`;
    return existingFeedbackMap[feedbackKey] || null;
  }, [existingFeedbackMap]);

  const isCheckingFeedbackFor = useCallback((userId: string, testServiceId: string) => {
    const feedbackKey = `${userId}_${testServiceId}`;
    return isCheckingFeedback[feedbackKey] || false;
  }, [isCheckingFeedback]);

  const getFeedbackError = useCallback((userId: string, testServiceId: string) => {
    const feedbackKey = `${userId}_${testServiceId}`;
    return feedbackErrors[feedbackKey] || "";
  }, [feedbackErrors]);

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
    // For backward compatibility
    existingFeedbackMap,
    isCheckingFeedback,
    feedbackErrors,
  };
}; 