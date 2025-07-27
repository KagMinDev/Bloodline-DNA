import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // slate-50 to blue-50 gradient fallback
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#475569",
  },
  errorText: {
    fontSize: 16,
    color: "#dc2626",
    marginBottom: 12,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#1e40af",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  errorIconWrapper: {
    backgroundColor: "#fee2e2",
    padding: 16,
    borderRadius: 32,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: 280,
  },
  backButtonWrapper: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 100,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#d1d5db",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    marginLeft: 8,
    color: "#374151",
    fontSize: 14,
  },
  heroWrapper: {
    height: 360,
    position: "relative",
    marginBottom: 16,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  heroContent: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
  },
  heroTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  heroMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  authorAvatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  authorName: {
    color: "white",
    fontSize: 16,
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    color: "white",
    marginLeft: 4,
    fontSize: 14,
  },
  contentWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  authorBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f9ff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authorAvatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },
  authorAvatarTextLarge: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  authorNameLarge: {
    fontWeight: "600",
    fontSize: 16,
    color: "#1e293b",
  },
  authorRole: {
    fontSize: 12,
    color: "#64748b",
  },
  dateInfo: {
    alignItems: "flex-end",
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  dateTextGray: {
    fontSize: 12,
    color: "#64748b",
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1e293b",
    marginBottom: 32,
    // whiteSpace: "pre-line", // React Native không hỗ trợ nên có thể dùng thư viện Markdown hoặc xử lý khác
  },
  shareSection: {
    marginBottom: 40,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1e293b",
  },
  shareButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  shareButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  relatedSection: {
    marginBottom: 48,
  },
  relatedTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    color: "#1e293b",
  },
  relatedCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  relatedImage: {
    width: "100%",
    height: 120,
  },
  relatedContent: {
    padding: 12,
  },
  relatedTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  relatedExcerpt: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 12,
  },
  relatedMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  relatedAuthorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  relatedAuthorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  relatedAuthorAvatarText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  relatedAuthorName: {
    fontSize: 14,
    color: "#475569",
  },
  relatedDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  noRelated: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noRelatedTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
  },
  noRelatedSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 280,
  },
});
