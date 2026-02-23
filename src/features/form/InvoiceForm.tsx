import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { InvoiceFormData } from "../../types/forms"
import type React from "react"

const schema = z.object({
    senderName: z.string().min(1, "Required"),
    senderEmail: z.string().email("Invalid email"),
    senderAddress: z.string().min(1, "Required"),

    clientName: z.string().min(1, "Required"),
    clientEmail: z.string().email("Invalid email"),
    clientAddress: z.string().min(1, "Required"),

    invoiceNumber: z.string().min(1, "Required"),
    issueDate: z.string().min(1, "Required"),
    dueDate: z.string().min(1, "Required"),

    itemDescription: z.string().min(1, "Required"),
    itemQuantity: z.coerce.number().min(1, "Must be at least one"),
    itemPrice: z.coerce.number().min(0.01, "Must be greater than 0"),

})

type Props = {
    onSubmit: (data: InvoiceFormData) => void
    onBack: () => void
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode}) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {children}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )
}

function Input({ className, ...props}: React.InputHTMLAttributes<HTMLInputElement> ) {
    return (
        <input 
            className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
            {...props}
        />
    )
}

