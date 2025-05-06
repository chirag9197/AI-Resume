import html2pdf from "html2pdf.js"
import type { TemplateType } from "@/types/resume"
import { templateStyles } from "@/components/resume-form/template-styles"

interface PdfExportOptions {
  filename: string
  template?: TemplateType
}

export async function exportToPdf(element: HTMLElement, options: PdfExportOptions) {
  const { filename, template = "modern" } = options
  const styles = templateStyles[template]

  // Clone the element to avoid modifying the original
  const elementToExport = element.cloneNode(true) as HTMLElement

  // Apply template styles
  elementToExport.className = styles.container
  elementToExport.querySelectorAll("h1").forEach((el) => el.className = styles.name)
  elementToExport.querySelectorAll("h2").forEach((el) => el.className = styles.sectionTitle)
  elementToExport.querySelectorAll("h3").forEach((el) => el.className = styles.itemTitle)
  elementToExport.querySelectorAll(".section").forEach((el) => el.className = styles.section)
  elementToExport.querySelectorAll(".list").forEach((el) => el.className = styles.list)
  elementToExport.querySelectorAll(".item").forEach((el) => el.className = styles.item)
  elementToExport.querySelectorAll(".subtitle").forEach((el) => el.className = styles.itemSubtitle)
  elementToExport.querySelectorAll(".date").forEach((el) => el.className = styles.itemDate)
  elementToExport.querySelectorAll(".description").forEach((el) => el.className = styles.itemDescription)

  // Configure PDF options
  const opt = {
    margin: 0.5,
    filename: `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  }

  // Export to PDF
  await html2pdf().set(opt).from(elementToExport).save()
}
