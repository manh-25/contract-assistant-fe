export type Language = "vi" | "en";

export const translations = {
  vi: {
    // Navigation
    home: "Trang chủ",
    quickReview: "Review nhanh",
    deepAnalysis: "Phân tích chuyên sâu",
    templates: "Template hợp đồng",
    createContract: "Tạo hợp đồng",
    dashboard: "Bảng điều khiển",
    
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
    generateContract: "Tạo hợp đồng",
    
    // Dashboard
    dashboardTitle: "Bảng điều khiển",
    welcomeBack: "Chào mừng trở lại",
    recentContracts: "Hợp đồng gần đây",
    quickActions: "Thao tác nhanh",
    statistics: "Thống kê",
    totalContracts: "Tổng hợp đồng",
    reviewsCompleted: "Đã review",
    contractsCreated: "Đã tạo",
    viewAll: "Xem tất cả",
    noContracts: "Chưa có hợp đồng nào",
    
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
    
    // FAQ
    faqTitle: "Câu hỏi thường gặp",
    faqQuestion1: "AGREEME là gì?",
    faqAnswer1: "AGREEME là nền tảng trợ lý hợp đồng thông minh sử dụng AI để giúp bạn phân tích, đánh giá và tạo các hợp đồng chuyên nghiệp một cách nhanh chóng và chính xác.",
    faqQuestion2: "Tôi có thể sử dụng AGREEME cho mục đích gì?",
    faqAnswer2: "Bạn có thể sử dụng AGREEME để: review nhanh hợp đồng, phân tích chuyên sâu các điều khoản, tạo hợp đồng mới từ template, và chỉnh sửa hợp đồng dựa trên đề xuất của AI.",
    faqQuestion3: "AGREEME có hỗ trợ ngôn ngữ nào?",
    faqAnswer3: "AGREEME hỗ trợ tiếng Việt và tiếng Anh, giúp bạn làm việc với hợp đồng bằng cả hai ngôn ngữ một cách dễ dàng.",
    faqQuestion4: "Tính năng phân tích chuyên sâu hoạt động như thế nào?",
    faqAnswer4: "Tính năng phân tích chuyên sâu sử dụng AI để đánh giá từng điều khoản trong hợp đồng, phân loại mức độ rủi ro (an toàn, cảnh báo, nguy hiểm) và đưa ra các đề xuất chỉnh sửa cụ thể.",
    faqQuestion5: "Tôi có thể chỉnh sửa hợp đồng trực tiếp không?",
    faqAnswer5: "Có, bạn có thể chỉnh sửa hợp đồng trực tiếp trên cửa sổ soạn thảo với các tùy chọn lưu, reset, xóa và xuất file.",
    
    // Login
    loginTitle: "Đăng nhập",
    loginSubtitle: "Đăng nhập để truy cập đầy đủ tính năng",
    email: "Email",
    password: "Mật khẩu",
    loginButton: "Đăng nhập",
    noAccount: "Chưa có tài khoản?",
    signUp: "Đăng ký ngay",
    forgotPassword: "Quên mật khẩu?",
    
    // Forgot Password
    forgotPasswordTitle: "Quên mật khẩu",
    forgotPasswordSubtitle: "Nhập email của bạn để nhận link đặt lại mật khẩu",
    sendResetLink: "Gửi link đặt lại",
    backToLogin: "Quay lại đăng nhập",
    resetLinkSent: "Link đặt lại mật khẩu đã được gửi đến email của bạn",
    
    // Sign Up
    signUpTitle: "Đăng ký",
    signUpSubtitle: "Tạo tài khoản mới để bắt đầu",
    confirmPassword: "Xác nhận mật khẩu",
    signUpButton: "Đăng ký",
    alreadyHaveAccount: "Đã có tài khoản?",
    signIn: "Đăng nhập ngay",
    passwordMismatch: "Mật khẩu không khớp",
    
    // Profile
    profileTitle: "Hồ sơ",
    profileTab: "Hồ sơ",
    passwordTab: "Mật khẩu",
    settingsTab: "Cài đặt",
    personalInfo: "Thông tin cá nhân",
    personalInfoDesc: "Cập nhật thông tin cá nhân của bạn",
    fullName: "Họ và tên",
    phone: "Số điện thoại",
    saveChanges: "Lưu thay đổi",
    changePassword: "Đổi mật khẩu",
    changePasswordDesc: "Cập nhật mật khẩu của bạn",
    currentPassword: "Mật khẩu hiện tại",
    newPassword: "Mật khẩu mới",
    updatePassword: "Cập nhật mật khẩu",
    accountSettings: "Cài đặt tài khoản",
    accountSettingsDesc: "Quản lý cài đặt tài khoản của bạn",
    emailNotifications: "Thông báo email",
    emailNotificationsDesc: "Nhận thông báo qua email",
    twoFactorAuth: "Xác thực hai yếu tố",
    twoFactorAuthDesc: "Tăng cường bảo mật tài khoản",
    deleteAccount: "Xóa tài khoản",
    deleteAccountDesc: "Xóa vĩnh viễn tài khoản của bạn",
    manage: "Quản lý",
    enable: "Bật",
    profileUpdated: "Cập nhật thông tin thành công",
    profileUpdatedDesc: "Thông tin cá nhân đã được cập nhật",
    passwordChanged: "Đổi mật khẩu thành công",
    passwordChangedDesc: "Mật khẩu của bạn đã được cập nhật",
  },
  en: {
    // Navigation
    home: "Home",
    quickReview: "Quick Review",
    deepAnalysis: "Deep Analysis",
    templates: "Contract Templates",
    createContract: "Create Contract",
    dashboard: "Dashboard",
    
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
    generateContract: "Generate Contract",
    
    // Dashboard
    dashboardTitle: "Dashboard",
    welcomeBack: "Welcome Back",
    recentContracts: "Recent Contracts",
    quickActions: "Quick Actions",
    statistics: "Statistics",
    totalContracts: "Total Contracts",
    reviewsCompleted: "Reviews Completed",
    contractsCreated: "Contracts Created",
    viewAll: "View All",
    noContracts: "No contracts yet",
    
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
    
    // FAQ
    faqTitle: "Frequently Asked Questions",
    faqQuestion1: "What is AGREEME?",
    faqAnswer1: "AGREEME is an intelligent contract assistant platform that uses AI to help you analyze, evaluate, and create professional contracts quickly and accurately.",
    faqQuestion2: "What can I use AGREEME for?",
    faqAnswer2: "You can use AGREEME to: quickly review contracts, perform deep analysis of clauses, create new contracts from templates, and modify contracts based on AI suggestions.",
    faqQuestion3: "What languages does AGREEME support?",
    faqAnswer3: "AGREEME supports both Vietnamese and English, making it easy to work with contracts in both languages.",
    faqQuestion4: "How does the deep analysis feature work?",
    faqAnswer4: "The deep analysis feature uses AI to evaluate each clause in the contract, categorizes risk levels (safe, warning, danger), and provides specific editing suggestions.",
    faqQuestion5: "Can I edit contracts directly?",
    faqAnswer5: "Yes, you can edit contracts directly in the editor window with options to save, reset, delete, and export files.",
    
    // Login
    loginTitle: "Login",
    loginSubtitle: "Sign in to access all features",
    email: "Email",
    password: "Password",
    loginButton: "Sign In",
    noAccount: "Don't have an account?",
    signUp: "Sign up now",
    forgotPassword: "Forgot password?",
    
    // Forgot Password
    forgotPasswordTitle: "Forgot Password",
    forgotPasswordSubtitle: "Enter your email to receive a password reset link",
    sendResetLink: "Send Reset Link",
    backToLogin: "Back to login",
    resetLinkSent: "Password reset link has been sent to your email",
    
    // Sign Up
    signUpTitle: "Sign Up",
    signUpSubtitle: "Create a new account to get started",
    confirmPassword: "Confirm Password",
    signUpButton: "Sign Up",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in now",
    passwordMismatch: "Passwords do not match",
    
    // Profile
    profileTitle: "Profile",
    profileTab: "Profile",
    passwordTab: "Password",
    settingsTab: "Settings",
    personalInfo: "Personal Information",
    personalInfoDesc: "Update your personal information",
    fullName: "Full Name",
    phone: "Phone Number",
    saveChanges: "Save Changes",
    changePassword: "Change Password",
    changePasswordDesc: "Update your password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    updatePassword: "Update Password",
    accountSettings: "Account Settings",
    accountSettingsDesc: "Manage your account settings",
    emailNotifications: "Email Notifications",
    emailNotificationsDesc: "Receive notifications via email",
    twoFactorAuth: "Two-Factor Authentication",
    twoFactorAuthDesc: "Add extra security to your account",
    deleteAccount: "Delete Account",
    deleteAccountDesc: "Permanently delete your account",
    manage: "Manage",
    enable: "Enable",
    profileUpdated: "Profile Updated Successfully",
    profileUpdatedDesc: "Your personal information has been updated",
    passwordChanged: "Password Changed Successfully",
    passwordChangedDesc: "Your password has been updated",
  },
};

export const useTranslation = (lang: Language) => {
  return translations[lang];
};
