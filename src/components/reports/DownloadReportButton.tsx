"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";

interface DownloadReportButtonProps {
  reportName: string;
  targetId: string;
}

export function DownloadReportButton({ reportName, targetId }: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      toast.error("Report content not found");
      return;
    }

    try {
      setIsGenerating(true);
      
      // Give time for any animations to finish
      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging to see errors in console
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(targetId);
          if (clonedElement) {
            clonedElement.style.display = "block";
            clonedElement.style.visibility = "visible";
            clonedElement.style.position = "relative";
            clonedElement.style.width = "850px";
            clonedElement.style.left = "0";
            clonedElement.style.top = "0";
          }
        }
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas generation failed: Invalid dimensions");
      }

      const imgData = canvas.toDataURL("image/png", 1.0);
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      
      pdf.save(`${reportName.replace(/\s+/g, "_")}.pdf`);
      
      toast.success("Bank statement downloaded!");
    } catch (error: any) {
      console.error("PDF Generation Detailed Error:", error);
      toast.error(`Generation failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      variant="outline"
      className="gap-2 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4 text-blue-600" />
          <span>Download PDF</span>
        </>
      )}
    </Button>
  );
}
