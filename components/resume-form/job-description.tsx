"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface JobDescriptionFormProps {
  value: string
  onChange: (value: string) => void
}

export function JobDescriptionForm({ value, onChange }: JobDescriptionFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Job Description</h2>
      <p className="text-muted-foreground">
        Paste the job description here. Our AI will analyze it to tailor your resume for better ATS matching.
      </p>
      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description</Label>
        <Textarea
          id="jobDescription"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={8}
          required
        />
      </div>
    </div>
  )
}
