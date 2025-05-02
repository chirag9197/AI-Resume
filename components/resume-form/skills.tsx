"use client"

import type React from "react"

import { useState } from "react"
import type { Skill } from "@/types/resume"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, X } from "lucide-react"

interface SkillsFormProps {
  value: Skill[]
  onChange: (value: Skill[]) => void
}

export function SkillsForm({ value, onChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim() === "") return

    const skill: Skill = {
      id: crypto.randomUUID(),
      name: newSkill.trim(),
    }

    onChange([...value, skill])
    setNewSkill("")
  }

  const removeSkill = (id: string) => {
    onChange(value.filter((skill) => skill.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Skills</h2>

      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill (e.g., JavaScript, Project Management)"
          className="flex-1"
        />
        <Button type="button" onClick={addSkill} disabled={newSkill.trim() === ""}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {value.length === 0 ? (
          <div className="text-muted-foreground">No skills added yet. Add your skills above.</div>
        ) : (
          value.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
              {skill.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeSkill(skill.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {skill.name}</span>
              </Button>
            </Badge>
          ))
        )}
      </div>
    </div>
  )
}
