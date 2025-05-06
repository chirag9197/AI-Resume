import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { templateStyles } from "./template-styles"
import type { TemplateType } from "@/types/resume"

const templates = [
  {
    id: "modern" as const,
    name: "Modern",
    description: "Clean and professional design with modern typography",
    preview: {
      title: "John Doe",
      subtitle: "Software Engineer",
      section: "Experience",
      item: "Senior Developer at Tech Corp"
    }
  },
  {
    id: "minimal" as const,
    name: "Minimal",
    description: "Simple and elegant with focus on content",
    preview: {
      title: "John Doe",
      subtitle: "Software Engineer",
      section: "Experience",
      item: "Senior Developer at Tech Corp"
    }
  }
]

interface TemplateSelectorProps {
  selectedTemplate: TemplateType
  onTemplateChange: (template: TemplateType) => void
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <Label>Choose Template</Label>
      <RadioGroup
        value={selectedTemplate}
        onValueChange={onTemplateChange}
        className="grid grid-cols-2 gap-4"
      >
        {templates.map((template) => {
          const styles = templateStyles[template.id]
          return (
            <div key={template.id}>
              <RadioGroupItem
                value={template.id}
                id={template.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={template.id}
                className={cn(
                  "flex flex-col rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer",
                  styles.preview.background
                )}
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className={cn("font-semibold", styles.preview.text)}>{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  
                  {/* Template Preview */}
                  <div className={cn("p-4 rounded-md border", styles.preview.accent)}>
                    <h4 className={cn("text-lg font-medium mb-2", styles.name)}>{template.preview.title}</h4>
                    <p className={cn("text-sm mb-4", styles.title)}>{template.preview.subtitle}</p>
                    <div className="space-y-2">
                      <h5 className={cn("text-sm font-medium", styles.sectionTitle)}>{template.preview.section}</h5>
                      <p className={cn("text-sm", styles.itemTitle)}>{template.preview.item}</p>
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
} 