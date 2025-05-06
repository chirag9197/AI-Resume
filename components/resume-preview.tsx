"use client"

import { useRef } from "react"
import type { GeneratedResume, TemplateType } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, Linkedin, Globe, Award, BadgeIcon as Certificate } from "lucide-react"
import { ExportDiagnostics } from "@/components/export-diagnostics"
import { PdfExportButton } from "@/components/pdf-export-button"
import { templateStyles } from "./resume-form/template-styles"
import { cn } from "@/lib/utils"

interface ResumePreviewProps {
  resume: GeneratedResume
  onBack: () => void
}

export function ResumePreview({ resume, onBack }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null)
  const template = resume.template || "modern"
  const styles = templateStyles[template]

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
        <div className="flex gap-2">
          <PdfExportButton
            resumeRef={resumeRef}
            resume={resume}
          />
        </div>
      </div>

      <Card className="p-8 bg-white shadow-md">
        <div
          ref={resumeRef}
          className={cn("resume-container w-full max-w-[8.5in] mx-auto bg-white text-black print:shadow-none", styles.container)}
          style={{ minHeight: "11in" }}
        >
          {/* Header */}
          <div className={cn(styles.header)}>
            <h1 className={styles.name}>{resume.personalInfo.fullName}</h1>
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
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Professional Summary</h2>
              <p className={styles.itemDescription}>{resume.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {resume.workExperience && resume.workExperience.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Work Experience</h2>
              <div className={styles.list}>
                {resume.workExperience.map((exp) => (
                  <div key={exp.id} className={styles.item}>
                    <div className="flex justify-between items-baseline">
                      <h3 className={styles.itemTitle}>{exp.position}</h3>
                      <span className={styles.itemDate}>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className={styles.itemSubtitle}>{exp.company}</div>
                    <ul className="list-none mt-1">
                      {exp.description.split("\n").map((bullet, i) => (
                        <li key={i} className={styles.itemDescription}>
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
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              <div className={styles.list}>
                {resume.education.map((edu) => (
                  <div key={edu.id} className={styles.item}>
                    <div className="flex justify-between items-baseline">
                      <h3 className={styles.itemTitle}>
                        {edu.degree} in {edu.field}
                      </h3>
                      <span className={styles.itemDate}>
                        {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                      </span>
                    </div>
                    <div className={styles.itemSubtitle}>{edu.institution}</div>
                    {edu.description && <p className={styles.itemDescription}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {resume.certificates && resume.certificates.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Certificates</h2>
              <div className={styles.list}>
                {resume.certificates.map((cert) => (
                  <div key={cert.id} className={styles.item}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Certificate className="h-3 w-3 mr-1" />
                          <h3 className={styles.itemTitle}>
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
                        <p className={styles.itemDescription}>
                          {cert.issuer}
                          {cert.description && <span className="italic"> - {cert.description}</span>}
                        </p>
                      </div>
                      <span className={styles.itemDate}>{formatDate(cert.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {resume.achievements && resume.achievements.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Achievements</h2>
              <div className={styles.list}>
                {resume.achievements.map((achievement) => (
                  <div key={achievement.id} className={styles.item}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Award className="h-3 w-3 mr-1" />
                          <h3 className={styles.itemTitle}>{achievement.title}</h3>
                        </div>
                        <p className={styles.itemDescription}>{achievement.description}</p>
                      </div>
                      {achievement.date && <span className={styles.itemDate}>{formatDate(achievement.date)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span key={index} className={cn("text-xs px-2 py-1 rounded", styles.item)}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Sections */}
          {resume.additionalSections && Object.keys(resume.additionalSections).length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Additional Sections</h2>
              <div className={styles.list}>
                {Object.entries(resume.additionalSections).map(([title, content]) => (
                  <div key={title} className={styles.item}>
                    <h3 className={styles.itemTitle}>{title}</h3>
                    <p className={styles.itemDescription}>{content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <ExportDiagnostics />
    </div>
  )
}
