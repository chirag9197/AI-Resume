"use client"

import { useRef } from "react"
import type { GeneratedResume } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, Linkedin, Globe, Award, BadgeIcon as Certificate } from "lucide-react"
import { ExportOptions } from "@/components/export-options"
import { ExportDiagnostics } from "@/components/export-diagnostics"

interface ResumePreviewProps {
  resume: GeneratedResume
  onBack: () => void
}

export function ResumePreview({ resume, onBack }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null)

  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <Button variant="outline" onClick={onBack}>
          Back to Form
        </Button>
        <ExportOptions resume={resume} resumeRef={resumeRef} />
      </div>

      <Card className="p-8 bg-white shadow-md">
        <div
          ref={resumeRef}
          className="resume-container w-full max-w-[8.5in] mx-auto bg-white text-black print:shadow-none"
          style={{ minHeight: "11in" }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{resume.personalInfo.fullName}</h1>
            <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm">
              {resume.personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  <a href={`mailto:${resume.personalInfo.email}`} className="hover:underline">
                    {resume.personalInfo.email}
                  </a>
                </div>
              )}
              {resume.personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  <a href={`tel:${resume.personalInfo.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                    {resume.personalInfo.phone}
                  </a>
                </div>
              )}
              {resume.personalInfo.location && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {resume.personalInfo.location}
                </div>
              )}
              {resume.personalInfo.linkedIn && (
                <div className="flex items-center">
                  <Linkedin className="h-3 w-3 mr-1" />
                  <a
                    href={
                      resume.personalInfo.linkedIn.startsWith("http")
                        ? resume.personalInfo.linkedIn
                        : `https://${resume.personalInfo.linkedIn}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {resume.personalInfo.linkedIn.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </div>
              )}
              {resume.personalInfo.portfolio && (
                <div className="flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  <a
                    href={
                      resume.personalInfo.portfolio.startsWith("http")
                        ? resume.personalInfo.portfolio
                        : `https://${resume.personalInfo.portfolio}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {resume.personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {resume.summary && (
            <div className="mb-4">
              <h2 className="text-lg font-bold border-b pb-1 mb-2">Professional Summary</h2>
              <p className="text-sm">{resume.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {resume.workExperience && resume.workExperience.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold border-b pb-1 mb-2">Work Experience</h2>
              <div className="space-y-3">
                {resume.workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm">{exp.position}</h3>
                      <span className="text-xs">
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{exp.company}</div>
                    <ul className="list-none mt-1">
                      {exp.description.split("\n").map((bullet, i) => (
                        <li key={i} className="text-xs ml-0 pl-0">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold border-b pb-1 mb-2">Education</h2>
              <div className="space-y-3">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm">
                        {edu.degree} in {edu.field}
                      </h3>
                      <span className="text-xs">
                        {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{edu.institution}</div>
                    {edu.description && <p className="text-xs mt-1 italic">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {resume.certificates && resume.certificates.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold border-b pb-1 mb-2">Certificates</h2>
              <div className="space-y-2">
                {resume.certificates.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <Certificate className="h-3 w-3 mr-1" />
                        <h3 className="font-medium text-sm">
                          {cert.url ? (
                            <a
                              href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {cert.name}
                            </a>
                          ) : (
                            cert.name
                          )}
                        </h3>
                      </div>
                      <p className="text-xs">
                        {cert.issuer}
                        {cert.description && <span className="italic"> - {cert.description}</span>}
                      </p>
                    </div>
                    <span className="text-xs">{formatDate(cert.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {resume.achievements && resume.achievements.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold border-b pb-1 mb-2">Achievements</h2>
              <div className="space-y-2">
                {resume.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <Award className="h-3 w-3 mr-1" />
                        <h3 className="font-medium text-sm">{achievement.title}</h3>
                      </div>
                      <p className="text-xs">{achievement.description}</p>
                    </div>
                    {achievement.date && <span className="text-xs">{formatDate(achievement.date)}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold border-b pb-1 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Sections */}
          {resume.additionalSections && Object.keys(resume.additionalSections).length > 0 && (
            <>
              {Object.entries(resume.additionalSections).map(([title, content]) => (
                <div key={title} className="mb-4">
                  <h2 className="text-lg font-bold border-b pb-1 mb-2">{title}</h2>
                  <p className="text-sm whitespace-pre-line">{content}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </Card>

      <ExportDiagnostics />
    </div>
  )
}
