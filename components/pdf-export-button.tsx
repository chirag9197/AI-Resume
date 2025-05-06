"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Download, Printer } from "lucide-react"
import { exportElementToPdf, printAsPdf } from "@/utils/pdf-export-utils"

interface PdfExportButtonProps {
  resumeRef: React.RefObject<HTMLDivElement>
  filename?: string
}

export function PdfExportButton({ resumeRef, filename = "resume" }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showFallback, setShowFallback] = useState(false)
  const exportAttempts = useRef(0)

  const handleExport = async () => {
    if (!resumeRef.current) {
      toast({
        title: "Export Failed",
        description: "Could not find resume content to export.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    setProgress(0)

    try {
      // Clone the element to avoid modifying the original
      const element = resumeRef.current.cloneNode(true) as HTMLElement

      // Add any necessary styles for PDF export
      element.style.width = "100%"
      element.style.maxWidth = "8.5in"
      element.style.margin = "0 auto"
      element.style.padding = "0.5in"
      element.style.backgroundColor = "white"

      // Export to PDF
      await exportElementToPdf(element, `${filename}.pdf`, (value) => setProgress(value))

      toast({
        title: "PDF Export Complete",
        description: "Your resume has been successfully exported as a PDF.",
      })

      // Reset export attempts on success
      exportAttempts.current = 0
      setShowFallback(false)
    } catch (error) {
      console.error("PDF export error:", error)

      // Increment attempt counter
      exportAttempts.current += 1

      // Show fallback option after first failure
      if (exportAttempts.current >= 1) {
        setShowFallback(true)
        toast({
          title: "PDF Export Failed",
          description: "Please try the print method instead.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "PDF Export Failed",
          description: "There was a problem exporting your resume. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsExporting(false)
    }
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
