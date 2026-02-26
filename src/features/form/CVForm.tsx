import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type React from "react"

const schema = z.object({
  fullName: z.string().min(1, "Required"),
  jobTitle: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  website: z.string().optional(),
  summary: z.string().min(1, "Required"),
  expJobTitle: z.string().min(1, "Required"),
  expCompany: z.string().min(1, "Required"),
  expDates: z.string().min(1, "Required"),
  expDescription: z.string().min(1, "Required"),
  eduDegree: z.string().min(1, "Required"),
  eduSchool: z.string().min(1, "Required"),
  eduDates: z.string().min(1, "Required"),
  skills: z.string().min(1, "Required"),
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

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${className}`}
      rows={3}
      {...props}
    />
  )
}

export default function CVForm({ onSubmit, onBack, generating }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center gap-4">
        <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">📋 CV / Resume</h2>
      </div>

      {/* Personal */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" error={errors.fullName?.message}>
            <Input {...register("fullName")} placeholder="Jane Smith" />
          </Field>
          <Field label="Job Title" error={errors.jobTitle?.message}>
            <Input {...register("jobTitle")} placeholder="Software Engineer" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input {...register("email")} placeholder="jane@example.com" />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input {...register("phone")} placeholder="+44 7700 900000" />
          </Field>
          <Field label="Location" error={errors.location?.message}>
            <Input {...register("location")} placeholder="London, UK" />
          </Field>
          <Field label="Website / LinkedIn" error={errors.website?.message}>
            <Input {...register("website")} placeholder="linkedin.com/in/janesmith" />
          </Field>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Professional Summary</h3>
        <Field label="Summary" error={errors.summary?.message}>
          <Textarea {...register("summary")} placeholder="A brief overview of your experience and goals..." />
        </Field>
      </div>

      {/* Experience */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Experience</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Job Title" error={errors.expJobTitle?.message}>
            <Input {...register("expJobTitle")} placeholder="Frontend Developer" />
          </Field>
          <Field label="Company" error={errors.expCompany?.message}>
            <Input {...register("expCompany")} placeholder="Acme Corp" />
          </Field>
        </div>
        <Field label="Dates" error={errors.expDates?.message}>
          <Input {...register("expDates")} placeholder="Jan 2022 – Present" />
        </Field>
        <Field label="Description" error={errors.expDescription?.message}>
          <Textarea {...register("expDescription")} placeholder="Describe your responsibilities and achievements..." />
        </Field>
      </div>

      {/* Education */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Education</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Degree" error={errors.eduDegree?.message}>
            <Input {...register("eduDegree")} placeholder="BSc Computer Science" />
          </Field>
          <Field label="School" error={errors.eduSchool?.message}>
            <Input {...register("eduSchool")} placeholder="University of Manchester" />
          </Field>
        </div>
        <Field label="Dates" error={errors.eduDates?.message}>
          <Input {...register("eduDates")} placeholder="2018 – 2021" />
        </Field>
      </div>

      {/* Skills */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">Skills</h3>
        <Field label="Skills (comma separated)" error={errors.skills?.message}>
          <Input {...register("skills")} placeholder="React, TypeScript, Node.js, SQL" />
        </Field>
      </div>

      <button
        type="submit"
        disabled={generating}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? "Generating..." : "Generate CV/Resume →"}
      </button>
    </form>
  )
}