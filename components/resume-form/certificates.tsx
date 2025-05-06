"use client"
import type { Certificate } from "@/types/resume"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"

interface CertificatesFormProps {
  value: Certificate[]
  onChange: (value: Certificate[]) => void
}

export function CertificatesForm({ value, onChange }: CertificatesFormProps) {
  const addCertificate = () => {
    const newCertificate: Certificate = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
      url: "",
    }
    onChange([...value, newCertificate])
  }

  const updateCertificate = (index: number, field: keyof Certificate, fieldValue: any) => {
    const updatedCertificates = [...value]
    updatedCertificates[index] = {
      ...updatedCertificates[index],
      [field]: fieldValue,
    }
    onChange(updatedCertificates)
  }

  const removeCertificate = (index: number) => {
    const updatedCertificates = [...value]
    updatedCertificates.splice(index, 1)
    onChange(updatedCertificates)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Certificates</h2>
        <Button type="button" variant="outline" size="sm" onClick={addCertificate} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Certificate
        </Button>
      </div>

      {value.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No certificates added. Click the button above to add your certifications.
        </div>
      )}

      {value.map((certificate, index) => (
        <div key={certificate.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Certificate {index + 1}</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeCertificate(index)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`certificate-name-${index}`}>Certificate Name</Label>
              <Input
                id={`certificate-name-${index}`}
                value={certificate.name}
                onChange={(e) => updateCertificate(index, "name", e.target.value)}
                placeholder="AWS Certified Solutions Architect"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`certificate-issuer-${index}`}>Issuing Organization</Label>
              <Input
                id={`certificate-issuer-${index}`}
                value={certificate.issuer}
                onChange={(e) => updateCertificate(index, "issuer", e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`certificate-date-${index}`}>Date Issued</Label>
              <Input
                id={`certificate-date-${index}`}
                type="month"
                value={certificate.date}
                onChange={(e) => updateCertificate(index, "date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`certificate-url-${index}`}>Certificate URL (Optional)</Label>
              <Input
                id={`certificate-url-${index}`}
                type="url"
                value={certificate.url || ""}
                onChange={(e) => updateCertificate(index, "url", e.target.value)}
                placeholder="https://www.credential.net/..."
              />
            </div>
          </div>

        </div>
      ))}
    </div>
  )
}
