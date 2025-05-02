"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { exportToPdf } from "@/utils/pdf-export"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

interface PdfExportButtonProps {
  resumeRef: React.RefObject<HTMLDivElement>
  filename: string
}

export function PdfExportButton({ resumeRef, filename }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false)

  // Load the html2pdf library dynamically
  useEffect(() => {
    const loadHtml2PdfLibrary = async () => {
      try {
        // Check if the library is already loaded
        if (typeof window !== "undefined" && window.html2pdf) {
          setIsLibraryLoaded(true)
          return
        }

        // Load the library dynamically
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        script.async = true

        script.onload = () => {
          console.log("html2pdf library loaded successfully")
          setIsLibraryLoaded(true)
        }

        script.onerror = () => {
          console.error("Failed to load html2pdf library")
          toast({
            title: "PDF Export Setup Failed",
            description: "Could not load the PDF export library. Please try again later.",
            variant: "destructive",
          })
        }

        document.body.appendChild(script)

        return () => {
          // Clean up
          if (document.body.contains(script)) {
            document.body.removeChild(script)
          }
        }
      } catch (error) {
        console.error("Error loading PDF library:", error)
      }
    }

    loadHtml2PdfLibrary()
  }, [])

  const handleExport = async () => {
    if (!resumeRef.current) {
      toast({
        title: "Export Failed",
        description: "Could not find the resume content to export.",
        variant: "destructive",
      })
      return
    }

    if (!isLibraryLoaded) {
      toast({
        title: "PDF Export Not Ready",
        description: "The PDF export library is still loading. Please try again in a moment.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    setProgress(0)

    try {
      await exportToPdf(resumeRef.current, {
        filename: `${filename}.pdf`,
        onProgress: (value) => setProgress(value),
        onComplete: () => {
          toast({
            title: "PDF Export Complete",
            description: "Your resume has been successfully exported as a PDF.",
          })
          setIsExporting(false)
        },
        onError: (error) => {
          console.error("PDF export error:", error)
          toast({
            title: "Export Failed",
            description: "There was a problem exporting your resume. Please try again.",
            variant: "destructive",
          })
          setIsExporting(false)
        },
      })
    } catch (error) {
      console.error("PDF export error:", error)
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your resume. Please try again.",
        variant: "destructive",
      })
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleExport}
        disabled={isExporting || !isLibraryLoaded}
        className="flex items-center gap-2 w-full"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Exporting PDF...
          </>
        ) : !isLibraryLoaded ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparing...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download as PDF
          </>
        )}
      </Button>

      {isExporting && <Progress value={progress} className="h-2" />}
    </div>
  )
}
