"use client"

import type React from "react"
import type { PersonalInfo } from "@/types/resume"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PersonalInfoFormProps {
  value: PersonalInfo
  onChange: (value: PersonalInfo) => void
}

export function PersonalInfoForm({ value, onChange }: PersonalInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target
    onChange({ ...value, [name]: inputValue })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={value.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={value.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={value.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={value.location}
            onChange={handleChange}
            placeholder="City, State"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedIn">LinkedIn (Optional)</Label>
          <Input
            id="linkedIn"
            name="linkedIn"
            value={value.linkedIn || ""}
            onChange={handleChange}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio/Website (Optional)</Label>
          <Input
            id="portfolio"
            name="portfolio"
            value={value.portfolio || ""}
            onChange={handleChange}
            placeholder="johndoe.com"
          />
        </div>
      </div>
    </div>
  )
}
