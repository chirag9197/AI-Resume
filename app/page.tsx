"use client"

import { useState, useEffect } from "react"
import { ResumeForm } from "@/components/resume-form"
import { ResumePreview } from "@/components/resume-preview"
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
  const [formData, setFormData] = useState<ResumeData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem("resumeFormData")
      if (savedData) {
        try {
          return JSON.parse(savedData)
        } catch (e) {
          console.error("Error parsing saved form data:", e)
        }
      }
    }
    return {
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
    }
  })

  useEffect(() => {
    localStorage.setItem("resumeFormData", JSON.stringify(formData))
  }, [formData])

  const handleSubmit = async (data: ResumeData) => {
    try {
      setIsLoading(true)
      setError(null)

      if (!validateResumeData(data)) {
        throw new Error("Invalid resume data. Please check all required fields.")
      }

      const result = await generateResume(data)
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

  const validateResumeData = (data: ResumeData): boolean => {
    if (!data) return false
    
    const { personalInfo, workExperience, education, skills, jobDescription } = data
    
    // Check if required fields are present and not empty
    if (!personalInfo?.fullName?.trim()) {
      setError("Please enter your full name")
      return false
    }
    
    if (!personalInfo?.email?.trim()) {
      setError("Please enter your email")
      return false
    }
    
    if (!workExperience?.length) {
      setError("Please add at least one work experience")
      return false
    }
    
    if (!education?.length) {
      setError("Please add at least one education entry")
      return false
    }
    
    if (!skills?.length) {
      setError("Please add at least one skill")
      return false
    }
    
    if (!jobDescription?.trim()) {
      setError("Please enter a job description")
      return false
    }
    
    return true
  }

  const handleBack = () => {
    setShowPreview(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Create Your Professional Resume
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Build a tailored, ATS-friendly resume that highlights your skills and experience
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-8 max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
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
        </div>
      </div>
      <Toaster />
    </main>
  )
}
