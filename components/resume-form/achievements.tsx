"use client"
import type { Achievement } from "@/types/resume"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Sparkles } from "lucide-react"
import { AIGeneratorButton } from "./ai-generator-button"
import { generateAchievement } from "@/app/actions"

interface AchievementsFormProps {
  value: Achievement[]
  onChange: (value: Achievement[]) => void
}

export function AchievementsForm({ value, onChange }: AchievementsFormProps) {
  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: crypto.randomUUID(),
      title: "",
      date: "",
      description: "",
    }
    onChange([...value, newAchievement])
  }

  const updateAchievement = (index: number, field: keyof Achievement, fieldValue: any) => {
    const updatedAchievements = [...value]
    updatedAchievements[index] = {
      ...updatedAchievements[index],
      [field]: fieldValue,
    }
    onChange(updatedAchievements)
  }

  const removeAchievement = (index: number) => {
    const updatedAchievements = [...value]
    updatedAchievements.splice(index, 1)
    onChange(updatedAchievements)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Achievements</h2>
        <Button type="button" variant="outline" size="sm" onClick={addAchievement} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Achievement
        </Button>
      </div>

      {value.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No achievements added. Click the button above to add your notable accomplishments.
        </div>
      )}

      {value.map((achievement, index) => (
        <div key={achievement.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Achievement {index + 1}</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeAchievement(index)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`achievement-title-${index}`}>Achievement Title</Label>
              <Input
                id={`achievement-title-${index}`}
                value={achievement.title}
                onChange={(e) => updateAchievement(index, "title", e.target.value)}
                placeholder="Employee of the Year"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`achievement-date-${index}`}>Date (Optional)</Label>
              <Input
                id={`achievement-date-${index}`}
                type="month"
                value={achievement.date || ""}
                onChange={(e) => updateAchievement(index, "date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor={`achievement-description-${index}`}>Description</Label>
              <AIGeneratorButton
                onGenerate={async (prompt) => await generateAchievement(prompt)}
                onContentGenerated={(content) => updateAchievement(index, "description", content)}
                placeholder="Describe your achievement and its impact..."
                label={<span className="flex items-center gap-1"><Sparkles className="h-4 w-4 text-primary" /> Generate with AI</span>}
                initialPrompt={achievement.description}
              />
            </div>
            <Textarea
              id={`achievement-description-${index}`}
              value={achievement.description}
              onChange={(e) => updateAchievement(index, "description", e.target.value)}
              placeholder="Describe your achievement and its impact"
              rows={3}
              required
            />
          </div>
        </div>
      ))}
    </div>
  )
}
