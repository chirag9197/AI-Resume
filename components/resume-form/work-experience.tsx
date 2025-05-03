"use client"
import type { WorkExperience } from "@/types/resume"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Trash2 } from "lucide-react"

interface WorkExperienceFormProps {
  value: WorkExperience[]
  onChange: (value: WorkExperience[]) => void
}

export function WorkExperienceForm({ value, onChange }: WorkExperienceFormProps) {
  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    onChange([...value, newExperience])
  }

  const updateExperience = (index: number, field: keyof WorkExperience, fieldValue: any) => {
    const updatedExperiences = [...value]
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: fieldValue,
    }
    onChange(updatedExperiences)
  }

  const removeExperience = (index: number) => {
    const updatedExperiences = [...value]
    updatedExperiences.splice(index, 1)
    onChange(updatedExperiences)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Work Experience</h2>
        <Button type="button" variant="outline" size="sm" onClick={addExperience} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {value.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No work experience added. Click the button above to add your work history.
        </div>
      )}

      {value.map((experience, index) => (
        <div key={experience.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Experience {index + 1}</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(index)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`company-${index}`}>Company</Label>
              <Input
                id={`company-${index}`}
                value={experience.company}
                onChange={(e) => updateExperience(index, "company", e.target.value)}
                placeholder="Company Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`position-${index}`}>Position</Label>
              <Input
                id={`position-${index}`}
                value={experience.position}
                onChange={(e) => updateExperience(index, "position", e.target.value)}
                placeholder="Job Title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`startDate-${index}`}>Start Date</Label>
              <Input
                id={`startDate-${index}`}
                type="month"
                value={experience.startDate}
                onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`endDate-${index}`}>End Date</Label>
              <Input
                id={`endDate-${index}`}
                type="month"
                value={experience.endDate}
                onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${index}`}>Description</Label>
            <Textarea
              id={`description-${index}`}
              value={experience.description}
              onChange={(e) => updateExperience(index, "description", e.target.value)}
              placeholder="Describe your responsibilities and achievements"
              rows={4}
              required
            />
          </div>
        </div>
      ))}
    </div>
  )
}
