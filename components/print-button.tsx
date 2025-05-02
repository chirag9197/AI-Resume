"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PrintButtonProps {
  className?: string
}

export function PrintButton({ className = "" }: PrintButtonProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Button variant="outline" onClick={handlePrint} className={`flex items-center gap-2 ${className}`}>
      <Printer className="h-4 w-4" />
      Print Resume
    </Button>
  )
}
