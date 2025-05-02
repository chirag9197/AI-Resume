export function fallbackPdfExport(element: HTMLElement, filename = "resume.pdf"): void {
  try {
    // Create a new window
    const printWindow = window.open("", "_blank")

    if (!printWindow) {
      alert("Please allow popups for this website to download your resume as PDF")
      return
    }

    // Get the HTML content
    const content = element.innerHTML

    // Add necessary styles for printing
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
              body {
                padding: 0;
              }
              @page {
                size: letter portrait;
                margin: 0.5in;
              }
            }
            /* Copy all styles from the original element */
            ${Array.from(document.styleSheets)
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
              .join("\n")}
          </style>
        </head>
        <body>
          ${content}
          <script>
            // Print automatically when loaded
            window.onload = function() {
              setTimeout(() => {
                window.print();
                // Close the window after printing (or if printing is canceled)
                setTimeout(() => window.close(), 500);
              }, 500);
            };
          </script>
        </body>
      </html>
    `

    // Write to the new window
    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
  } catch (error) {
    console.error("Fallback PDF export failed:", error)
    alert("Could not export as PDF. Please try again or use your browser's print function.")
  }
}
