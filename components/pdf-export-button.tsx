"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Download, Printer } from "lucide-react"
import { exportElementToPdf, printAsPdf } from "@/utils/pdf-export-utils"
import { exportToPdf } from "@/utils/pdf-export"
import type { GeneratedResume } from "@/types/resume"

interface PdfExportButtonProps {
  resumeRef: React.RefObject<HTMLDivElement | null>
  resume: GeneratedResume
}

export function PdfExportButton({ resumeRef, resume }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showFallback, setShowFallback] = useState(false)
  const exportAttempts = useRef(0)

  const handleExport = async () => {
    if (!resumeRef.current) return
    await exportToPdf(resumeRef.current, {
      filename: `${resume.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`,
      template: resume.template
    })
  }

  const handlePrintFallback = () => {
    if (!resumeRef.current) return
    printAsPdf(resumeRef.current)
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2 w-full">
        <Download className="h-4 w-4" />
        {isExporting ? "Exporting PDF..." : "Download as PDF"}
      </Button>

      {isExporting && <Progress value={progress} className="h-2" />}

      {showFallback && (
        <Button variant="outline" onClick={handlePrintFallback} className="flex items-center gap-2 w-full mt-2">
          <Printer className="h-4 w-4" />
          Print as PDF (Alternative)
        </Button>
      )}
    </div>
  )
}
