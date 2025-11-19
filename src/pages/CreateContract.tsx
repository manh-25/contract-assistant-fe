import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, RotateCcw, Trash2, Download } from "lucide-react";
import { Language } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface CreateContractProps {
  language: Language;
}

export const CreateContract = ({ language }: CreateContractProps) => {
  const t = useTranslation(language);
  const { toast } = useToast();
  const [contractContent, setContractContent] = useState(
    `HỢP ĐỒNG MẪU

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
(Ký và ghi rõ họ tên)   (Ký và ghi rõ họ tên)`
  );

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.createContract}</h1>
        <p className="text-muted-foreground mb-8">
          {language === "vi"
            ? "Tạo và chỉnh sửa hợp đồng của bạn"
            : "Create and edit your contract"}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <h3 className="font-bold mb-4">{t.contractDetails}</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contract-type">
                    {language === "vi" ? "Loại hợp đồng" : "Contract Type"}
                  </Label>
                  <Input id="contract-type" placeholder="Hợp đồng thuê nhà" />
                </div>
                <div>
                  <Label htmlFor="party-a">{language === "vi" ? "Bên A" : "Party A"}</Label>
                  <Input id="party-a" placeholder="Tên bên A" />
                </div>
                <div>
                  <Label htmlFor="party-b">{language === "vi" ? "Bên B" : "Party B"}</Label>
                  <Input id="party-b" placeholder="Tên bên B" />
                </div>
                <div>
                  <Label htmlFor="date">{language === "vi" ? "Ngày hiệu lực" : "Effective Date"}</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
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
