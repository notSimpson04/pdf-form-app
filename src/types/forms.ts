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