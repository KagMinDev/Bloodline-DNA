import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProgressSteps from "./ProgressSteps";
import type { TestProgressData } from "../types/checkout";
import { getCollectionMethodLabel } from "@/screens/services/types/TestService";

interface ProgressStepsContainerProps {
  progressData: TestProgressData;
  paymentLoading: boolean;
  paymentError: string | null;
  handleStepAction: (payload: any) => void;
  bookingStatus: string;
  setIsSampleModalOpen: (open: boolean) => void;
  setPaymentLoading: (loading: boolean) => void;
  updateProgressAfterDelivery: () => void;
  shouldShowSampleButton: boolean;
  isDeliveryConfirmed: boolean;
  isCollectionConfirmed: boolean;
  bookingId: string;
  handleConfirmDelivery: (bookingId: string) => void;
  setDateTimePickerVisible: (visible: boolean) => void; // Thêm prop
  isConfirmingCollection: boolean; // Thêm prop
}

const ProgressStepsContainer: React.FC<ProgressStepsContainerProps> = ({
  progressData,
  paymentLoading,
  paymentError,
  handleStepAction,
  bookingStatus,
  setIsSampleModalOpen,
  setPaymentLoading,
  updateProgressAfterDelivery,
  shouldShowSampleButton,
  isCollectionConfirmed,
  isDeliveryConfirmed,
  bookingId,
  handleConfirmDelivery,
  setDateTimePickerVisible,
  isConfirmingCollection,
}) => {
  const getProgressPercentage = () => {
    const completedSteps = progressData.steps.filter(step => step.status === 'completed').length;
    return progressData.steps.length === 0 ? 0 : Math.round((completedSteps / progressData.steps.length) * 100);
  };

  const collectionMethod = progressData.serviceType === 'SelfSample' ? 0 : 1;
  const collectionMethodLabel = getCollectionMethodLabel(collectionMethod);

  const getCurrentStepInfo = () => {
    const currentStep = progressData.steps.find(step => step.status === 'current');
    return currentStep || progressData.steps[progressData.steps.length - 1];
  };

  const progressPercentage = getProgressPercentage();
  const currentStep = getCurrentStepInfo();

  function getServiceTypeLabel(serviceType: 'SelfSample' | 'AtFacility'): string {
    return serviceType === 'SelfSample' ? 'Tại nhà' : 'Tại cơ sở';
  }

  return (
    <View style={styles.container}>
      {/* Header with progress overview */}
      <View style={styles.header}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressTitle}>Tiến độ thực hiện</Text>
          <Text style={styles.progressSubtitle}>
            {progressData.testType} - {getServiceTypeLabel(progressData.serviceType)}
          </Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercentage === 100 ? 'Hoàn tất' : `Bước hiện tại: ${currentStep.title}`}
        </Text>
      </View>

      {/* Current step highlight */}
      {progressPercentage < 100 && (
        <View style={styles.currentStepCard}>
          <View style={styles.currentStepHeader}>
            <Text style={styles.currentStepTitle}>🎯 Bước hiện tại</Text>
            <View style={styles.currentStepBadge}>
              <Text style={styles.currentStepBadgeText}>Đang thực hiện</Text>
            </View>
          </View>
          <Text style={styles.currentStepDescription}>{currentStep.title}</Text>
          <Text style={styles.currentStepDetail}>{currentStep.description}</Text>
        </View>
      )}

      {/* Steps timeline */}
      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>Chi tiết từng bước</Text>
        {progressData.steps.map((step, index) => (
          <ProgressSteps
            key={step.id}
            step={step}
            index={index}
            isLast={index === progressData.steps.length - 1}
            paymentLoading={paymentLoading}
            paymentError={paymentError}
            handleStepAction={handleStepAction}
            bookingStatus={bookingStatus}
            setIsSampleModalOpen={setIsSampleModalOpen}
            setPaymentLoading={setPaymentLoading}
            updateProgressAfterDelivery={updateProgressAfterDelivery}
            shouldShowSampleButton={shouldShowSampleButton}
            isDeliveryConfirmed={isDeliveryConfirmed}
            isCollectionConfirmed={isCollectionConfirmed}
            bookingId={bookingId}
            handleConfirmDelivery={handleConfirmDelivery}
            setDateTimePickerVisible={setDateTimePickerVisible}
            isConfirmingCollection={isConfirmingCollection}
            collectionMethod={collectionMethod}
          />
        ))}
      </View>
    </View>
  );
};

export default ProgressStepsContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  progressBadge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressPercentage: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  currentStepCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  currentStepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  currentStepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
  },
  currentStepBadge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentStepBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  currentStepDescription: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  currentStepDetail: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  stepsContainer: {
    marginTop: 8,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
});