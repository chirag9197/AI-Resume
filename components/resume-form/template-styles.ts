export const templateStyles = {
  modern: {
    container: "max-w-4xl mx-auto p-8 bg-white shadow-lg",
    header: "flex justify-between items-start mb-8",
    name: "text-3xl font-bold text-gray-900",
    title: "text-xl text-blue-600 font-medium",
    section: "mb-6",
    sectionTitle: "text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4",
    list: "space-y-4",
    item: "flex flex-col",
    itemTitle: "font-medium text-gray-900",
    itemSubtitle: "text-gray-600",
    itemDate: "text-sm text-gray-500",
    itemDescription: "mt-2 text-gray-700",
    preview: {
      background: "bg-gradient-to-br from-blue-50 to-indigo-50",
      accent: "border-blue-500",
      text: "text-blue-900"
    }
  },
  minimal: {
    container: "max-w-4xl mx-auto p-8 bg-white",
    header: "text-center mb-8",
    name: "text-2xl font-light text-gray-900",
    title: "text-lg text-gray-600 font-light",
    section: "mb-6",
    sectionTitle: "text-lg font-light text-gray-800 border-b border-gray-200 pb-2 mb-4",
    list: "space-y-4",
    item: "flex flex-col",
    itemTitle: "font-light text-gray-900",
    itemSubtitle: "text-gray-600 font-light",
    itemDate: "text-sm text-gray-400",
    itemDescription: "mt-2 text-gray-600 font-light",
    preview: {
      background: "bg-gradient-to-br from-gray-50 to-slate-50",
      accent: "border-gray-400",
      text: "text-gray-700"
    }
  }
} as const 