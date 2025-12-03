export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string; // HTML content
}

export const templateLibrary: ContractTemplate[] = [
  {
    id: 'template-001',
    name: 'Hợp đồng Dịch vụ Marketing',
    category: 'Kinh doanh',
    description: 'Hợp đồng tiêu chuẩn cho các dịch vụ marketing, bao gồm các điều khoản về KPI, báo cáo, và thanh toán.',
    content: `
      <h1>Hợp đồng Dịch vụ Marketing</h1>
      <p><strong>Bên A:</strong> [Tên công ty khách hàng]</p>
      <p><strong>Bên B:</strong> [Tên công ty cung cấp dịch vụ]</p>
      <br/>
      <h2>Điều 1: Nội dung công việc</h2>
      <p>Bên B sẽ cung cấp các dịch vụ marketing sau cho Bên A: Chạy quảng cáo trên các nền tảng mạng xã hội, tối ưu hóa công cụ tìm kiếm (SEO), và quản lý nội dung website.</p>
      <br/>
      <h2>Điều 2: KPI và Báo cáo</h2>
      <p>Các chỉ số hiệu suất chính (KPI) sẽ được thống nhất trong Phụ lục A. Bên B có trách nhiệm gửi báo cáo hiệu suất hàng tuần cho Bên A.</p>
      <br/>
      <h2>Điều 8: Bồi thường thiệt hại</h2>
      <p>Nếu Bên B không đạt được KPI đã cam kết, Bên B sẽ phải bồi thường 100% phí dịch vụ của tháng đó. Ngoài ra không có chế tài nào khác.</p>
    `,
  },
  {
    id: 'template-002',
    name: 'Hợp đồng Thuê nhà',
    category: 'Bất động sản',
    description: 'Hợp đồng cho thuê nhà ở với các điều khoản rõ ràng về tiền cọc, thời hạn thuê, và trách nhiệm của các bên.',
    content: `
      <h1>Hợp đồng Thuê nhà</h1>
      <p><strong>Bên cho thuê (Bên A):</strong> ...</p>
      <p><strong>Bên thuê (Bên B):</strong> ...</p>
      <br/>
      <h2>Điều 1: Đối tượng hợp đồng</h2>
      <p>Đối tượng của hợp đồng này là căn nhà tại địa chỉ: [Địa chỉ nhà].</p>
      <br/>
      <h2>Điều 2: Thời hạn thuê và giá thuê</h2>
      <p>Thời hạn thuê là 12 tháng, bắt đầu từ ngày [Ngày bắt đầu]. Giá thuê là [Số tiền] VNĐ/tháng, thanh toán vào ngày 1-5 hàng tháng.</p>
    `,
  },
  {
    id: 'template-003',
    name: 'Thỏa thuận Bảo mật thông tin (NDA)',
    category: 'Pháp lý',
    description: 'Thỏa thuận không tiết lộ thông tin giữa các bên, bảo vệ thông tin bí mật kinh doanh.',
    content: `
      <h1>Thỏa thuận Bảo mật thông tin (NDA)</h1>
      <p>Thỏa thuận này được lập giữa <strong>[Bên Tiết lộ]</strong> và <strong>[Bên Nhận tin]</strong>.</p>
      <br/>
      <h2>Điều 1: Định nghĩa thông tin mật</h2>
      <p>Thông tin mật bao gồm tất cả các thông tin kỹ thuật, tài chính, kinh doanh, danh sách khách hàng, và các bí mật thương mại khác được tiết lộ bởi Bên Tiết lộ trong quá trình hợp tác.</p>
    `,
  },
    {
    id: 'template-004',
    name: 'Hợp đồng Lao động',
    category: 'Nhân sự',
    description: 'Hợp đồng lao động xác định thời hạn giữa người sử dụng lao động và người lao động.',
    content: `
      <h1>Hợp đồng Lao động</h1>
      <p><strong>Người sử dụng lao động:</strong> [Tên công ty]</p>
      <p><strong>Người lao động:</strong> [Tên người lao động]</p>
      <br/>
      <h2>Điều 1: Công việc và địa điểm làm việc</h2>
      <p>Vị trí công việc: [Vị trí].</p>
      <p>Địa điểm làm việc: [Địa chỉ công ty].</p>
      <br/>
      <h2>Điều 2: Lương và các khoản phụ cấp</h2>
      <p>Mức lương chính: [Số tiền] VNĐ/tháng.</p>
      <p>Các khoản phụ cấp bao gồm: [Liệt kê phụ cấp].</p>
    `,
  },
];
