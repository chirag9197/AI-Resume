"use client"

import type React from "react"
import { useState } from "react"
import type { WorkExperience } from "@/types/resume"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Briefcase, Sparkles, Loader2 } from "lucide-react"
import { AIGeneratorButton } from "./ai-generator-button"
import { generateWorkExperience } from "@/app/actions"

interface WorkExperienceFormProps {
  value: WorkExperience[]
  onChange: (value: WorkExperience[]) => void
}

export function WorkExperienceForm({ value, onChange }: WorkExperienceFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAddExperience = () => {
    onChange([
      ...value,
      {
        id: crypto.randomUUID(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ])
  }

  const handleRemoveExperience = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleChange = (
    index: number,
    field: keyof WorkExperience,
    newValue: string | boolean
  ) => {
    const newExperiences = [...value]
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: newValue,
    }
    onChange(newExperiences)
  }

  const handleGenerateDescription = async (index: number, prompt: string) => {
    try {
      setIsGenerating(true)
      const generatedDescription = await generateWorkExperience(prompt)
      handleChange(index, "description", generatedDescription)
    } catch (error) {
      console.error("Error generating description:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">Work Experience</h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAddExperience}
          className="text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-4 ml-7">Add your relevant work history. Start with your most recent role.</p>
      <div className="space-y-6">
        {value.map((experience, index) => (
          <Card key={experience.id} className="rounded-xl shadow-sm border border-muted bg-white/90 transition-shadow hover:shadow-md">
            <CardContent className="pt-6 pb-4 px-4 space-y-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Experience {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveExperience(index)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Remove Experience"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={experience.company}
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                  placeholder="Company Name"
                  className="border border-muted rounded-lg bg-muted/40 focus:bg-white focus:border-primary transition-colors"
                />
                <Input
                  value={experience.position}
                  onChange={(e) => handleChange(index, "position", e.target.value)}
                  placeholder="Job Title"
                  className="border border-muted rounded-lg bg-muted/40 focus:bg-white focus:border-primary transition-colors"
                />
                <Input
                  type="date"
                  value={experience.startDate}
                  onChange={(e) => handleChange(index, "startDate", e.target.value)}
                  className="border border-muted rounded-lg bg-muted/40 focus:bg-white focus:border-primary transition-colors"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={experience.endDate}
                    onChange={(e) => handleChange(index, "endDate", e.target.value)}
                    disabled={experience.current}
                    className="border border-muted rounded-lg bg-muted/40 focus:bg-white focus:border-primary transition-colors"
                  />
                  <label className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                    <input
                      type="checkbox"
                      checked={experience.current}
                      onChange={(e) => handleChange(index, "current", e.target.checked)}
                      className="rounded border-muted focus:ring-primary"
                    />
                    Current
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <AIGeneratorButton
                    onGenerate={async (prompt) => await generateWorkExperience(prompt)}
                    onContentGenerated={(content) =>
                      handleChange(index, "description", content)
                    }
                    placeholder="Describe your role, responsibilities, and achievements..."
                    label={<span className="flex items-center gap-1"><Sparkles className="h-4 w-4 text-primary" /> Generate with AI</span>}
                    initialPrompt={experience.description}
                  />
                </div>
                <div className="relative">
                  <Textarea
                    value={experience.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    className="min-h-[90px] border border-muted rounded-lg bg-muted/40 focus:bg-white focus:border-primary transition-colors pr-10"
                  />
                  {isGenerating && (
                    <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-primary/70" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
