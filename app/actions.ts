"use server"

import { generateResumeWithGroq } from "@/lib/groq"
import type { ResumeData, GeneratedResume } from "@/types/resume"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

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

export async function generateWorkExperience(prompt: string): Promise<string> {
  console.log("Server action: generateWorkExperience called")

  try {
    if (!prompt || prompt.trim() === "") {
      throw new Error("Prompt is required for work experience generation.")
    }

    // Create a more specific prompt for work experience generation
    const workExperiencePrompt = `
You are an expert resume writer. Generate a professional work experience description based on the following information:

${prompt}

Please generate 3-4 bullet points that:
1. Highlight key responsibilities and achievements
2. Use action verbs and quantifiable results where possible
3. Are concise and impactful
4. Are formatted with bullet points (•)

Return ONLY the bullet points, with each point on a new line starting with "• ".
Do not include any other text or formatting.
`

    // Call the Groq API to generate work experience description
    const response = await generateResumeWithGroq(
      {
        personalInfo: { name: "", email: "", phone: "", location: "" },
        workExperience: [{
          id: "temp",
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: ""
        }],
        education: [],
        skills: [],
        jobDescription: workExperiencePrompt,
      },
      workExperiencePrompt
    )

    if (!response || !response.workExperience || response.workExperience.length === 0) {
      throw new Error("Failed to generate work experience description.")
    }

    // Format the description to ensure proper bullet points
    const description = response.workExperience[0].description
    const formattedDescription = description
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => line.startsWith('•') ? line : `• ${line}`)
      .join('\n')

    return formattedDescription
  } catch (error) {
    console.error("Error in generateWorkExperience action:", error)
    throw new Error(
      error instanceof Error
        ? `Work experience generation failed: ${error.message}`
        : "Failed to generate work experience description. Please try again."
    )
  }
}

export async function generateAchievement(prompt: string): Promise<string> {
  console.log("Server action: generateAchievement called")

  try {
    if (!prompt || prompt.trim() === "") {
      throw new Error("Prompt is required for achievement generation.")
    }

    // Create a more specific prompt for achievement generation
    const achievementPrompt = `
You are an expert resume writer. Generate a professional achievement description based on the following information:

${prompt}

Please generate a concise achievement description that:
1. Highlights the impact and significance of the achievement
2. Uses action verbs and quantifiable results where possible
3. Is professional and impactful
4. Focuses on the outcome and value created

Return ONLY the achievement description text, without any formatting or additional text.
`

    // Call the Groq API directly for achievement generation
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: achievementPrompt,
      temperature: 0.7,
      maxTokens: 200,
    })

    // Clean up the response
    let description = text.trim()
    
    // Remove any markdown formatting or code blocks
    description = description.replace(/```[\s\S]*?```/g, '')
    description = description.replace(/`/g, '')
    
    // Remove any JSON formatting
    description = description.replace(/[{}[\]]/g, '')
    
    // Remove any quotes
    description = description.replace(/["']/g, '')
    
    // Clean up any extra whitespace
    description = description.replace(/\s+/g, ' ').trim()

    if (!description) {
      throw new Error("Failed to generate achievement description.")
    }

    return description
  } catch (error) {
    console.error("Error in generateAchievement action:", error)
    throw new Error(
      error instanceof Error
        ? `Achievement generation failed: ${error.message}`
        : "Failed to generate achievement description. Please try again."
    )
  }
}
