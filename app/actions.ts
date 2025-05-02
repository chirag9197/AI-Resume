"use server"

import { generateResumeWithGroq } from "@/lib/groq"
import type { ResumeData, GeneratedResume } from "@/types/resume"

export async function generateResume(data: ResumeData): Promise<GeneratedResume> {
  console.log("Server action: generateResume called")

  try {
    // Validate input data
    if (!data || !data.personalInfo || !data.workExperience || !data.education || !data.skills) {
      console.error("Invalid resume data received:", data)
      throw new Error("Invalid resume data. Missing required sections.")
    }

    if (!data.jobDescription || data.jobDescription.trim() === "") {
      console.error("Missing job description")
      throw new Error("Job description is required.")
    }

    console.log("Calling generateResumeWithGroq...")
    const generatedResume = await generateResumeWithGroq(data, data.jobDescription)
    console.log("Generated resume successfully")

    // Validate the response
    if (!generatedResume || !generatedResume.summary) {
      console.error("Invalid response from AI model:", generatedResume)
      throw new Error("Failed to generate a valid resume. Please try again.")
    }

    // Ensure the personal info, certificates, and achievements are preserved
    return {
      ...generatedResume,
      personalInfo: data.personalInfo,
      certificates: data.certificates || [],
      achievements: data.achievements || [],
    }
  } catch (error) {
    console.error("Error in generateResume action:", error)
    // Rethrow with a more user-friendly message
    throw new Error(
      error instanceof Error
        ? `Resume generation failed: ${error.message}`
        : "Failed to generate resume. Please try again.",
    )
  }
}
