import { useState } from  "react"
import TemplateSelector from "./features/templates/TemplateSelector"
import type { Template } from "./features/templates/TemplateSelector"

function App() {
  const [ selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">📄 DocFiller</h1>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-10">
        {!selectedTemplate ? (
          <TemplateSelector onSelect={setSelectedTemplate} />
        ) : (
          <p className="text-gray-500">Selected: {selectedTemplate.name}</p>
        )
        }
      </main>
    </div>
  )
}

export default App