
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileEdit, Share2, FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface DownloadProgressProps {
  open: boolean;
  progress: number;
  fileName: string;
  fileUrl: string | null;
  onClose: () => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({
  open,
  progress,
  fileName,
  fileUrl,
  onClose
}) => {
  const isCompleted = progress === 100 && fileUrl;
  
  const handleEditPdf = () => {
    if (!fileUrl) return;
    
    try {
      // Open the PDF in a new tab for editing
      window.open(fileUrl, '_blank');
      
      toast({
        title: "تم فتح الملف للتحرير",
        description: `يمكنك الآن تحرير ملف ${fileName}`,
      });
    } catch (error) {
      console.error("Error opening file for editing:", error);
      toast({
        title: "خطأ في فتح الملف",
        description: "حدث خطأ أثناء محاولة فتح الملف للتحرير",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!fileUrl) return;
    
    try {
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: fileName,
          url: fileUrl
        });
        toast({
          title: "تمت المشاركة",
          description: "تمت مشاركة الملف بنجاح",
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        // Copy the URL to clipboard
        await navigator.clipboard.writeText(fileUrl);
        toast({
          title: "تم النسخ",
          description: "تم نسخ رابط الملف إلى الحافظة",
        });
      }
    } catch (error) {
      console.error("Error sharing file:", error);
      toast({
        title: "خطأ في المشاركة",
        description: "تعذر مشاركة الملف. تم نسخ الرابط إلى الحافظة بدلاً من ذلك.",
        variant: "destructive",
      });
      
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(fileUrl);
        toast({
          title: "تم النسخ",
          description: "تم نسخ رابط الملف إلى الحافظة",
        });
      } catch (clipboardError) {
        console.error("Error copying to clipboard:", clipboardError);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="w-5 h-5 ml-2" />
              {isCompleted ? "تم تحميل الملف" : "جاري تحميل الملف"}
            </span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center mb-2">
            <p>{fileName || "sickleaves.pdf"}</p>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <p className="text-center text-sm">
            {isCompleted 
              ? "اكتمل التحميل بنجاح" 
              : `جاري التحميل... ${progress}%`}
          </p>
          
          {isCompleted && (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Button onClick={handleEditPdf} className="bg-medical hover:bg-medical/90">
                <FileEdit className="ml-2 h-4 w-4" />
                تحرير الملف
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="ml-2 h-4 w-4" />
                مشاركة
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadProgress;
