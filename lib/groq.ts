import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function generateResumeWithGroq(resumeData: any, jobDescription: string) {
  console.log("Starting AI resume generation with Groq")

  if (!resumeData || !jobDescription) {
    throw new Error("Missing required data for resume generation")
  }

  const prompt = `
You are an expert resume writer and career coach. Your task is to create a tailored, ATS-friendly resume based on the candidate's information and the job description they're applying for.

CANDIDATE INFORMATION:
${JSON.stringify(resumeData, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Please generate a professional resume that:
1. Starts with a compelling summary that highlights the candidate's most relevant qualifications for this specific job
2. Tailors their work experience to emphasize achievements and responsibilities that match the job requirements
3. For each work experience, create 3-4 concise bullet points that highlight key responsibilities, achievements, and contributions
4. Optimizes for ATS keyword matching while maintaining readability
5. Is concise and fits on a single page
6. Uses action verbs and quantifiable achievements where possible
7. Prioritizes skills that match the job description

IMPORTANT: You MUST return ONLY a valid JSON object with the following structure and nothing else:
{
  "summary": "Professional summary paragraph",
  "workExperience": [
    {
      "id": "unique-id",
      "company": "Company name",
      "position": "Position title",
      "startDate": "Start date",
      "endDate": "End date or 'Present'",
      "current": boolean,
      "description": "• First bullet point\\n• Second bullet point\\n• Third bullet point\\n• Fourth bullet point"
    }
  ],
  "education": [Keep education as provided, but prioritize relevant aspects],
  "skills": ["Skill 1", "Skill 2", ...],
  "additionalSections": {
    "sectionName": "content"
  }
}

IMPORTANT: Format each work experience description as 3-4 bullet points, with each bullet point starting with "• " and separated by "\\n".

Do not include any explanations, markdown formatting, or text outside the JSON object. Return ONLY the JSON object.
`

  try {
    console.log("Calling Groq API...")

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
      maxTokens: 4000,
    })

    console.log("Received response from Groq API")

    // Try to extract JSON from the response if it's not already valid JSON
    let jsonResponse = text.trim()

    // If response starts with text like "Here is..." or contains markdown code blocks, try to extract the JSON
    if (!jsonResponse.startsWith("{")) {
      console.log("Response is not valid JSON, attempting to extract JSON content")

      // Look for JSON between code blocks
      const jsonMatch = jsonResponse.match(/```(?:json)?([\s\S]*?)```/)
      if (jsonMatch && jsonMatch[1]) {
        jsonResponse = jsonMatch[1].trim()
        console.log("Extracted JSON from code block")
      } else {
        // Try to find the first { and last }
        const startIndex = jsonResponse.indexOf("{")
        const endIndex = jsonResponse.lastIndexOf("}")
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonResponse = jsonResponse.substring(startIndex, endIndex + 1)
          console.log("Extracted JSON using bracket matching")
        }
      }
    }

    try {
      const parsedResponse = JSON.parse(jsonResponse)
      console.log("Successfully parsed JSON response")

      // Validate the parsed response
      if (!parsedResponse.summary) {
        console.warn("Response missing summary, adding default")
        parsedResponse.summary = "Professional with experience in the field."
      }

      if (
        !parsedResponse.workExperience ||
        !Array.isArray(parsedResponse.workExperience) ||
        parsedResponse.workExperience.length === 0
      ) {
        console.warn("Response missing or invalid work experience, using original data")
        parsedResponse.workExperience = resumeData.workExperience
      }

      if (
        !parsedResponse.education ||
        !Array.isArray(parsedResponse.education) ||
        parsedResponse.education.length === 0
      ) {
        console.warn("Response missing or invalid education, using original data")
        parsedResponse.education = resumeData.education
      }

      if (!parsedResponse.skills || !Array.isArray(parsedResponse.skills) || parsedResponse.skills.length === 0) {
        console.warn("Response missing or invalid skills, using original data")
        parsedResponse.skills = resumeData.skills.map((skill: any) => skill.name)
      }

      return parsedResponse
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError)
      console.log("Raw response:", text)

      // Fallback: Create a basic structure with the original data
      console.log("Using fallback resume structure")
      return {
        summary: "We encountered an issue generating your resume. Here's a basic version based on your information.",
        workExperience: resumeData.workExperience.map((exp: any) => ({
          ...exp,
          description: exp.description.includes("•")
            ? exp.description
            : `• ${exp.description.split(". ").join("\n• ")}`,
        })),
        education: resumeData.education,
        skills: resumeData.skills.map((skill: any) => skill.name),
        additionalSections: {},
      }
    }
  } catch (error) {
    console.error("Error generating resume with Groq:", error)
    throw new Error("Failed to generate resume with AI. Please try again or check your network connection.")
  }
}
