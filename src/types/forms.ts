export type InvoiceFormData = {
    senderName: string
    senderEmail: string
    senderAddress: string

    clientName: string
    clientEmail: string
    clientAddress: string

    invoiceNumber: string
    issueDate: string
    dueDate: string

    itemDescription: string
    itemQuantity: number
    itemRate: number
}

export type CVFormData = {
    //Personal Info
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    website: string

    //Summary
    summary: string

    //Experience
    expJobTitle: string
    expCompany: string
    expDates: string
    expDescription: string

    //Education
    eduDegree: string
    eduSchool: string
    eduDates: string

    //Skills
    skills: string
}