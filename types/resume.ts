export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedIn: string
  portfolio: string
}

export interface WorkExperience {
  id: string
  position: string
  company: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  field: string
  institution: string
  startDate: string
  endDate: string
  current: boolean
  description?: string
}

export type Skill = string

export interface Certificate {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
  description?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date?: string
}

export type TemplateType = "modern" | "minimal"

export interface ResumeData {
  personalInfo: PersonalInfo
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  certificates: Certificate[]
  achievements: Achievement[]
  jobDescription: string
  template: TemplateType
}

export interface GeneratedResume extends ResumeData {
  summary?: string
  additionalSections?: Record<string, string>
}
