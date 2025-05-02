"use client"

import type React from "react"

import { useState } from "react"
import type {
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Certificate,
  Achievement,
} from "@/types/resume"
import { PersonalInfoForm } from "./resume-form/personal-info"
import { WorkExperienceForm } from "./resume-form/work-experience"
import { EducationForm } from "./resume-form/education"
import { SkillsForm } from "./resume-form/skills"
import { CertificatesForm } from "./resume-form/certificates"
import { AchievementsForm } from "./resume-form/achievements"
import { JobDescriptionForm } from "./resume-form/job-description"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ResumeFormProps {
  onSubmit: (data: ResumeData) => Promise<void>
  isLoading: boolean
  initialData?: ResumeData
}

export function ResumeForm({ onSubmit, isLoading, initialData }: ResumeFormProps) {
  const [formData, setFormData] = useState<ResumeData>(
    initialData || {
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
    },
  )

  const updatePersonalInfo = (personalInfo: PersonalInfo) => {
    setFormData((prev) => ({ ...prev, personalInfo }))
  }

  const updateWorkExperience = (workExperience: WorkExperience[]) => {
    setFormData((prev) => ({ ...prev, workExperience }))
  }

  const updateEducation = (education: Education[]) => {
    setFormData((prev) => ({ ...prev, education }))
  }

  const updateSkills = (skills: Skill[]) => {
    setFormData((prev) => ({ ...prev, skills }))
  }

  const updateCertificates = (certificates: Certificate[]) => {
    setFormData((prev) => ({ ...prev, certificates }))
  }

  const updateAchievements = (achievements: Achievement[]) => {
    setFormData((prev) => ({ ...prev, achievements }))
  }

  const updateJobDescription = (jobDescription: string) => {
    setFormData((prev) => ({ ...prev, jobDescription }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Log form data for debugging
    console.log("Submitting form data:", formData)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const isFormValid = () => {
    const { personalInfo, workExperience, education, skills, jobDescription } = formData

    // Check personal info
    const personalInfoValid = personalInfo.fullName && personalInfo.email && personalInfo.phone && personalInfo.location

    // Check work experience
    let workExperienceValid = workExperience.length > 0

    if (workExperienceValid) {
      for (const exp of workExperience) {
        if (!exp.company || !exp.position || !exp.startDate || (!exp.endDate && !exp.current) || !exp.description) {
          workExperienceValid = false
          break
        }
      }
    }

    // Check education
    let educationValid = education.length > 0

    if (educationValid) {
      for (const edu of education) {
        if (!edu.institution || !edu.degree || !edu.field || !edu.startDate || (!edu.endDate && !edu.current)) {
          educationValid = false
          break
        }
      }
    }

    // Check skills
    const skillsValid = skills.length > 0

    // Check job description
    const jobDescriptionValid = jobDescription.trim() !== ""

    // Log validation results for debugging
    console.log("Form validation results:", {
      personalInfoValid,
      workExperienceValid,
      educationValid,
      skillsValid,
      jobDescriptionValid,
    })

    return personalInfoValid && workExperienceValid && educationValid && skillsValid && jobDescriptionValid
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="job">Job Description</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardContent className="pt-6">
              <PersonalInfoForm value={formData.personalInfo} onChange={updatePersonalInfo} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardContent className="pt-6">
              <WorkExperienceForm value={formData.workExperience} onChange={updateWorkExperience} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardContent className="pt-6">
              <EducationForm value={formData.education} onChange={updateEducation} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardContent className="pt-6">
              <SkillsForm value={formData.skills} onChange={updateSkills} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardContent className="pt-6">
              <CertificatesForm value={formData.certificates} onChange={updateCertificates} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardContent className="pt-6">
              <AchievementsForm value={formData.achievements} onChange={updateAchievements} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job">
          <Card>
            <CardContent className="pt-6">
              <JobDescriptionForm value={formData.jobDescription} onChange={updateJobDescription} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !isFormValid()}
          className="min-w-[150px]"
          onClick={(e) => {
            if (!isFormValid()) {
              e.preventDefault()
              console.log("Form validation failed, button clicked but submission prevented")
              return
            }
            console.log("Submit button clicked, form is valid")
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Resume"
          )}
        </Button>
      </div>
    </form>
  )
}
