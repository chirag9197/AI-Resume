"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface DiagnosticHelperProps {
  formData: ResumeData
}

export function DiagnosticHelper({ formData }: DiagnosticHelperProps) {
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [diagnosticResults, setDiagnosticResults] = useState<Record<string, boolean>>({})
  const [showDetails, setShowDetails] = useState(false)

  const runDiagnostics = () => {
    const results: Record<string, boolean> = {}

    // Check personal info
    const personalInfo = formData.personalInfo
    results.personalInfoComplete = !!(
      personalInfo.fullName &&
      personalInfo.email &&
      personalInfo.phone &&
      personalInfo.location
    )

    // Check work experience
    results.hasWorkExperience = formData.workExperience.length > 0

    let workExperienceComplete = true
    for (const exp of formData.workExperience) {
      if (!exp.company || !exp.position || !exp.startDate || (!exp.endDate && !exp.current) || !exp.description) {
        workExperienceComplete = false
        break
      }
    }
    results.workExperienceComplete = workExperienceComplete

    // Check education
    results.hasEducation = formData.education.length > 0

    let educationComplete = true
    for (const edu of formData.education) {
      if (!edu.institution || !edu.degree || !edu.field || !edu.startDate || (!edu.endDate && !edu.current)) {
        educationComplete = false
        break
      }
    }
    results.educationComplete = educationComplete

    // Check skills
    results.hasSkills = formData.skills.length > 0

    // Check job description
    results.hasJobDescription = !!formData.jobDescription.trim()

    setDiagnosticResults(results)
    setShowDiagnostics(true)
  }

  const allPassed = Object.values(diagnosticResults).every((result) => result === true)

  return (
    <div className="mt-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-2">Resume Form Diagnostics</h3>
      <p className="text-sm text-gray-500 mb-4">
        If you're having trouble generating your resume, run this diagnostic to identify any issues.
      </p>

      <Button onClick={runDiagnostics} variant="outline" size="sm">
        Run Diagnostics
      </Button>

      {showDiagnostics && (
        <div className="mt-4">
          <Alert variant={allPassed ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {allPassed
                ? "All checks passed! Your form data is complete."
                : "Some checks failed. Please review the details below."}
            </AlertDescription>
          </Alert>

          <Button onClick={() => setShowDetails(!showDetails)} variant="link" size="sm" className="mt-2">
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>

          {showDetails && (
            <ul className="mt-2 space-y-1 text-sm">
              <li className={diagnosticResults.personalInfoComplete ? "text-green-600" : "text-red-600"}>
                Personal Information: {diagnosticResults.personalInfoComplete ? "Complete ✓" : "Incomplete ✗"}
              </li>
              <li className={diagnosticResults.hasWorkExperience ? "text-green-600" : "text-red-600"}>
                Work Experience: {diagnosticResults.hasWorkExperience ? "Added ✓" : "Missing ✗"}
              </li>
              {diagnosticResults.hasWorkExperience && (
                <li className={diagnosticResults.workExperienceComplete ? "text-green-600" : "text-red-600"}>
                  Work Experience Details: {diagnosticResults.workExperienceComplete ? "Complete ✓" : "Incomplete ✗"}
                </li>
              )}
              <li className={diagnosticResults.hasEducation ? "text-green-600" : "text-red-600"}>
                Education: {diagnosticResults.hasEducation ? "Added ✓" : "Missing ✗"}
              </li>
              {diagnosticResults.hasEducation && (
                <li className={diagnosticResults.educationComplete ? "text-green-600" : "text-red-600"}>
                  Education Details: {diagnosticResults.educationComplete ? "Complete ✓" : "Incomplete ✗"}
                </li>
              )}
              <li className={diagnosticResults.hasSkills ? "text-green-600" : "text-red-600"}>
                Skills: {diagnosticResults.hasSkills ? "Added ✓" : "Missing ✗"}
              </li>
              <li className={diagnosticResults.hasJobDescription ? "text-green-600" : "text-red-600"}>
                Job Description: {diagnosticResults.hasJobDescription ? "Added ✓" : "Missing ✗"}
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
