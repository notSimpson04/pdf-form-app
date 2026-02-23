export type Template = {
    id: string
    name: string
    description: string
    icon: string
}

const templates: Template[] = [
    {
        id: "invoice",
        name: "Invoice",
        description: "Bill a client for your services",
        icon: "💼",
    },
    {
        id: "cv",
        name: "CV/Resume",
        description: "Fill out a clean professional resume",
        icon: "📄",
    },
    {
        id: "contract",
        name: "Contract",
        description: "A basic agreement between two Parties",
        icon: "✍️",
    },
]

type Props = {
    onSelect: (template: Template) => void
}

export default function TemplateSelector({ onSelect}: Props) {
    return(
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose a Template</h2>
            <p className="text-gray-500 mb-8">Select a document type to get started</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {templates.map((template)=> (
                    <button
                        key={template.id}
                        onClick={()=> onSelect(template)}
                        className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-blue-400 hover:shadow-md transition-all"
                    >
                        <span className="text-3xl">{template.icon}</span>
                        <h3 className="mt-3 font-semibold text-gray-800">{template.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}