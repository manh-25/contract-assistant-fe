export type Language = "vi" | "en";

export const translations = {
  vi: {
    // Navigation
    home: "Trang chủ",
    quickReview: "Review nhanh",
    deepAnalysis: "Phân tích chuyên sâu",
    templates: "Template hợp đồng",
    createContract: "Tạo hợp đồng",
    
    // Home page
    heroTitle: "Trợ lý hợp đồng thông minh",
    heroSubtitle: "Phân tích, tạo và quản lý hợp đồng với sức mạnh AI",
    heroDescription: "Giải pháp toàn diện cho cá nhân và doanh nghiệp nhỏ",
    getStarted: "Bắt đầu ngay",
    learnMore: "Tìm hiểu thêm",
    
    // Features
    quickReviewTitle: "Review nhanh",
    quickReviewDesc: "Quét và đánh giá nhanh các điều khoản quan trọng",
    deepAnalysisTitle: "Phân tích chuyên sâu",
    deepAnalysisDesc: "Phân tích chi tiết từng điều khoản với đề xuất chỉnh sửa",
    templatesTitle: "Thư viện Template",
    templatesDesc: "Kho template hợp đồng chuyên nghiệp, sẵn sàng sử dụng",
    
    // Quick Review
    uploadContract: "Tải lên hợp đồng",
    dragAndDrop: "Kéo thả file vào đây hoặc nhấn để chọn",
    supportedFormats: "Hỗ trợ: PDF, DOC, DOCX",
    analyzing: "Đang phân tích...",
    reviewResults: "Kết quả review",
    
    // Deep Analysis
    selectClause: "Chọn điều khoản để xem phân tích chi tiết",
    overallAssessment: "Đánh giá tổng quan",
    riskLevel: "Mức độ rủi ro",
    safe: "An toàn",
    caution: "Cẩn thận",
    danger: "Nguy hiểm",
    suggestions: "Đề xuất chỉnh sửa",
    modifyContract: "Chỉnh sửa hợp đồng",
    
    // Templates
    selectTemplate: "Chọn template",
    viewTemplate: "Xem chi tiết",
    useTemplate: "Sử dụng template",
    
    // Contract Generator
    contractDetails: "Chi tiết hợp đồng",
    editContract: "Chỉnh sửa hợp đồng",
    saveContract: "Lưu hợp đồng",
    resetContract: "Làm lại",
    deleteContract: "Xóa",
    exportContract: "Xuất hợp đồng",
    
    // Common
    back: "Quay lại",
    next: "Tiếp theo",
    cancel: "Hủy",
    confirm: "Xác nhận",
    save: "Lưu",
    delete: "Xóa",
    edit: "Chỉnh sửa",
    download: "Tải xuống",
    upload: "Tải lên",
  },
  en: {
    // Navigation
    home: "Home",
    quickReview: "Quick Review",
    deepAnalysis: "Deep Analysis",
    templates: "Contract Templates",
    createContract: "Create Contract",
    
    // Home page
    heroTitle: "Smart Contract Assistant",
    heroSubtitle: "Analyze, create and manage contracts with AI power",
    heroDescription: "Complete solution for individuals and small businesses",
    getStarted: "Get Started",
    learnMore: "Learn More",
    
    // Features
    quickReviewTitle: "Quick Review",
    quickReviewDesc: "Scan and evaluate important clauses quickly",
    deepAnalysisTitle: "Deep Analysis",
    deepAnalysisDesc: "Detailed analysis of each clause with edit suggestions",
    templatesTitle: "Template Library",
    templatesDesc: "Professional contract templates, ready to use",
    
    // Quick Review
    uploadContract: "Upload Contract",
    dragAndDrop: "Drag and drop file here or click to select",
    supportedFormats: "Supported: PDF, DOC, DOCX",
    analyzing: "Analyzing...",
    reviewResults: "Review Results",
    
    // Deep Analysis
    selectClause: "Select a clause to view detailed analysis",
    overallAssessment: "Overall Assessment",
    riskLevel: "Risk Level",
    safe: "Safe",
    caution: "Caution",
    danger: "Danger",
    suggestions: "Edit Suggestions",
    modifyContract: "Modify Contract",
    
    // Templates
    selectTemplate: "Select Template",
    viewTemplate: "View Details",
    useTemplate: "Use Template",
    
    // Contract Generator
    contractDetails: "Contract Details",
    editContract: "Edit Contract",
    saveContract: "Save Contract",
    resetContract: "Reset",
    deleteContract: "Delete",
    exportContract: "Export Contract",
    
    // Common
    back: "Back",
    next: "Next",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    download: "Download",
    upload: "Upload",
  },
};

export const useTranslation = (lang: Language) => {
  return translations[lang];
};
