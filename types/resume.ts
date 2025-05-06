export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedIn?: string
  portfolio?: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description?: string
}

export interface Skill {
  id: string
  name: string
}

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
  date?: string
  description: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  certificates: Certificate[]
  achievements: Achievement[]
  jobDescription: string
}

export interface GeneratedResume {
  personalInfo: PersonalInfo
  summary: string
  workExperience: WorkExperience[]
  education: Education[]
  skills: string[]
  certificates: Certificate[]
  achievements: Achievement[]
  additionalSections?: Record<string, string>
}
