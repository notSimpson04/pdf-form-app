import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type React from "react"

const schema = z.object({
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z.string().email("Invalid email address"),

    providerName: z.string().min(1, "Provider name is required"),
    providerEmail: z.string().email("Invalid email address"),

    projectTitle: z.string().min(1, "Project title is required"),
    projectDescription: z.string().min(1, "Project description is required"),

    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),

    totalAmount: z.coerce.number().min(0.01, "Total amount must be greater than zero"),
    paymentTerms: z.string().min(1, "Payment terms are required"),
    governingLaw: z.string().min(1, "Governing law is required"),

})

type FormData = z.infer<typeof schema>

type Props = {
    onSubmit: (data: FormData) => void
    onBack: () => void
    generating?: boolean
}

function Field({ label, error, children}: { label: string, error?: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {children}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
            {...props}
        />
    )
}
    
function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${className}`}
            rows={3}
            {...props}
        />
    )
}

export default function ContractForm({ onSubmit, onBack, generating}: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-4">
                <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800">
                    ← Back
                </button>
                <h2 className="text-2xl font-bold text-gray-800">✍️ Simple Contract</h2>
            </div>

            {/*PROVIDER*/}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-700">Your Details (Provider)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" error={errors.providerName?.message}>
                        <Input {...register("providerName")} placeholder="Jane Smith"/>
                    </Field>
                    <Field label="Email" error={errors.providerEmail?.message}>
                        <Input {...register("providerEmail")} placeholder="jane@provider.com"/>
                    </Field>
                </div>
            </div>

            {/*CLIENT*/}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-700">Client Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" error={errors.clientName?.message}>
                        <Input {...register("clientName")} placeholder="John Doe"/>
                    </Field>
                    <Field label="Email" error={errors.clientEmail?.message}>
                        <Input {...register("clientEmail")} placeholder="john@example.com"/>
                    </Field>
                </div>  
            </div>

            {/*PROJECT*/}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-700">Project Details</h3>
                <Field label="Project Title" error={errors.projectTitle?.message}>
                    <Input {...register("projectTitle")} placeholder="Website Redesign"/>
                </Field>
                 <Field label="Project Description" error={errors.projectDescription?.message}>
                    <TextArea {...register("projectDescription")} placeholder="Describe the project details..."/>
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Start Date" error={ errors.startDate?.message}>
                        <Input {...register("startDate")} type="date"/>
                    </Field>
                    <Field label="End Date" error={ errors.endDate?.message}>
                        <Input {...register("endDate")} type="date"/>
                    </Field>
                </div>
            </div>

            {/*PAYMENT*/}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-700">Payment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Total Amount ($)" error={errors.totalAmount?.message}>
                        <Input {...register("totalAmount")} type="number" placeholder="0.00"/>
                    </Field>
                    <Field label="Payment Terms" error={errors.paymentTerms?.message}>
                        <Input {...register("paymentTerms")} placeholder="50% upfront, 50% on completion" />
                    </Field>
                </div>
            </div>

            {/*LEGAL*/}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-700">Legal</h3>
                <Field label="Governing Law" error={errors.governingLaw?.message}>
                    <Input {...register("governingLaw")} placeholder="State of California"/>
                </Field>
            </div>

            <button
                type="submit"
                disabled={generating}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {generating ? "Generating..." : "Generate Contract →"}
            </button>
        </form>
    )
}
