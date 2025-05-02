"use client"

import { useState, useEffect } from "react"
import { ResumeForm } from "@/components/resume-form"
import { ResumePreview } from "@/components/resume-preview"
import { SampleDataButton } from "@/components/sample-data-button"
import type { ResumeData, GeneratedResume } from "@/types/resume"
import { generateResume } from "./actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { DiagnosticHelper } from "@/components/diagnostic-helper"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      portfolio: "",
    },
    workExperience: [],
    education: [],
    skills: [],
    certificates: [],
    achievements: [],
    jobDescription: "",
  })

  // Load saved form data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem("resumeFormData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
      } catch (e) {
        console.error("Error parsing saved form data:", e)
      }
    }
  }, [])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("resumeFormData", JSON.stringify(formData))
  }, [formData])

  const handleSubmit = async (data: ResumeData) => {
    console.log("Starting resume generation with data:", data)

    try {
      setIsLoading(true)
      setError(null)

      // Validate data before submission
      if (!validateResumeData(data)) {
        throw new Error("Invalid resume data. Please check all required fields.")
      }

      console.log("Calling generateResume action...")
      const result = await generateResume(data)
      console.log("Resume generation successful:", result)

      // Ensure the certificates and achievements are preserved
      const completeResult: GeneratedResume = {
        ...result,
        certificates: data.certificates,
        achievements: data.achievements,
      }

      setGeneratedResume(completeResult)
      setShowPreview(true)
    } catch (error) {
      console.error("Error generating resume:", error)
      setError(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to generate resume. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Add this validation helper function
  const validateResumeData = (data: ResumeData): boolean => {
    // Basic validation to ensure we have the minimum required data
    if (!data) return false

    const { personalInfo, workExperience, education, skills, jobDescription } = data

    // Check for required fields
    if (!personalInfo || !workExperience || !education || !skills) {
      console.error("Missing required sections in resume data")
      return false
    }

    // Check if job description exists
    if (!jobDescription || jobDescription.trim() === "") {
      console.error("Missing job description")
      return false
    }

    return true
  }

  const handleBack = () => {
    setShowPreview(false)
  }

  const handleLoadSampleData = (data: ResumeData) => {
    setFormData(data)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI-Powered Resume Builder</h1>
          <p className="text-gray-600 mb-4">Create a tailored, ATS-friendly resume optimized for your target job</p>

          {!showPreview && (
            <div className="flex justify-center mb-4">
              <SampleDataButton onLoad={handleLoadSampleData} />
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showPreview && generatedResume ? (
          <ResumePreview resume={generatedResume} onBack={handleBack} />
        ) : (
          <ResumeForm onSubmit={handleSubmit} isLoading={isLoading} initialData={formData} />
        )}
      </div>
      {!showPreview && (
        <div className="mt-8">
          <DiagnosticHelper formData={formData} />
        </div>
      )}
      <Toaster />
    </main>
  )
}
