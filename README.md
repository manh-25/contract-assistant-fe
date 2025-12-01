

---

### **DOCUMENTATION: CẤU TRÚC THƯ MỤC DỰ ÁN AGREEME**

**Dự án:** `contract-assistant-fe` (Frontend)
**Mô tả:** Ứng dụng web hỗ trợ phân tích, tạo và quản lý hợp đồng sử dụng AI.
**Framework:** React + Vite, TypeScript, Tailwind CSS.

---

### **Mô tả chi tiết các thư mục và file:**

#### **`/src`**: Thư mục gốc chứa toàn bộ mã nguồn của ứng dụng.

##### **`/src/components`**: Chứa các component giao diện (UI) nhỏ, có thể tái sử dụng.
*   **`LanguageSwitcher.tsx`**: Component cho phép chuyển đổi ngôn ngữ (EN/VI).
*   **`Navigation.tsx`**: Component thanh điều hướng (Header) chính của trang chủ (Landing Page). Chứa logo, các link tính năng, và nút Login/Signup hoặc Avatar người dùng.
*   **`NavLink.tsx`**: Component con của `Navigation.tsx`, có thể là một item link trong menu.
*   **`Sidebar.tsx`**: **(Quan trọng)** Component thanh menu dọc bên trái, được sử dụng chung cho toàn bộ các trang trong Dashboard (Home, Analysis, Templates...). Đây là component điều hướng chính sau khi người dùng đăng nhập.

##### **`/src/contexts`**: Quản lý state toàn cục của ứng dụng.
*   **`AuthContext.tsx`**: **(Cực kỳ quan trọng)** Quản lý trạng thái đăng nhập của người dùng. Cung cấp các hàm `signIn`, `signUp`, `signOut` và thông tin `user` cho toàn bộ ứng dụng. Tích hợp với Supabase.

##### **`/src/hooks`**: Chứa các custom hook để tái sử dụng logic.
*   **`use-mobile.tsx`**: Hook để kiểm tra xem thiết bị có phải là mobile không (dựa vào kích thước màn hình).
*   **`use-toast.ts`**: Hook để hiển thị các thông báo nhanh (toast notification) cho người dùng (ví dụ: "Đăng nhập thành công", "Lỗi!").

##### **`/src/integrations/supabase`**: Cấu hình và kết nối với Backend-as-a-Service (BaaS).
*   **`client.ts`**: Nơi khởi tạo Supabase client. Chứa URL và `anon_key` để kết nối tới Supabase.
*   **`types.ts`**: Định nghĩa các kiểu dữ liệu TypeScript cho các bảng trong CSDL Supabase (ví dụ: `interface Contract`, `interface UserProfile`).

##### **`/src/layouts`**: Định nghĩa các mẫu layout chung cho các trang.
*   **`DashboardLayout.tsx`**: **(Quan trọng)** Layout chính sau khi đăng nhập. Nó chứa component `<Sidebar />` cố định bên trái và một vùng `<Outlet />` để hiển thị nội dung của các trang con (Dashboard, Templates, Inspections...).

##### **`/src/lib`**: Thư viện tiện ích.
*   **`translations.ts`**: Chứa các chuỗi văn bản đa ngôn ngữ (EN/VI).
*   **`utils.ts`**: Chứa các hàm tiện ích nhỏ, ví dụ hàm `cn` để nối các class của Tailwind CSS một cách có điều kiện.

##### **`/src/pages`**: Chứa các component tương ứng với một trang hoàn chỉnh.
*   **`Home.tsx`**: Trang chủ (Landing page) cho khách truy cập.
*   **`Login.tsx` / `Signup.tsx`**: Các trang đăng nhập, đăng ký.
*   **`ForgotPassword.tsx`**: Trang quên mật khẩu.
*   **`Dashboard.tsx`**: **(Trang chính)** Trang tổng quan sau khi đăng nhập. Hiển thị các số liệu thống kê (`Summary`) và danh sách hợp đồng gần đây (`In Progress`) được lấy từ `localStorage`.
*   **`DeepAnalysis.tsx`**: **(Tính năng cốt lõi)** Trang phân tích hợp đồng. Bao gồm chức năng upload (kéo-thả), hiển thị kết quả phân tích của AI, và lưu kết quả. Trang này có layout "full-focus" riêng.
*   **`CreateContract.tsx`**: Trang soạn thảo hợp đồng. Cho phép người dùng điền thông tin vào một mẫu có sẵn (mockup HTML) và xem trước theo thời gian thực.
*   **`Templates.tsx`**: Trang quản lý các mẫu hợp đồng **của người dùng**. Hiển thị dưới dạng bảng danh sách các file/folder người dùng đã tạo hoặc lưu.
*   **`Library.tsx`**: Trang thư viện các mẫu hợp đồng **của hệ thống**. Người dùng có thể duyệt và chọn một mẫu từ đây để bắt đầu soạn thảo.
*   **`Inspections.tsx`**: **(Trang lưu trữ)** Hiển thị danh sách tất cả các hợp đồng đã được lưu từ trang `DeepAnalysis` hoặc `CreateContract`. Dữ liệu được đọc từ `localStorage`.
*   **`Profile.tsx` / `Settings.tsx`**: Các trang quản lý thông tin người dùng và cài đặt.
*   **`NotFound.tsx`**: Trang lỗi 404.
*   `About.tsx`, `DeepScan.tsx`, `QuickReview.tsx`: Các file này có thể là phiên bản cũ hoặc các trang đang phát triển. Cần review lại mục đích sử dụng.

##### **Các file cấu hình gốc:**
*   **`App.tsx`**: **(File trung tâm)** Nơi định nghĩa các `Route` (đường dẫn) của ứng dụng, quyết định trang nào sẽ hiển thị với URL nào và trang nào được bọc trong layout nào.
*   **`main.tsx`**: Điểm khởi đầu của ứng dụng React, render component `App`.
*   `App.css`, `index.css`: Các file CSS toàn cục.

---

### **Luồng dữ liệu chính (Data Flow):**

1.  **Tạo Hợp đồng**: Người dùng vào `Library` -> Chọn mẫu -> Chuyển sang `CreateContract`.
2.  **Soạn thảo & Lưu nháp**: Người dùng điền thông tin trong `CreateContract` -> Bấm "Lưu" -> Một bản ghi `status: "Draft"` được thêm vào `localStorage` (`saved_contracts`).
3.  **Phân tích Hợp đồng**: Người dùng vào `DeepAnalysis` -> Upload file -> AI phân tích -> Bấm "Lưu tài liệu".
4.  **Lưu kết quả**: Một bản ghi `status: "In Progress"` với điểm số (`score`) được thêm vào `localStorage` (`saved_contracts`).
5.  **Hiển thị**: `Inspections` và `Dashboard` đọc dữ liệu từ `localStorage` (`saved_contracts`) để hiển thị danh sách và tính toán các chỉ số thống kê.
6.  


---

### **BÁO CÁO TỔNG KẾT & BÀN GIAO CÔNG VIỆC FRONTEND - DỰ ÁN AGREEME**

**Ngày:** 01/12/2025
**Người báo cáo:** LMT

**Mục tiêu:** Ghi nhận các tính năng đã được phát triển và mô tả logic hoạt động để bàn giao cho lập trình viên tiếp theo.

**Công nghệ chính:** React, TypeScript, Tailwind CSS, React Router.

---

### **Tổng quan các hạng mục đã hoàn thành**

| Hạng mục | Mô tả & Logic chính | Các file liên quan | Hướng phát triển & Lưu ý |
| :--- | :--- | :--- | :--- |
| **1. Soạn thảo Hợp đồng từ Mẫu (VĐ 1)** | **Mục tiêu:** Cho phép người dùng điền thông tin vào các chỗ trống `...` của một file mẫu có sẵn.<br><br>**Giải pháp:**<br>1. **Dùng Mockup HTML**: Thay vì xử lý file `.docx` phức tạp, hệ thống sử dụng một chuỗi HTML được lưu sẵn trong code (`contractTemplateHtml`).<br>2. **Placeholder `{{...}}`**: Các chỗ trống trong hợp đồng được thay bằng các biến (placeholder) dạng `{{TEN_BIEN}}`.<br>3. **Điền dữ liệu Real-time**: Người dùng nhập thông tin vào Form bên trái. Dữ liệu này được lưu trong `state` (`formData`). Một hàm (`applyPlaceholders`) sẽ tìm và thay thế các placeholder trong chuỗi HTML bằng dữ liệu tương ứng.<br>4. **Hiển thị Preview**: Nội dung HTML đã được điền sẽ hiển thị ra ở cột bên phải.<br>5. **Lưu thành bản nháp**: Khi người dùng bấm "Lưu", một bản ghi mới với trạng thái `"Draft"` (Chưa phân tích) sẽ được tạo và lưu vào `Inspections`. | `src/pages/CreateContract.tsx` | - **Nâng cấp**: Thay vì mockup HTML cứng, có thể phát triển API để tải nội dung template từ CSDL.<br>- **Font chữ**: Cần đảm bảo font chữ (`font-serif`) được áp dụng để hiển thị tiếng Việt không bị lỗi. |
| **2. Quản lý & Lưu trữ (VĐ 3)** | **Mục tiêu:** Cải thiện trang `Inspections` để lưu trữ và hiển thị các hợp đồng đã phân tích/soạn thảo một cách trực quan.<br><br>**Giải pháp:**<br>1. **Lưu trữ trên trình duyệt**: Toàn bộ danh sách hợp đồng được lưu trong `localStorage` với key là `saved_contracts`.<br>2. **Giao diện dạng Bảng**: Hiển thị danh sách hợp đồng dưới dạng bảng, bao gồm các cột: Tên, Mã số, Điểm số (Score), Ngày tạo (Conducted).<br>3. **Logic hiển thị thời gian**: Cột "Conducted" hiển thị thông minh: nếu dưới 24h thì hiện "X hours/mins ago", nếu quá 24h thì hiện ngày/tháng/năm.<br>4. **Trạng thái & Hành động**: <br>   - Hợp đồng đã phân tích: Hiển thị điểm số và nút "Continue".<br>   - Hợp đồng mới tạo (Draft): Hiển thị nhãn "Chưa phân tích" và nút "Analyze now".<br>5. **Tương tác**: Người dùng có thể **Xóa** hoặc **Tiếp tục phân tích** (Continue) một hợp đồng cũ. | `src/pages/Inspections.tsx`<br>`src/pages/DeepAnalysis.tsx` (Hàm `handleSave`)<br>`src/pages/CreateContract.tsx` (Hàm `handleConfirmSave`) | - **Backend**: Nên thay thế `localStorage` bằng CSDL thật sự khi có backend. Dữ liệu sẽ được fetch qua API.<br>- **Phân trang**: Cần thêm logic phân trang thực tế khi dữ liệu lớn. |
| **3. Phân tích Hợp đồng (Analysis)** | **Mục tiêu:** Cung cấp giao diện để người dùng tải file lên, xem kết quả phân tích và quản lý phiên làm việc.<br><br>**Giải pháp:**<br>1. **Upload Kéo-thả (Drag & Drop)**: Giao diện upload hỗ trợ cả bấm chọn và kéo thả file.<br>2. **Giao diện Full Focus**: Trang Analysis chiếm toàn màn hình (che Header) để người dùng tập trung. Sidebar được tái sử dụng để đảm bảo điều hướng.<br>3. **Logic Lưu & Thay đổi**: <br>   - Nút "Lưu tài liệu" sẽ chuyển thành "Đã lưu" sau khi bấm.<br>   - Nếu người dùng có chỉnh sửa, nút sẽ hiện lại.<br>   - Khi tải file mới, hệ thống sẽ **hiện Popup** hỏi người dùng có muốn lưu file hiện tại không nếu có thay đổi chưa lưu.<br>4. **Disclaimer**: Thêm dòng cảnh báo "Agreeme can make mistakes..." ở cuối sidebar phải. | `src/pages/DeepAnalysis.tsx`<br>`src/components/Sidebar.tsx` | - **Tích hợp AI**: Logic phân tích hiện đang là mockup. Cần kết nối với API AI thật để trả về điểm số và các lỗi.<br>- **Phát hiện chỉnh sửa**: Logic `hasChanges` đang là giả lập (dựa vào click). Nên thay bằng cách theo dõi sự thay đổi của nội dung hợp đồng thực tế (nếu có tính năng edit). |
| **4. Trang chủ (Dashboard)** | **Mục tiêu:** Hiển thị tổng quan các chỉ số và hoạt động gần đây, kết nối dữ liệu từ các tính năng khác.<br><br>**Giải pháp:**<br>1. **Dữ liệu động**: Trang Home đọc danh sách hợp đồng từ `localStorage` (`saved_contracts`).<br>2. **Thống kê**: Các thẻ "Summary" (`Total Contracts`, `High Risk Found`) được tự động tính toán dựa trên dữ liệu thật.<br>3. **Hoạt động gần đây**: Hiển thị 3-5 hợp đồng mới nhất trong mục "In Progress".<br>4. **Hiển thị trạng thái**: Badge màu (Xanh, Cam, Đỏ) hiển thị mức độ an toàn dựa trên điểm số (Score).<br>5. **Menu hành động**: Nút 3 chấm cho phép người dùng **Xóa** hoặc **Tải PDF** báo cáo tóm tắt. | `src/pages/Dashboard.tsx` | - **Real-time**: Cần cơ chế cập nhật real-time (ví dụ: WebSocket) khi có backend để dashboard luôn mới.<br>- **Biểu đồ**: Có thể thêm các biểu đồ trực quan hóa dữ liệu. |
| **5. Thư viện Mẫu (VĐ 2 - Mở rộng)** | **Mục tiêu:** Thay vì mục "Help", chúng ta đã xây dựng trang **Library** và **Templates** để quản lý mẫu.<br><br>**Giải pháp:**<br>1. **Library**: Là nơi chứa các mẫu chung của hệ thống. Người dùng có thể bấm "Use" để bắt đầu soạn thảo.<br>2. **Templates**: Là nơi chứa các mẫu do người dùng tự tải lên hoặc lưu lại. Dữ liệu được quản lý trong `localStorage`. Giao diện dạng bảng như Google Drive. | `src/pages/Library.tsx`<br>`src/pages/Templates.tsx` | - **Lưu trữ file**: Hiện tại, việc upload chỉ lưu thông tin vào `localStorage`. Cần có backend (vd: S3, Firebase Storage) để lưu trữ file thật sự. |

---

Hy vọng báo cáo này sẽ giúp đồng nghiệp của bạn nhanh chóng nắm bắt được dự án. Chúc bạn và team thành công