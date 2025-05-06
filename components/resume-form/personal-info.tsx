"use client"

import type React from "react"
import type { PersonalInfo } from "@/types/resume"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PersonalInfoFormProps {
  value: PersonalInfo
  onChange: (value: PersonalInfo) => void
}

export function PersonalInfoForm({ value, onChange }: PersonalInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target
    onChange({ ...value, [name]: inputValue })
  }

  const fields = [
    {
      id: "fullName",
      label: "Full Name",
      icon: null,
      placeholder: "chirag Patidar",
      required: true,
      tooltip: "Enter your full name as it should appear on your resume",
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      placeholder: "chirag.Patidar@example.com",
      required: true,
      tooltip: "Enter your professional email address",
    },
    {
      id: "phone",
      label: "Phone",
      icon: Phone,
      placeholder: "(123) 456-7890",
      required: true,
      tooltip: "Enter your phone number in a professional format",
    },
    {
      id: "location",
      label: "Location",
      icon: MapPin,
      placeholder: "City, State",
      required: true,
      tooltip: "Enter your city and state/country",
    },
    {
      id: "linkedIn",
      label: "LinkedIn Profile",
      icon: Linkedin,
      placeholder: "linkedin.com/in/chiragPatidar",
      required: false,
      tooltip: "Enter your LinkedIn profile URL (optional)",
    },
    {
      id: "portfolio",
      label: "Portfolio/Website",
      icon: Globe,
      placeholder: "chiragPatidar.com",
      required: false,
      tooltip: "Enter your portfolio or personal website URL (optional)",
    },
  ]

  return (
    <div className="space-y-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill in your personal details to create a professional resume
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{field.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                {field.icon && (
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                  id={field.id}
                  name={field.id}
                  value={value[field.id as keyof PersonalInfo] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className={`w-full ${field.icon ? "pl-9" : ""}`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  )
}
