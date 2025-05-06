"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Download } from "lucide-react"
import { exportToPdf } from "@/utils/pdf-export"
import type { GeneratedResume } from "@/types/resume"

interface PdfExportButtonProps {
  resumeRef: React.RefObject<HTMLDivElement | null>
  resume: GeneratedResume
}

export function PdfExportButton({ resumeRef, resume }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleExport = async () => {
    if (!resumeRef.current) return

    setIsExporting(true)
    setProgress(0)

    try {
      await exportToPdf(resumeRef.current, {
        filename: `${resume.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`,
        template: resume.template
      })
      toast({
        title: "PDF Export Complete",
        description: "Your resume has been successfully exported as a PDF.",
      })
    } catch (error) {
      console.error("PDF export error:", error)
      toast({
        title: "PDF Export Failed",
        description: "There was a problem exporting your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setProgress(100)
    }
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleExport} 
        disabled={isExporting} 
        className="flex items-center gap-2 w-full bg-primary hover:bg-primary/90"
      >
        <Download className="h-4 w-4" />
        {isExporting ? "Exporting PDF..." : "Download as PDF"}
      </Button>

      {isExporting && <Progress value={progress} className="h-2" />}
    </div>
  )
}
