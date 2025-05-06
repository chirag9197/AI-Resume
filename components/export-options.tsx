"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Download, FileText, FileType, FileIcon as FilePdf, ChevronDown } from "lucide-react"
import { exportToDocx, exportToText } from "@/utils/export-utils"
import { exportElementToPdf, printAsPdf } from "@/utils/pdf-export-utils"
import type { GeneratedResume } from "@/types/resume"

interface ExportOptionsProps {
  resume: GeneratedResume
  resumeRef: React.RefObject<HTMLDivElement>
}

export function ExportOptions({ resume, resumeRef }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [showDialog, setShowDialog] = useState(false)
  const filename = resume.personalInfo.fullName.replace(/\s+/g, "_") + "_Resume"

  const handleExport = async (format: string) => {
    if (!resumeRef.current) {
      toast({
        title: "Export Failed",
        description: "Could not find resume content to export.",
        variant: "destructive",
      })
      return
    }

    setExportFormat(format)
    setIsExporting(true)
    setProgress(0)
    setShowDialog(true)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 200)

      switch (format) {
        case "pdf":
          try {
            console.log("Starting PDF export process")
            setProgress(10)

            if (!resumeRef.current) {
              throw new Error("Resume element not found")
            }

            // Clone the element to avoid modifying the original
            const element = resumeRef.current.cloneNode(true) as HTMLElement

            // Add any necessary styles for PDF export
            element.style.width = "100%"
            element.style.maxWidth = "8.5in"
            element.style.margin = "0 auto"
            element.style.padding = "0.5in"
            element.style.backgroundColor = "white"

            setProgress(30)

            // Export to PDF
            await exportElementToPdf(element, filename, (value) => setProgress(value > 30 ? value : 30))

            console.log("PDF export completed successfully")
            toast({
              title: "PDF Export Complete",
              description: "Your resume has been successfully exported as a PDF.",
            })
          } catch (error) {
            console.error("PDF export error:", error)
            toast({
              title: "PDF Export Failed",
              description: "Using fallback print method instead.",
            })
            // Fallback to print method
            if (resumeRef.current) {
              printAsPdf(resumeRef.current)
            }
          }
          break

        case "docx":
          try {
            console.log("Starting DOCX export process")
            await exportToDocx(resume, filename)
            console.log("DOCX export completed successfully")
            toast({
              title: "DOCX Export Complete",
              description: "Your resume has been successfully exported as a Word document.",
            })
          } catch (error) {
            console.error("DOCX export error:", error)
            toast({
              title: "DOCX Export Failed",
              description: "There was a problem exporting your resume as a Word document.",
              variant: "destructive",
            })
          }
          break

        case "text":
          try {
            console.log("Starting text export process")
            await exportToText(resume, filename)
            console.log("Text export completed successfully")
            toast({
              title: "Text Export Complete",
              description: "Your resume has been successfully exported as a text file.",
            })
          } catch (error) {
            console.error("Text export error:", error)
            toast({
              title: "Text Export Failed",
              description: "There was a problem exporting your resume as a text file.",
              variant: "destructive",
            })
          }
          break

        default:
          throw new Error(`Unsupported export format: ${format}`)
      }

      clearInterval(progressInterval)
      setProgress(100)

      // Close dialog after a short delay
      setTimeout(() => {
        setIsExporting(false)
        setShowDialog(false)
      }, 1000)
    } catch (error) {
      console.error(`${format.toUpperCase()} export error:`, error)
      toast({
        title: `${format.toUpperCase()} Export Failed`,
        description: "There was a problem exporting your resume. Please try again.",
        variant: "destructive",
      })
      setIsExporting(false)
      setShowDialog(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Resume
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport("pdf")} className="flex items-center gap-2">
            <FilePdf className="h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("docx")} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export as Word (DOCX)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("text")} className="flex items-center gap-2">
            <FileType className="h-4 w-4" />
            Export as Plain Text
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exporting Resume</DialogTitle>
            <DialogDescription>
              {exportFormat === "pdf" && "Creating PDF document..."}
              {exportFormat === "docx" && "Creating Word document..."}
              {exportFormat === "text" && "Creating text file..."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Progress value={progress} className="h-2" />
            <p className="text-center mt-2 text-sm text-muted-foreground">
              {progress < 100 ? "Processing..." : "Complete!"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
