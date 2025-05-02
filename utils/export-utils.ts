import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"
import type { GeneratedResume } from "@/types/resume"

// Function to safely load external libraries
export async function loadExternalLibrary(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${url}"]`)
    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = url
    script.async = true
    script.onload = () => resolve()
    script.onerror = (error) => reject(new Error(`Failed to load library: ${url}`))
    document.body.appendChild(script)
  })
}

// Function to safely load the html2pdf library
export async function loadHtml2Pdf(): Promise<any> {
  try {
    // Check if already loaded
    if (typeof window !== "undefined" && window.html2pdf) {
      console.log("html2pdf already loaded")
      return window.html2pdf
    }

    console.log("Loading html2pdf library...")
    await loadExternalLibrary("https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js")

    // Verify the library loaded correctly
    if (typeof window.html2pdf !== "function") {
      throw new Error("html2pdf did not load correctly")
    }

    console.log("html2pdf loaded successfully")
    return window.html2pdf
  } catch (error) {
    console.error("Failed to load html2pdf:", error)
    throw error
  }
}

// Function to safely load the FileSaver library
export async function loadFileSaver(): Promise<any> {
  try {
    // Check if already loaded
    if (typeof window !== "undefined" && window.saveAs) {
      console.log("FileSaver already loaded")
      return window.saveAs
    }

    console.log("Loading FileSaver library...")
    await loadExternalLibrary("https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js")

    // Verify the library loaded correctly
    if (typeof window.saveAs !== "function") {
      throw new Error("FileSaver did not load correctly")
    }

    console.log("FileSaver loaded successfully")
    return window.saveAs
  } catch (error) {
    console.error("Failed to load FileSaver:", error)
    throw error
  }
}

// Export to PDF using html2pdf
export async function exportToPdf(element: HTMLElement, filename: string): Promise<void> {
  console.log("Starting PDF export...")
  try {
    const html2pdf = await loadHtml2Pdf()
    console.log("Using html2pdf version:", html2pdf.version || "unknown")

    const options = {
      margin: 10,
      filename: `${filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }

    console.log("PDF export options:", options)

    // Use a simpler approach to avoid method chaining issues
    return new Promise((resolve, reject) => {
      try {
        const worker = html2pdf().from(element).set(options)
        console.log("html2pdf worker created")

        worker
          .save()
          .then(() => {
            console.log("PDF saved successfully")
            resolve()
          })
          .catch((error: any) => {
            console.error("Error in html2pdf save operation:", error)
            reject(error)
          })
      } catch (error) {
        console.error("Error creating html2pdf worker:", error)
        reject(error)
      }
    })
  } catch (error) {
    console.error("PDF export failed:", error)
    throw error
  }
}

// Fallback PDF export using browser print
export function printToPdf(element: HTMLElement, filename: string): void {
  console.log("Using fallback print to PDF method")
  try {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups to print your resume")
      return
    }

    const content = element.innerHTML
    const styles = Array.from(document.styleSheets)
      .filter((sheet) => {
        try {
          return !sheet.href || sheet.href.startsWith(window.location.origin)
        } catch (e) {
          return false
        }
      })
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n")
        } catch (e) {
          return ""
        }
      })
      .join("\n")

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 8.5in;
              margin: 0 auto;
            }
            @media print {
              body { padding: 0; }
              @page { size: letter portrait; margin: 0.5in; }
            }
            ${styles}
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 500);
              }, 500);
            };
          </script>
        </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    console.log("Print window opened successfully")
  } catch (error) {
    console.error("Fallback PDF export failed:", error)
    alert("Could not export as PDF. Please try again or use your browser's print function.")
  }
}

// Export to DOCX
export async function exportToDocx(resume: GeneratedResume, filename: string): Promise<void> {
  console.log("Starting DOCX export...")
  try {
    // Create a new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header with name and contact info
            new Paragraph({
              text: resume.personalInfo.fullName,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),

            // Contact info
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun(resume.personalInfo.email),
                new TextRun(" | "),
                new TextRun(resume.personalInfo.phone),
                new TextRun(" | "),
                new TextRun(resume.personalInfo.location),
                ...(resume.personalInfo.linkedIn
                  ? [new TextRun(" | "), new TextRun(resume.personalInfo.linkedIn)]
                  : []),
                ...(resume.personalInfo.portfolio
                  ? [new TextRun(" | "), new TextRun(resume.personalInfo.portfolio)]
                  : []),
              ],
            }),

            // Spacing
            new Paragraph(""),

            // Summary
            ...(resume.summary
              ? [
                  new Paragraph({
                    text: "PROFESSIONAL SUMMARY",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  new Paragraph(resume.summary),
                  new Paragraph(""),
                ]
              : []),

            // Work Experience
            ...(resume.workExperience && resume.workExperience.length > 0
              ? [
                  new Paragraph({
                    text: "WORK EXPERIENCE",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...resume.workExperience.flatMap((exp) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: exp.position,
                          bold: true,
                        }),
                        new TextRun(" at "),
                        new TextRun({
                          text: exp.company,
                          bold: true,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${formatDate(exp.startDate)} - ${exp.current ? "Present" : formatDate(exp.endDate)}`,
                          italics: true,
                        }),
                      ],
                    }),
                    ...exp.description.split("\n").map(
                      (bullet) =>
                        new Paragraph({
                          text: bullet,
                          bullet: {
                            level: 0,
                          },
                        }),
                    ),
                    new Paragraph(""),
                  ]),
                ]
              : []),

            // Education
            ...(resume.education && resume.education.length > 0
              ? [
                  new Paragraph({
                    text: "EDUCATION",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...resume.education.flatMap((edu) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${edu.degree} in ${edu.field}`,
                          bold: true,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: edu.institution,
                        }),
                        new TextRun(" | "),
                        new TextRun({
                          text: `${formatDate(edu.startDate)} - ${edu.current ? "Present" : formatDate(edu.endDate)}`,
                          italics: true,
                        }),
                      ],
                    }),
                    ...(edu.description ? [new Paragraph(edu.description)] : []),
                    new Paragraph(""),
                  ]),
                ]
              : []),

            // Skills
            ...(resume.skills && resume.skills.length > 0
              ? [
                  new Paragraph({
                    text: "SKILLS",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  new Paragraph(resume.skills.join(", ")),
                  new Paragraph(""),
                ]
              : []),

            // Certificates
            ...(resume.certificates && resume.certificates.length > 0
              ? [
                  new Paragraph({
                    text: "CERTIFICATES",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...resume.certificates.map(
                    (cert) =>
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cert.name,
                            bold: true,
                          }),
                          new TextRun(" | "),
                          new TextRun(cert.issuer),
                          new TextRun(" | "),
                          new TextRun(formatDate(cert.date)),
                          ...(cert.description ? [new TextRun(" - "), new TextRun(cert.description)] : []),
                        ],
                      }),
                  ),
                  new Paragraph(""),
                ]
              : []),

            // Achievements
            ...(resume.achievements && resume.achievements.length > 0
              ? [
                  new Paragraph({
                    text: "ACHIEVEMENTS",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...resume.achievements.map(
                    (achievement) =>
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: achievement.title,
                            bold: true,
                          }),
                          ...(achievement.date ? [new TextRun(" | "), new TextRun(formatDate(achievement.date))] : []),
                          new TextRun(" - "),
                          new TextRun(achievement.description),
                        ],
                      }),
                  ),
                  new Paragraph(""),
                ]
              : []),

            // Additional Sections
            ...(resume.additionalSections
              ? Object.entries(resume.additionalSections).flatMap(([title, content]) => [
                  new Paragraph({
                    text: title.toUpperCase(),
                    heading: HeadingLevel.HEADING_2,
                  }),
                  new Paragraph(content),
                  new Paragraph(""),
                ])
              : []),
          ],
        },
      ],
    })

    console.log("DOCX document created")

    // Generate the document
    const buffer = await Packer.toBuffer(doc)
    console.log("DOCX buffer generated, size:", buffer.byteLength)

    // Load FileSaver and save the document
    const saveAs = await loadFileSaver()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })

    console.log("DOCX blob created, size:", blob.size)
    saveAs(blob, `${filename}.docx`)
    console.log("DOCX saved successfully")
  } catch (error) {
    console.error("DOCX export failed:", error)
    throw error
  }
}

// Export to plain text
export async function exportToText(resume: GeneratedResume, filename: string): Promise<void> {
  console.log("Starting text export...")
  try {
    let text = `${resume.personalInfo.fullName}\n`
    text += `${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}`

    if (resume.personalInfo.linkedIn) {
      text += ` | ${resume.personalInfo.linkedIn}`
    }

    if (resume.personalInfo.portfolio) {
      text += ` | ${resume.personalInfo.portfolio}`
    }

    text += "\n\n"

    // Summary
    if (resume.summary) {
      text += "PROFESSIONAL SUMMARY\n"
      text += "===================\n"
      text += `${resume.summary}\n\n`
    }

    // Work Experience
    if (resume.workExperience && resume.workExperience.length > 0) {
      text += "WORK EXPERIENCE\n"
      text += "===============\n"

      resume.workExperience.forEach((exp) => {
        text += `${exp.position} at ${exp.company}\n`
        text += `${formatDate(exp.startDate)} - ${exp.current ? "Present" : formatDate(exp.endDate)}\n`

        exp.description.split("\n").forEach((bullet) => {
          text += `* ${bullet.replace(/^[•*]\s*/, "")}\n`
        })

        text += "\n"
      })
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      text += "EDUCATION\n"
      text += "=========\n"

      resume.education.forEach((edu) => {
        text += `${edu.degree} in ${edu.field}\n`
        text += `${edu.institution} | ${formatDate(edu.startDate)} - ${edu.current ? "Present" : formatDate(edu.endDate)}\n`

        if (edu.description) {
          text += `${edu.description}\n`
        }

        text += "\n"
      })
    }

    // Skills
    if (resume.skills && resume.skills.length > 0) {
      text += "SKILLS\n"
      text += "======\n"
      text += `${resume.skills.join(", ")}\n\n`
    }

    // Certificates
    if (resume.certificates && resume.certificates.length > 0) {
      text += "CERTIFICATES\n"
      text += "============\n"

      resume.certificates.forEach((cert) => {
        text += `${cert.name} | ${cert.issuer} | ${formatDate(cert.date)}`

        if (cert.description) {
          text += ` - ${cert.description}`
        }

        text += "\n"
      })

      text += "\n"
    }

    // Achievements
    if (resume.achievements && resume.achievements.length > 0) {
      text += "ACHIEVEMENTS\n"
      text += "============\n"

      resume.achievements.forEach((achievement) => {
        text += `${achievement.title}`

        if (achievement.date) {
          text += ` | ${formatDate(achievement.date)}`
        }

        text += ` - ${achievement.description}\n`
      })

      text += "\n"
    }

    // Additional Sections
    if (resume.additionalSections) {
      Object.entries(resume.additionalSections).forEach(([title, content]) => {
        text += `${title.toUpperCase()}\n`
        text += "=".repeat(title.length) + "\n"
        text += `${content}\n\n`
      })
    }

    console.log("Text content generated, length:", text.length)

    // Load FileSaver and save the text file
    const saveAs = await loadFileSaver()
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })

    console.log("Text blob created, size:", blob.size)
    saveAs(blob, `${filename}.txt`)
    console.log("Text file saved successfully")
  } catch (error) {
    console.error("Text export failed:", error)
    throw error
  }
}

// Helper function to format dates
function formatDate(dateString: string): string {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  } catch (error) {
    console.error("Date formatting error:", error)
    return dateString
  }
}
