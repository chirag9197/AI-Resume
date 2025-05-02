import html2pdf from "html2pdf.js"

interface PdfExportOptions {
  filename?: string
  margin?: number | number[]
  pageSize?: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
  onError?: (error: any) => void
}

export async function exportToPdf(element: HTMLElement, options: PdfExportOptions = {}): Promise<void> {
  const {
    filename = "resume.pdf",
    margin = [0.5, 0.5, 0.5, 0.5],
    pageSize = "letter",
    onProgress,
    onComplete,
    onError,
  } = options

  try {
    // Check if html2pdf is properly loaded
    if (typeof html2pdf !== "function") {
      console.error("html2pdf is not properly loaded:", html2pdf)
      throw new Error("PDF export library not available")
    }

    // Configure PDF options for optimal quality and formatting
    const pdfOptions = {
      margin: margin,
      filename: filename,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for external resources
        logging: false,
        letterRendering: true,
      },
      jsPDF: {
        unit: "in",
        format: pageSize,
        orientation: "portrait",
      },
    }

    // Create a worker to handle the PDF generation
    const worker = html2pdf()

    // Set up progress simulation
    if (onProgress) {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        if (progress >= 90) {
          clearInterval(interval)
        }
        onProgress(progress)
      }, 200)
    }

    // Generate and save the PDF using a simpler approach
    await worker
      .from(element)
      .set(pdfOptions)
      .save()
      .then(() => {
        if (onComplete) {
          onComplete()
        }
      })
      .catch((error: any) => {
        console.error("PDF generation error:", error)
        if (onError) {
          onError(error)
        }
      })
  } catch (error) {
    console.error("PDF export failed:", error)
    if (onError) {
      onError(error)
    }
    throw error
  }
}
