type DegreeType = "Bachelor" | "Master" | "PhD" | "Associate" | "Certificate" | "Diploma" | "Other"

interface CourseworkSuggestion {
  field: string
  courses: string[]
}

// Map common degree abbreviations to full names
const degreeMap: Record<string, DegreeType> = {
  BS: "Bachelor",
  BA: "Bachelor",
  BSc: "Bachelor",
  BBA: "Bachelor",
  BEng: "Bachelor",
  MS: "Master",
  MA: "Master",
  MSc: "Master",
  MBA: "Master",
  MEng: "Master",
  PhD: "PhD",
  "Ph.D.": "PhD",
  AA: "Associate",
  AS: "Associate",
  AAS: "Associate",
}

// Coursework suggestions by field
const courseworkSuggestions: Record<string, CourseworkSuggestion[]> = {
  Bachelor: [
    {
      field: "Computer Science",
      courses: [
        "Data Structures and Algorithms",
        "Object-Oriented Programming",
        "Database Systems",
        "Web Development",
        "Operating Systems",
        "Computer Networks",
        "Software Engineering",
        "Artificial Intelligence",
      ],
    },
    {
      field: "Business",
      courses: [
        "Principles of Management",
        "Financial Accounting",
        "Marketing Fundamentals",
        "Business Ethics",
        "Organizational Behavior",
        "Business Statistics",
        "Economics for Business",
        "Strategic Management",
      ],
    },
    {
      field: "Engineering",
      courses: [
        "Engineering Mathematics",
        "Mechanics of Materials",
        "Thermodynamics",
        "Circuit Analysis",
        "Engineering Design",
        "Fluid Mechanics",
        "Control Systems",
        "Engineering Ethics",
      ],
    },
  ],
  Master: [
    {
      field: "Computer Science",
      courses: [
        "Advanced Algorithms",
        "Machine Learning",
        "Distributed Systems",
        "Cloud Computing",
        "Advanced Database Systems",
        "Computer Vision",
        "Natural Language Processing",
        "High Performance Computing",
      ],
    },
    {
      field: "Business",
      courses: [
        "Advanced Financial Management",
        "Strategic Leadership",
        "Global Business Strategy",
        "Organizational Development",
        "Business Analytics",
        "Corporate Finance",
        "Marketing Management",
        "Operations Management",
      ],
    },
    {
      field: "Engineering",
      courses: [
        "Advanced Engineering Mathematics",
        "Computational Methods in Engineering",
        "Advanced Materials",
        "Systems Engineering",
        "Engineering Project Management",
        "Sustainable Engineering",
        "Robotics and Automation",
        "Advanced Control Systems",
      ],
    },
  ],
}

export function getCourseworkSuggestions(degree: string, field: string): string {
  // Normalize inputs
  const normalizedDegree = degree.trim()
  const normalizedField = field.trim().toLowerCase()

  // Determine degree type
  let degreeType: DegreeType = "Other"

  // Check if the degree is in our map
  for (const [abbr, type] of Object.entries(degreeMap)) {
    if (normalizedDegree.includes(abbr)) {
      degreeType = type
      break
    }
  }

  // If not found in abbreviations, check for full names
  if (degreeType === "Other") {
    if (normalizedDegree.includes("Bachelor")) degreeType = "Bachelor"
    else if (normalizedDegree.includes("Master")) degreeType = "Master"
    else if (normalizedDegree.includes("PhD") || normalizedDegree.includes("Doctor")) degreeType = "PhD"
    else if (normalizedDegree.includes("Associate")) degreeType = "Associate"
    else if (normalizedDegree.includes("Certificate")) degreeType = "Certificate"
    else if (normalizedDegree.includes("Diploma")) degreeType = "Diploma"
  }

  // Find matching field suggestions
  const degreeSuggestions = courseworkSuggestions[degreeType] || courseworkSuggestions["Bachelor"]

  if (!degreeSuggestions) {
    return "Relevant coursework in your field of study"
  }

  // Find the best matching field
  let bestMatch: CourseworkSuggestion | null = null

  for (const suggestion of degreeSuggestions) {
    if (
      normalizedField.includes(suggestion.field.toLowerCase()) ||
      suggestion.field.toLowerCase().includes(normalizedField)
    ) {
      bestMatch = suggestion
      break
    }
  }

  // If no specific match, use Computer Science for technical fields, Business for business fields, or Engineering for engineering fields
  if (!bestMatch) {
    if (
      normalizedField.includes("comput") ||
      normalizedField.includes("software") ||
      normalizedField.includes("information") ||
      normalizedField.includes("data")
    ) {
      bestMatch = degreeSuggestions.find((s) => s.field === "Computer Science") || null
    } else if (
      normalizedField.includes("business") ||
      normalizedField.includes("commerce") ||
      normalizedField.includes("management") ||
      normalizedField.includes("finance") ||
      normalizedField.includes("marketing")
    ) {
      bestMatch = degreeSuggestions.find((s) => s.field === "Business") || null
    } else if (
      normalizedField.includes("engineer") ||
      normalizedField.includes("mechanical") ||
      normalizedField.includes("electrical") ||
      normalizedField.includes("civil")
    ) {
      bestMatch = degreeSuggestions.find((s) => s.field === "Engineering") || null
    }
  }

  // If still no match, return a generic message
  if (!bestMatch) {
    return "Relevant coursework in your field of study"
  }

  // Select 4-5 random courses from the matched field
  const selectedCourses = [...bestMatch.courses].sort(() => 0.5 - Math.random()).slice(0, 5)

  return `Relevant coursework: ${selectedCourses.join(", ")}`
}
