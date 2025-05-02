"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ExportDiagnostics() {
  const [diagnosticResults, setDiagnosticResults] = useState<Record<string, boolean | string>>({})
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)
    setShowDiagnostics(true)
    const results: Record<string, boolean | string> = {}

    // Check if running in browser
    results.browserEnvironment = typeof window !== "undefined"

    // Check for Blob support
    try {
      results.blobSupport = typeof Blob === "function"
      // Test creating a blob
      const testBlob = new Blob(["test"], { type: "text/plain" })
      results.blobCreation = testBlob.size > 0
    } catch (error) {
      results.blobSupport = false
      results.blobCreation = false
      results.blobError = String(error)
    }

    // Check for URL.createObjectURL support
    try {
      results.urlCreateObjectURLSupport = typeof URL.createObjectURL === "function"
      if (results.urlCreateObjectURLSupport && results.blobCreation) {
        const testBlob = new Blob(["test"], { type: "text/plain" })
        const url = URL.createObjectURL(testBlob)
        results.urlCreateObjectURLWorking = url.startsWith("blob:")
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      results.urlCreateObjectURLSupport = false
      results.urlCreateObjectURLWorking = false
      results.urlError = String(error)
    }

    // Check for download attribute support
    results.downloadAttributeSupport = "download" in document.createElement("a")

    // Check for FileSaver.js
    try {
      await new Promise<void>((resolve) => {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"
        script.onload = () => resolve()
        script.onerror = () => {
          results.fileSaverLoadError = "Failed to load FileSaver.js"
          resolve()
        }
        document.body.appendChild(script)
        setTimeout(() => {
          if (!results.fileSaverLoadError) {
            resolve()
          }
        }, 3000)
      })

      results.fileSaverAvailable = typeof window.saveAs === "function"
    } catch (error) {
      results.fileSaverAvailable = false
      results.fileSaverError = String(error)
    }

    // Check for html2pdf.js
    try {
      await new Promise<void>((resolve) => {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        script.onload = () => resolve()
        script.onerror = () => {
          results.html2pdfLoadError = "Failed to load html2pdf.js"
          resolve()
        }
        document.body.appendChild(script)
        setTimeout(() => {
          if (!results.html2pdfLoadError) {
            resolve()
          }
        }, 3000)
      })

      results.html2pdfAvailable = typeof window.html2pdf === "function"
    } catch (error) {
      results.html2pdfAvailable = false
      results.html2pdfError = String(error)
    }

    setDiagnosticResults(results)
    setIsRunning(false)
  }

  const allPassed = Object.entries(diagnosticResults)
    .filter(([key]) => !key.includes("Error"))
    .every(([_, value]) => value === true)

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Export Diagnostics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          If you're having trouble exporting your resume, run this diagnostic to identify any issues.
        </p>

        <Button onClick={runDiagnostics} variant="outline" size="sm" disabled={isRunning}>
          {isRunning ? "Running Diagnostics..." : "Run Export Diagnostics"}
        </Button>

        {showDiagnostics && (
          <div className="mt-4">
            <Alert variant={allPassed ? "default" : "destructive"}>
              {allPassed ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>
                {allPassed
                  ? "All checks passed! Your browser supports all required export features."
                  : "Some checks failed. Please review the details below."}
              </AlertDescription>
            </Alert>

            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium">Browser Capabilities:</h3>
              <ul className="space-y-1 text-sm">
                <li className={diagnosticResults.browserEnvironment ? "text-green-600" : "text-red-600"}>
                  Browser Environment: {diagnosticResults.browserEnvironment ? "Available ✓" : "Not Available ✗"}
                </li>
                <li className={diagnosticResults.blobSupport ? "text-green-600" : "text-red-600"}>
                  Blob Support: {diagnosticResults.blobSupport ? "Available ✓" : "Not Available ✗"}
                </li>
                <li className={diagnosticResults.blobCreation ? "text-green-600" : "text-red-600"}>
                  Blob Creation: {diagnosticResults.blobCreation ? "Working ✓" : "Not Working ✗"}
                </li>
                <li className={diagnosticResults.urlCreateObjectURLSupport ? "text-green-600" : "text-red-600"}>
                  URL.createObjectURL: {diagnosticResults.urlCreateObjectURLSupport ? "Available ✓" : "Not Available ✗"}
                </li>
                <li className={diagnosticResults.downloadAttributeSupport ? "text-green-600" : "text-red-600"}>
                  Download Attribute: {diagnosticResults.downloadAttributeSupport ? "Supported ✓" : "Not Supported ✗"}
                </li>
              </ul>

              <h3 className="text-sm font-medium">Required Libraries:</h3>
              <ul className="space-y-1 text-sm">
                <li className={diagnosticResults.fileSaverAvailable ? "text-green-600" : "text-red-600"}>
                  FileSaver.js: {diagnosticResults.fileSaverAvailable ? "Available ✓" : "Not Available ✗"}
                  {diagnosticResults.fileSaverLoadError && (
                    <span className="text-red-600"> - {diagnosticResults.fileSaverLoadError}</span>
                  )}
                </li>
                <li className={diagnosticResults.html2pdfAvailable ? "text-green-600" : "text-red-600"}>
                  html2pdf.js: {diagnosticResults.html2pdfAvailable ? "Available ✓" : "Not Available ✗"}
                  {diagnosticResults.html2pdfLoadError && (
                    <span className="text-red-600"> - {diagnosticResults.html2pdfLoadError}</span>
                  )}
                </li>
              </ul>

              {!allPassed && (
                <div className="mt-4 text-sm">
                  <h3 className="font-medium">Troubleshooting Tips:</h3>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Try using a different browser (Chrome or Firefox recommended)</li>
                    <li>Make sure your browser is up to date</li>
                    <li>Disable any browser extensions that might be blocking scripts</li>
                    <li>Try using the print function as a fallback method</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
