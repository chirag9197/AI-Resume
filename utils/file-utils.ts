/**
 * Utility functions for file operations that don't rely on external libraries
 */

/**
 * Save data as a file and trigger a download
 * @param data The data to save (Blob, string, etc.)
 * @param filename The name of the file to save
 * @param mimeType The MIME type of the file
 */
export function saveFile(data: BlobPart, filename: string, mimeType: string): void {
  // Create a blob with the data and MIME type
  const blob = new Blob([data], { type: mimeType })

  // Create a URL for the blob
  const url = URL.createObjectURL(blob)

  // Create a temporary anchor element
  const link = document.createElement("a")
  link.href = url
  link.download = filename

  // Append to the document, click, and remove
  document.body.appendChild(link)
  link.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}

/**
 * Convert HTML element to a data URL for downloading
 * @param element The HTML element to convert
 * @returns Promise that resolves to a data URL
 */
export function elementToDataUrl(element: HTMLElement): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Use html2canvas to convert the element to a canvas
      import("html2canvas")
        .then((html2canvasModule) => {
          const html2canvas = html2canvasModule.default
          html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
          })
            .then((canvas) => {
              // Convert the canvas to a data URL
              const dataUrl = canvas.toDataURL("image/png")
              resolve(dataUrl)
            })
            .catch(reject)
        })
        .catch(() => {
          reject(new Error("Failed to load html2canvas"))
        })
    } catch (error) {
      reject(error)
    }
  })
}
