import { useState } from "react"
import TemplateSelector from "./features/templates/TemplateSelector"
import type { Template } from "./features/templates/TemplateSelector"
import InvoiceForm from "./features/form/InvoiceForm"
import CVForm from "./features/form/CVForm"
import ContractForm from "./features/form/ContractForm"
import { generateInvoicePdf } from "./features/pdf/generateInvoicePdf"
import { generateCVPdf } from "./features/pdf/generateCVPdf"
import { generateContractPdf } from "./features/pdf/generateContractPdf"

type AppState = "select" | "form" | "success"

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [appState, setAppState] = useState<AppState>("select")
  const [generating, setGenerating] = useState(false)
  const [lastFileName, setLastFileName] = useState("")

  const handleInvoiceSubmit = async (data: any) => {
    setGenerating(true)
    try {
      const pdfBytes = await generateInvoicePdf(data)
      downloadPdf(pdfBytes, `invoice-${data.invoiceNumber}.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  const handleCVSubmit = async (data: any) => {
    setGenerating(true)
    try {
      const pdfBytes = await generateCVPdf(data)
      downloadPdf(pdfBytes, `cv-${data.fullName.replace(/\s+/g, "-").toLowerCase()}.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  const handleContractSubmit = async (data: any) => {
    setGenerating(true)
    try {
      const pdfBytes = await generateContractPdf(data)
      downloadPdf(pdfBytes, `contract-${data.projectTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  const downloadPdf = (pdfBytes: Uint8Array, fileName: string) => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
    setLastFileName(fileName)
    setAppState("success")
  }

  const handleStartOver = () => {
    setSelectedTemplate(null)
    setAppState("select")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={handleStartOver} className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
            📄 DocFiller
          </button>
          {appState !== "select" && (
            <button onClick={handleStartOver} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              ← Start over
            </button>
          )}
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-10">
        {appState === "select" && (
          <TemplateSelector onSelect={(template) => {
            setSelectedTemplate(template)
            setAppState("form")
          }} />
        )}
        {appState === "form" && selectedTemplate?.id === "invoice" && (
          <InvoiceForm onSubmit={handleInvoiceSubmit} onBack={() => setAppState("select")} generating={generating} />
        )}
        {appState === "form" && selectedTemplate?.id === "cv" && (
          <CVForm onSubmit={handleCVSubmit} onBack={() => setAppState("select")} generating={generating} />
        )}
        {appState === "form" && selectedTemplate?.id === "contract" && (
          <ContractForm onSubmit={handleContractSubmit} onBack={() => setAppState("select")} generating={generating} />
        )}
        {appState === "success" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-green-100 rounded-full p-6 mb-6">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">PDF Generated!</h2>
            <p className="text-gray-500 mb-2">Your file has been downloaded as</p>
            <p className="text-blue-600 font-medium mb-10">{lastFileName}</p>
            <div className="flex gap-4">
              <button
                onClick={() => setAppState("form")}
                className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Generate another
              </button>
              <button
                onClick={handleStartOver}
                className="bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-gray-400 transition-colors"
              >
                Choose new template
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App