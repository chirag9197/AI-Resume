import { toast } from "@/components/ui/use-toast"

// Type definition for html2pdf options
interface Html2PdfOptions {
  margin?: number | number[]
  filename?: string
  image?: {
    type?: string
    quality?: number
  }
  html2canvas?: {
    scale?: number
    useCORS?: boolean
    [key: string]: any
  }
  jsPDF?: {
    unit?: string
    format?: string
    orientation?: string
    [key: string]: any
  }
  [key: string]: any
}

// Load html2pdf library
export async function loadHtml2Pdf(): Promise<any> {
  // Check if already loaded
  if (typeof window !== "undefined" && (window as any).html2pdf) {
    return (window as any).html2pdf
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    script.async = true
    script.onload = () => {
      if (typeof (window as any).html2pdf === "function") {
        resolve((window as any).html2pdf)
      } else {
        reject(new Error("html2pdf loaded but not available as a function"))
      }
    }
    script.onerror = () => reject(new Error("Failed to load html2pdf library"))
    document.body.appendChild(script)
  })
}

// Export element to PDF
export async function exportElementToPdf(
  element: HTMLElement,
  filename = "resume.pdf",
  onProgress?: (progress: number) => void,
): Promise<void> {
  try {
    // Start progress
    if (onProgress) onProgress(10)

    // Load html2pdf library
    const html2pdf = await loadHtml2Pdf()
    if (onProgress) onProgress(30)

    // Configure PDF options
    const options: Html2PdfOptions = {
      margin: 10,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    }

    if (onProgress) onProgress(50)

    // Create a promise to handle the PDF generation
    return new Promise((resolve, reject) => {
      try {
        // Use a simpler approach with direct function calls
        html2pdf()
          .from(element)
          .set(options)
          .save()
          .then(() => {
            if (onProgress) onProgress(100)
            resolve()
          })
          .catch((error: any) => {
            console.error("Error in html2pdf save operation:", error)
            reject(error)
          })
      } catch (error) {
        console.error("Error creating html2pdf instance:", error)
        reject(error)
      }
    })
  } catch (error) {
    console.error("PDF export failed:", error)
    throw error
  }
}

// Fallback method using browser print functionality
export function printAsPdf(element: HTMLElement): void {
  try {
    // Store original body content
    const originalContent = document.body.innerHTML

    // Replace with just our element
    document.body.innerHTML = `
      <style>
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: auto; margin: 10mm; }
        }
      </style>
      ${element.outerHTML}
    `

    // Print
    window.print()

    // Restore original content
    document.body.innerHTML = originalContent

    // Show success message
    toast({
      title: "Print Dialog Opened",
      description: "Use your browser's print function to save as PDF",
    })
  } catch (error) {
    console.error("Print fallback failed:", error)
    toast({
      title: "Print Failed",
      description: "Could not open print dialog. Please try again.",
      variant: "destructive",
    })
  }
}
