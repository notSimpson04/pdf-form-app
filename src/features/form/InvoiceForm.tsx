import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
  itemQuantity: z.coerce.number().min(1, "Must be at least 1"),
  itemRate: z.coerce.number().min(0.01, "Must be greater than 0"),
})

type FormData = z.infer<typeof schema>

type Props = {
  onSubmit: (data: FormData) => void
  onBack: () => void
  generating?: boolean
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
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

export default function InvoiceForm({ onSubmit, onBack, generating }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  })

  const quantity = watch("itemQuantity") || 0
  const rate = watch("itemRate") || 0
  const total = (Number(quantity) * Number(rate)).toFixed(2)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center gap-4">
        <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">🧾 Invoice</h2>
      </div>

      {/* Sender */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Your Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name" error={errors.senderName?.message}>
            <Input {...register("senderName")} placeholder="Jane Smith" />
          </Field>
          <Field label="Email" error={errors.senderEmail?.message}>
            <Input {...register("senderEmail")} placeholder="jane@example.com" />
          </Field>
        </div>
        <Field label="Address" error={errors.senderAddress?.message}>
          <Input {...register("senderAddress")} placeholder="123 Main St, London" />
        </Field>
      </div>

      {/* Client */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Client Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name" error={errors.clientName?.message}>
            <Input {...register("clientName")} placeholder="Acme Corp" />
          </Field>
          <Field label="Email" error={errors.clientEmail?.message}>
            <Input {...register("clientEmail")} placeholder="billing@acme.com" />
          </Field>
        </div>
        <Field label="Address" error={errors.clientAddress?.message}>
          <Input {...register("clientAddress")} placeholder="456 Business Ave, Manchester" />
        </Field>
      </div>

      {/* Invoice details */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Invoice Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Invoice Number" error={errors.invoiceNumber?.message}>
            <Input {...register("invoiceNumber")} placeholder="INV-001" />
          </Field>
          <Field label="Issue Date" error={errors.issueDate?.message}>
            <Input {...register("issueDate")} type="date" />
          </Field>
          <Field label="Due Date" error={errors.dueDate?.message}>
            <Input {...register("dueDate")} type="date" />
          </Field>
        </div>
      </div>

      {/* Line item */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Line Item</h3>
        <Field label="Description" error={errors.itemDescription?.message}>
          <Input {...register("itemDescription")} placeholder="Web development services" />
        </Field>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Quantity" error={errors.itemQuantity?.message}>
            <Input {...register("itemQuantity")} type="number" placeholder="1" />
          </Field>
          <Field label="Rate (£)" error={errors.itemRate?.message}>
            <Input {...register("itemRate")} type="number" placeholder="500" />
          </Field>
          <div className="flex flex-col gap-1 justify-end">
            <span className="text-sm font-medium text-gray-700">Total</span>
            <span className="text-lg font-bold text-blue-600">£{total}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={generating}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? "Generating..." : "Generate Invoice →"}
      </button>
    </form>
  )
}