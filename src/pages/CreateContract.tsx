import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, RotateCcw, Trash2, Download, PenTool } from "lucide-react";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface CreateContractProps {
  language: Language;
}

const templates = {
  "rental": {
    name: "Hợp đồng thuê nhà",
    fields: ["landlordName", "landlordId", "landlordAddress", "tenantName", "tenantId", "tenantAddress", "propertyAddress", "rentalPrice", "startDate", "endDate", "deposit"],
    template: (data: any) => `HỢP ĐỒNG THUÊ NHÀ

Hôm nay, ngày ${data.startDate || "__/__/____"}, chúng tôi gồm:

BÊN CHO THUÊ (Bên A):
- Họ và tên: ${data.landlordName || "____________________"}
- CMND/CCCD số: ${data.landlordId || "____________________"}
- Địa chỉ thường trú: ${data.landlordAddress || "____________________"}

BÊN THUÊ (Bên B):
- Họ và tên: ${data.tenantName || "____________________"}
- CMND/CCCD số: ${data.tenantId || "____________________"}
- Địa chỉ thường trú: ${data.tenantAddress || "____________________"}

Hai bên thỏa thuận ký kết hợp đồng thuê nhà với các điều khoản sau:

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG
Bên A đồng ý cho Bên B thuê nhà tại địa chỉ: ${data.propertyAddress || "____________________"}

ĐIỀU 2: THỜI HẠN THUÊ
Thời hạn thuê: ${data.startDate || "__/__/____"} đến ${data.endDate || "__/__/____"}

ĐIỀU 3: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN
- Giá thuê: ${data.rentalPrice || "____________"} VNĐ/tháng
- Tiền đặt cọc: ${data.deposit || "____________"} VNĐ
- Thanh toán vào ngày 05 hàng tháng

ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA BÊN A
- Giao nhà cho Bên B đúng thời hạn
- Đảm bảo Bên B sử dụng nhà ổn định trong thời gian thuê

ĐIỀU 5: QUYỀN VÀ NGHĨA VỤ CỦA BÊN B
- Thanh toán đầy đủ, đúng hạn tiền thuê nhà
- Giữ gìn nhà cửa, không làm hư hỏng tài sản
- Chấp hành đầy đủ các quy định về an ninh, trật tự

ĐIỀU 6: ĐIỀU KHOẢN CHUNG
Hợp đồng được lập thành 02 bản có giá trị như nhau, mỗi bên giữ 01 bản.

ĐẠI DIỆN BÊN A          ĐẠI DIỆN BÊN B
(Ký và ghi rõ họ tên)   (Ký và ghi rõ họ tên)`
  },
  "employment": {
    name: "Hợp đồng lao động",
    fields: ["employerName", "employerAddress", "employerRep", "employeeName", "employeeId", "employeeAddress", "position", "salary", "startDate", "duration"],
    template: (data: any) => `HỢP ĐỒNG LAO ĐỘNG

Hôm nay, ngày ${data.startDate || "__/__/____"}, chúng tôi gồm:

BÊN THUÊ LAO ĐỘNG (Người sử dụng lao động):
- Tên công ty: ${data.employerName || "____________________"}
- Địa chỉ: ${data.employerAddress || "____________________"}
- Đại diện: ${data.employerRep || "____________________"}

BÊN LAO ĐỘNG (Người lao động):
- Họ và tên: ${data.employeeName || "____________________"}
- CMND/CCCD số: ${data.employeeId || "____________________"}
- Địa chỉ thường trú: ${data.employeeAddress || "____________________"}

Hai bên thỏa thuận ký kết hợp đồng lao động với các điều khoản sau:

ĐIỀU 1: CÔNG VIỆC
Bên B được tuyển dụng vào vị trí: ${data.position || "____________________"}

ĐIỀU 2: THỜI HẠN HỢP ĐỒNG
- Thời hạn hợp đồng: ${data.duration || "____________________"}
- Ngày bắt đầu làm việc: ${data.startDate || "__/__/____"}

ĐIỀU 3: LƯƠNG VÀ CHẾ ĐỘ PHÚC LỢI
- Mức lương: ${data.salary || "____________"} VNĐ/tháng
- Được hưởng đầy đủ các chế độ theo quy định của pháp luật

ĐIỀU 4: THỜI GIÀ LÀM VIỆC VÀ NGHỈ NGƠI
- Làm việc 8 giờ/ngày, 48 giờ/tuần
- Được nghỉ phép năm theo quy định

ĐIỀU 5: QUYỀN VÀ NGHĨA VỤ CỦA NGƯỜI SỬ DỤNG LAO ĐỘNG
- Bố trí công việc phù hợp
- Trả lương đầy đủ, đúng hạn

ĐIỀU 6: QUYỀN VÀ NGHĨA VỤ CỦA NGƯỜI LAO ĐỘNG
- Hoàn thành công việc được giao
- Chấp hành nội quy, quy định

ĐIỀU 7: ĐIỀU KHOẢN CHUNG
Hợp đồng được lập thành 02 bản có giá trị như nhau.

ĐẠI DIỆN NGƯỜI SỬ DỤNG LĐ     NGƯỜI LAO ĐỘNG
(Ký và ghi rõ họ tên)          (Ký và ghi rõ họ tên)`
  },
  "sales": {
    name: "Hợp đồng mua bán",
    fields: ["sellerName", "sellerId", "sellerAddress", "buyerName", "buyerId", "buyerAddress", "productName", "quantity", "price", "totalAmount", "deliveryDate"],
    template: (data: any) => `HỢP ĐỒNG MUA BÁN

Hôm nay, ngày __/__/____, chúng tôi gồm:

BÊN BÁN (Bên A):
- Họ và tên: ${data.sellerName || "____________________"}
- CMND/CCCD số: ${data.sellerId || "____________________"}
- Địa chỉ: ${data.sellerAddress || "____________________"}

BÊN MUA (Bên B):
- Họ và tên: ${data.buyerName || "____________________"}
- CMND/CCCD số: ${data.buyerId || "____________________"}
- Địa chỉ: ${data.buyerAddress || "____________________"}

Hai bên thỏa thuận ký kết hợp đồng mua bán với các điều khoản sau:

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG
- Tên hàng hóa: ${data.productName || "____________________"}
- Số lượng: ${data.quantity || "____________"}
- Đơn giá: ${data.price || "____________"} VNĐ
- Tổng giá trị: ${data.totalAmount || "____________"} VNĐ

ĐIỀU 2: CHẤT LƯỢNG HÀNG HÓA
Hàng hóa phải đảm bảo chất lượng theo tiêu chuẩn đã thỏa thuận

ĐIỀU 3: THỜI HẠN VÀ ĐỊA ĐIỂM GIAO HÀNG
- Thời hạn giao hàng: ${data.deliveryDate || "__/__/____"}
- Địa điểm giao hàng: ${data.buyerAddress || "____________________"}

ĐIỀU 4: PHƯƠNG THỨC THANH TOÁN
Thanh toán khi nhận hàng hoặc theo thỏa thuận

ĐIỀU 5: TRÁCH NHIỆM CỦA CÁC BÊN
Bên A: Giao hàng đúng chất lượng, đúng hạn
Bên B: Thanh toán đầy đủ, đúng hạn

ĐIỀU 6: ĐIỀU KHOẢN CHUNG
Hợp đồng được lập thành 02 bản có giá trị như nhau.

ĐẠI DIỆN BÊN A          ĐẠI DIỆN BÊN B
(Ký và ghi rõ họ tên)   (Ký và ghi rõ họ tên)`
  }
};

export const CreateContract = ({ language }: CreateContractProps) => {
  const t = useTranslation(language);
  const { toast } = useToast();
  const { templateId } = useParams();
  const [formData, setFormData] = useState<any>({});
  const [contractContent, setContractContent] = useState("");

  useEffect(() => {
    if (templateId && templates[templateId as keyof typeof templates]) {
      const template = templates[templateId as keyof typeof templates];
      setContractContent(template.template({}));
    } else {
      setContractContent(`HỢP ĐỒNG MẪU

Điều 1: Các bên tham gia hợp đồng

Bên A (Bên thuê):
- Tên: __________________
- Địa chỉ: __________________
- CMND/CCCD: __________________

Bên B (Bên cho thuê):
- Tên: __________________
- Địa chỉ: __________________
- CMND/CCCD: __________________

Điều 2: Đối tượng hợp đồng

Bên B đồng ý cho Bên A thuê [mô tả tài sản]

Điều 3: Thời hạn hợp đồng

Hợp đồng có hiệu lực từ ngày __/__/____ đến ngày __/__/____

Điều 4: Giá thuê và phương thức thanh toán

- Giá thuê: ______________ VNĐ/tháng
- Thanh toán: ____________________

Điều 5: Quyền và nghĩa vụ của các bên

Bên A có quyền:
- [Quyền 1]
- [Quyền 2]

Bên A có nghĩa vụ:
- [Nghĩa vụ 1]
- [Nghĩa vụ 2]

Điều 6: Điều khoản chung

Hợp đồng này được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.

ĐẠI DIỆN BÊN A          ĐẠI DIỆN BÊN B
(Ký và ghi rõ họ tên)   (Ký và ghi rõ họ tên)`);
    }
  }, [templateId]);

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleGenerateContract = () => {
    if (templateId && templates[templateId as keyof typeof templates]) {
      const template = templates[templateId as keyof typeof templates];
      setContractContent(template.template(formData));
      toast({
        title: language === "vi" ? "Đã tạo hợp đồng" : "Contract generated",
        description: language === "vi" ? "Hợp đồng đã được tạo từ thông tin bạn nhập" : "Contract has been generated from your details",
      });
    }
  };

  const currentTemplate = templateId ? templates[templateId as keyof typeof templates] : null;

  const handleSave = () => {
    toast({
      title: language === "vi" ? "Đã lưu" : "Saved",
      description: language === "vi" ? "Hợp đồng đã được lưu thành công" : "Contract saved successfully",
    });
  };

  const handleReset = () => {
    if (confirm(language === "vi" ? "Bạn có chắc muốn làm lại?" : "Are you sure you want to reset?")) {
      setContractContent("");
    }
  };

  const handleDelete = () => {
    if (confirm(language === "vi" ? "Bạn có chắc muốn xóa?" : "Are you sure you want to delete?")) {
      setContractContent("");
      toast({
        title: language === "vi" ? "Đã xóa" : "Deleted",
        description: language === "vi" ? "Hợp đồng đã được xóa" : "Contract has been deleted",
      });
    }
  };

  const handleExport = () => {
    const blob = new Blob([contractContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hop-dong.txt";
    a.click();
    toast({
      title: language === "vi" ? "Đã xuất" : "Exported",
      description: language === "vi" ? "Hợp đồng đã được xuất" : "Contract has been exported",
    });
  };

  const fieldLabels: Record<string, { vi: string; en: string }> = {
    landlordName: { vi: "Tên bên cho thuê", en: "Landlord Name" },
    landlordId: { vi: "CMND/CCCD bên cho thuê", en: "Landlord ID" },
    landlordAddress: { vi: "Địa chỉ bên cho thuê", en: "Landlord Address" },
    tenantName: { vi: "Tên bên thuê", en: "Tenant Name" },
    tenantId: { vi: "CMND/CCCD bên thuê", en: "Tenant ID" },
    tenantAddress: { vi: "Địa chỉ bên thuê", en: "Tenant Address" },
    propertyAddress: { vi: "Địa chỉ nhà cho thuê", en: "Property Address" },
    rentalPrice: { vi: "Giá thuê (VNĐ/tháng)", en: "Rental Price (VND/month)" },
    startDate: { vi: "Ngày bắt đầu", en: "Start Date" },
    endDate: { vi: "Ngày kết thúc", en: "End Date" },
    deposit: { vi: "Tiền đặt cọc (VNĐ)", en: "Deposit (VND)" },
    employerName: { vi: "Tên công ty", en: "Company Name" },
    employerAddress: { vi: "Địa chỉ công ty", en: "Company Address" },
    employerRep: { vi: "Người đại diện", en: "Representative" },
    employeeName: { vi: "Tên người lao động", en: "Employee Name" },
    employeeId: { vi: "CMND/CCCD", en: "ID Number" },
    employeeAddress: { vi: "Địa chỉ", en: "Address" },
    position: { vi: "Vị trí", en: "Position" },
    salary: { vi: "Lương (VNĐ/tháng)", en: "Salary (VND/month)" },
    duration: { vi: "Thời hạn hợp đồng", en: "Contract Duration" },
    sellerName: { vi: "Tên bên bán", en: "Seller Name" },
    sellerId: { vi: "CMND/CCCD bên bán", en: "Seller ID" },
    sellerAddress: { vi: "Địa chỉ bên bán", en: "Seller Address" },
    buyerName: { vi: "Tên bên mua", en: "Buyer Name" },
    buyerId: { vi: "CMND/CCCD bên mua", en: "Buyer ID" },
    buyerAddress: { vi: "Địa chỉ bên mua", en: "Buyer Address" },
    productName: { vi: "Tên hàng hóa", en: "Product Name" },
    quantity: { vi: "Số lượng", en: "Quantity" },
    price: { vi: "Đơn giá (VNĐ)", en: "Unit Price (VND)" },
    totalAmount: { vi: "Tổng giá trị (VNĐ)", en: "Total Amount (VND)" },
    deliveryDate: { vi: "Ngày giao hàng", en: "Delivery Date" },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {currentTemplate ? currentTemplate.name : t.createContract}
        </h1>
        <p className="text-muted-foreground mb-8">
          {language === "vi"
            ? "Điền thông tin chi tiết để tạo hợp đồng"
            : "Fill in details to create your contract"}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <h3 className="font-bold mb-4">{t.contractDetails}</h3>
              {currentTemplate && currentTemplate.fields ? (
                <div className="space-y-4">
                  {currentTemplate.fields.map((field) => (
                    <div key={field}>
                      <Label htmlFor={field}>
                        {fieldLabels[field]?.[language] || field}
                      </Label>
                      <Input
                        id={field}
                        value={formData[field] || ""}
                        onChange={(e) => handleFormChange(field, e.target.value)}
                        type={field.includes("Date") ? "date" : "text"}
                      />
                    </div>
                  ))}
                  <Button className="w-full" onClick={handleGenerateContract}>
                    <PenTool className="w-4 h-4 mr-2" />
                    {t.generateContract}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {language === "vi"
                    ? "Chọn template từ trang Templates để bắt đầu"
                    : "Select a template from Templates page to start"}
                </p>
              )}
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{t.editContract}</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-1" />
                    {t.save}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    {t.resetContract}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-1" />
                    {t.exportContract}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    {t.delete}
                  </Button>
                </div>
              </div>

              <div className="bg-background border border-border rounded-lg p-6 min-h-[600px]">
                <textarea
                  value={contractContent}
                  onChange={(e) => setContractContent(e.target.value)}
                  className="w-full h-full min-h-[600px] bg-transparent border-none outline-none resize-none font-mono text-sm"
                  style={{ fontFamily: "Courier New, monospace" }}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContract;
