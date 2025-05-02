"use client"
import type { Education } from "@/types/resume"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Trash2 } from "lucide-react"

// Import the getCourseworkSuggestions function at the top of the file
import { getCourseworkSuggestions } from "@/utils/education-suggestions"

interface EducationFormProps {
  value: Education[]
  onChange: (value: Education[]) => void
}

export function EducationForm({ value, onChange }: EducationFormProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    onChange([...value, newEducation])
  }

  // Modify the updateEducation function to auto-generate coursework when degree and field are updated
  const updateEducation = (index: number, field: keyof Education, fieldValue: any) => {
    const updatedEducation = [...value]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: fieldValue,
    }

    // Auto-generate coursework suggestions when both degree and field are filled
    if (
      (field === "degree" || field === "field") &&
      updatedEducation[index].degree &&
      updatedEducation[index].field &&
      !updatedEducation[index].description
    ) {
      updatedEducation[index].description = getCourseworkSuggestions(
        updatedEducation[index].degree,
        updatedEducation[index].field,
      )
    }

    onChange(updatedEducation)
  }

  const removeEducation = (index: number) => {
    const updatedEducation = [...value]
    updatedEducation.splice(index, 1)
    onChange(updatedEducation)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Education</h2>
        <Button type="button" variant="outline" size="sm" onClick={addEducation} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {value.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No education added. Click the button above to add your educational background.
        </div>
      )}

      {value.map((education, index) => (
        <div key={education.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Education {index + 1}</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(index)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`institution-${index}`}>Institution</Label>
              <Input
                id={`institution-${index}`}
                value={education.institution}
                onChange={(e) => updateEducation(index, "institution", e.target.value)}
                placeholder="University/College Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`degree-${index}`}>Degree</Label>
              <Input
                id={`degree-${index}`}
                value={education.degree}
                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                placeholder="Bachelor's, Master's, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`field-${index}`}>Field of Study</Label>
              <Input
                id={`field-${index}`}
                value={education.field}
                onChange={(e) => updateEducation(index, "field", e.target.value)}
                placeholder="Computer Science, Business, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`startDate-${index}`}>Start Date</Label>
              <Input
                id={`startDate-${index}`}
                type="month"
                value={education.startDate}
                onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${index}`}
                    checked={education.current}
                    onCheckedChange={(checked) => {
                      // Convert the checked value to a boolean
                      const isChecked = checked === true

                      // Update the current status
                      updateEducation(index, "current", isChecked)

                      // If checked, clear the end date
                      if (isChecked) {
                        updateEducation(index, "endDate", "")
                      }
                    }}
                  />
                  <Label htmlFor={`current-${index}`} className="text-sm cursor-pointer">
                    Current
                  </Label>
                </div>
              </div>
              <Input
                id={`endDate-${index}`}
                type="month"
                value={education.endDate}
                onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                disabled={education.current}
                required={!education.current}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${index}`}>Description (Optional)</Label>
            <Textarea
              id={`description-${index}`}
              value={education.description || ""}
              onChange={(e) => updateEducation(index, "description", e.target.value)}
              placeholder="Relevant coursework, achievements, etc."
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
