"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type React from "react"

interface AIGeneratorButtonProps {
  onGenerate: (prompt: string) => Promise<string>
  onContentGenerated: (content: string) => void
  placeholder: string
  label: React.ReactNode
  initialPrompt?: string
}

export function AIGeneratorButton({
  onGenerate,
  onContentGenerated,
  placeholder,
  label,
  initialPrompt = "",
}: AIGeneratorButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setPrompt(initialPrompt)
    }
  }, [isOpen, initialPrompt])

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      const content = await onGenerate(prompt)
      onContentGenerated(content)
      setIsOpen(false)
      setPrompt("")
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="secondary" className="flex items-center gap-1 px-3 py-1 text-xs font-medium border border-primary/30 bg-primary/10 hover:bg-primary/20">
                {label}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Content with AI</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={placeholder}
                  className="min-h-[100px]"
                />
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!prompt || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent side="top">
          Generate a professional description with AI
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 