"use client"

import { Button } from "@/components/ui/button"
import type { ResumeData } from "@/types/resume"

interface SampleDataButtonProps {
  onLoad: (data: ResumeData) => void
}

export function SampleDataButton({ onLoad }: SampleDataButtonProps) {
  const loadSampleData = () => {
    const sampleData: ResumeData = {
      personalInfo: {
        fullName: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        linkedIn: "linkedin.com/in/alexjohnson",
        portfolio: "alexjohnson.dev",
      },
      workExperience: [
        {
          id: "exp1",
          company: "Tech Innovations Inc.",
          position: "Senior Frontend Developer",
          startDate: "2020-03",
          endDate: "",
          current: true,
          description:
            "• Led a team of 5 developers in redesigning the company's flagship product\n• Improved application performance by 40% through code optimization\n• Implemented CI/CD pipeline reducing deployment time by 60%\n• Mentored junior developers and conducted code reviews",
        },
        {
          id: "exp2",
          company: "Digital Solutions LLC",
          position: "Frontend Developer",
          startDate: "2017-06",
          endDate: "2020-02",
          current: false,
          description:
            "• Developed responsive web applications using React and TypeScript\n• Collaborated with UX designers to implement user-friendly interfaces\n• Reduced bug count by 30% through implementation of comprehensive testing",
        },
      ],
      education: [
        {
          id: "edu1",
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2013-09",
          endDate: "2017-05",
          current: false,
          description: "Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems",
        },
      ],
      skills: [
        { id: "skill1", name: "React" },
        { id: "skill2", name: "TypeScript" },
        { id: "skill3", name: "JavaScript" },
        { id: "skill4", name: "HTML/CSS" },
        { id: "skill5", name: "Node.js" },
        { id: "skill6", name: "Git" },
        { id: "skill7", name: "Responsive Design" },
        { id: "skill8", name: "UI/UX" },
      ],
      certificates: [
        {
          id: "cert1",
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2022-05",
          url: "https://www.credly.com/badges/example",
          description: "Professional level certification for AWS architecture",
        },
        {
          id: "cert2",
          name: "React Developer Certification",
          issuer: "Meta",
          date: "2021-08",
          url: "https://www.coursera.org/account/accomplishments/example",
          description: "Advanced React development techniques and best practices",
        },
      ],
      achievements: [
        {
          id: "ach1",
          title: "Employee of the Year",
          date: "2022-12",
          description: "Recognized for outstanding contributions to product development and team leadership",
        },
        {
          id: "ach2",
          title: "Innovation Award",
          date: "2021-06",
          description: "Developed a new feature that increased user engagement by 35%",
        },
      ],
      jobDescription: `Senior Frontend Developer

Company: TechCorp
Location: San Francisco, CA (Remote Available)

Job Description:
We are seeking an experienced Senior Frontend Developer to join our growing team. The ideal candidate will have strong experience with React, TypeScript, and modern frontend development practices.

Responsibilities:
• Develop and maintain responsive web applications using React and TypeScript
• Collaborate with UX/UI designers to implement user-friendly interfaces
• Write clean, maintainable, and efficient code
• Perform code reviews and mentor junior developers
• Optimize applications for maximum speed and scalability
• Stay up-to-date with emerging trends and technologies

Requirements:
• 3+ years of experience with React and TypeScript
• Strong understanding of frontend development principles
• Experience with responsive design and cross-browser compatibility
• Knowledge of modern frontend build tools and workflows
• Familiarity with RESTful APIs and GraphQL
• Experience with version control systems (Git)
• Bachelor's degree in Computer Science or related field (or equivalent experience)
• Strong problem-solving skills and attention to detail

Nice to Have:
• Experience with Next.js
• Knowledge of Node.js and backend development
• Experience with CI/CD pipelines
• Contributions to open-source projects

Benefits:
• Competitive salary and equity
• Health, dental, and vision insurance
• Flexible work hours and remote work options
• Professional development budget
• 401(k) matching
• Generous PTO policy`,
    }

    onLoad(sampleData)
  }

  return (
    <Button variant="outline" onClick={loadSampleData}>
      Load Sample Data
    </Button>
  )
}
