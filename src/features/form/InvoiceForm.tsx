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

export default function InvoiceForm({ onSubmit, onBack}: Props) {
    const { register, handleSubmit, watch, formState: { errors} } = useForm<InvoiceFormData>({
        resolver: zodResolver(schema),
    })

    const quantity = watch("itemQuantity") || 0
    const price = watch("itemPrice") || 0
    const total = (Number(quantity)* Number(price)).toFixed(2)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center gap-4">
            <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800">← Back</button> 
            <h2 className="text-2xl font-bold text-gray-800">🧾 Invoice</h2> 
          </div>

            {/* Sender */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Your Details</h3>
            <div>
                <Field label="Name" error={errors.senderName?.message}>
                    <Input {...register("senderName")} placeholder="Jane Doe"></Input>
                </Field>
                <Field label="Email" error={errors.senderEmail?.message}>
                    <Input {...register("senderEmail")} placeholder="jane@example.com"></Input>
                </Field>
            </div>
            <Field label="Address" error={errors.senderAddress?.message}>
                <Input {...register("senderAddress")} placeholder="123 Main St, City, Country"></Input>
            </Field>
          </div>   
        </form>

        
    )
}