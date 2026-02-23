import { useState } from  "react"
import TemplateSelector from "./features/templates/TemplateSelector"
import type { Template } from "./features/templates/TemplateSelector"
import type { InvoiceFormData } from "./types/forms"
import InvoiceForm from "./features/form/InvoiceForm"

function App() {
  const [ selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState<InvoiceFormData | null>(null)


  const handleFormSubmit = (data: InvoiceFormData) => {
    console.log("Form Data:", data)
    setFormData(data)
  }


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
        ) : !formData ? (
          <InvoiceForm
            onSubmit={handleFormSubmit}
            onBack={() => setSelectedTemplate(null)}
          />
        ): (
          <p className="text-gray-500">Ready to generate PDF for: {formData.senderName}</p>
        )
        }
      </main>
    </div>
  )
}

export default App