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
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

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

  const [activeTab, setActiveTab] = useState("personal")
  const [progress, setProgress] = useState(0)
  const [openSection, setOpenSection] = useState<string>(activeTab)

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
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const tabs = [
    "personal",
    "experience",
    "education",
    "skills",
    "certificates",
    "achievements",
    "job",
  ]

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setOpenSection(value)
    const currentIndex = tabs.findIndex((tab) => tab === value)
    setProgress(((currentIndex + 1) / tabs.length) * 100)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-20 bg-background pb-2">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 gap-2">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Accordion for Sections */}
        <Accordion type="single" collapsible value={openSection} onValueChange={setOpenSection} className="space-y-4">
          {tabs.map((tab, idx) => (
            <AccordionItem value={tab} key={tab}>
              <AccordionTrigger className="text-lg font-semibold">
                {tab}
              </AccordionTrigger>
              <AccordionContent>
                {/* Render the section form for this tab only if open */}
                {openSection === tab && (
                  <div className="py-2">
                    {tab === "personal" && (
                      <PersonalInfoForm
                        value={formData.personalInfo}
                        onChange={updatePersonalInfo}
                      />
                    )}
                    {tab === "experience" && (
                      <WorkExperienceForm
                        value={formData.workExperience}
                        onChange={updateWorkExperience}
                      />
                    )}
                    {tab === "education" && (
                      <EducationForm
                        value={formData.education}
                        onChange={updateEducation}
                      />
                    )}
                    {tab === "skills" && (
                      <SkillsForm value={formData.skills} onChange={updateSkills} />
                    )}
                    {tab === "certificates" && (
                      <CertificatesForm
                        value={formData.certificates}
                        onChange={updateCertificates}
                      />
                    )}
                    {tab === "achievements" && (
                      <AchievementsForm
                        value={formData.achievements}
                        onChange={updateAchievements}
                      />
                    )}
                    {tab === "job" && (
                      <JobDescriptionForm
                        value={formData.jobDescription}
                        onChange={updateJobDescription}
                      />
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Sticky Action Buttons */}
        <div className="sticky bottom-0 z-20 bg-background pt-4 pb-2 flex justify-between gap-2 border-t mt-8">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => {
              const currentIndex = tabs.findIndex((tab) => tab === activeTab)
              if (currentIndex > 0) {
                handleTabChange(tabs[currentIndex - 1])
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => {
              const currentIndex = tabs.findIndex((tab) => tab === activeTab)
              if (currentIndex < tabs.length - 1) {
                handleTabChange(tabs[currentIndex + 1])
              }
            }}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
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
    </div>
  )
}
