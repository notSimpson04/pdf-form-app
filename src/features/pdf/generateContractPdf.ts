import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

type ContractData = {
  clientName: string
  clientEmail: string
  providerName: string
  providerEmail: string
  projectTitle: string
  projectDescription: string
  startDate: string
  endDate: string
  totalAmount: number
  paymentTerms: string
  governingLaw: string
}

export async function generateContractPdf(data: ContractData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const { width, height } = page.getSize()

  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const dark = rgb(0.1, 0.1, 0.1)
  const gray = rgb(0.45, 0.45, 0.45)
  const blue = rgb(0.15, 0.39, 0.92)
  const lightGray = rgb(0.93, 0.93, 0.93)

  let y = height - 60

  const drawWrappedText = (text: string, x: number, maxWidth: number, size: number, font = regular, color = dark) => {
    const words = text.split(" ")
    let line = ""
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        page.drawText(line, { x, y, size, font, color })
        y -= size + 5
        line = word
      } else {
        line = test
      }
    }
    if (line) {
      page.drawText(line, { x, y, size, font, color })
      y -= size + 5
    }
  }

  const drawSection = (title: string) => {
    y -= 10
    page.drawText(title.toUpperCase(), { x: 40, y, size: 9, font: bold, color: blue })
    y -= 6
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: lightGray })
    y -= 14
  }

  // Title
  page.drawText("SERVICE AGREEMENT", { x: 40, y, size: 22, font: bold, color: dark })
  y -= 30
  page.drawText(`This agreement is entered into between:`, { x: 40, y, size: 10, font: regular, color: gray })
  y -= 20

  // Parties box
  page.drawRectangle({ x: 40, y: y - 50, width: width - 80, height: 65, color: lightGray })
  page.drawText(`Provider: ${data.providerName} (${data.providerEmail})`, { x: 52, y: y - 10, size: 10, font: regular, color: dark })
  page.drawText(`Client:     ${data.clientName} (${data.clientEmail})`, { x: 52, y: y - 28, size: 10, font: regular, color: dark })
  y -= 70

  // Project
  drawSection("Scope of Work")
  page.drawText(data.projectTitle, { x: 40, y, size: 11, font: bold, color: dark })
  y -= 16
  drawWrappedText(data.projectDescription, 40, width - 80, 10)

  // Timeline
  drawSection("Timeline")
  page.drawText(`Start Date:`, { x: 40, y, size: 10, font: bold, color: dark })
  page.drawText(data.startDate, { x: 110, y, size: 10, font: regular, color: dark })
  y -= 16
  page.drawText(`End Date:`, { x: 40, y, size: 10, font: bold, color: dark })
  page.drawText(data.endDate, { x: 110, y, size: 10, font: regular, color: dark })
  y -= 16

  // Payment
  drawSection("Payment")
  page.drawText(`Total Amount:`, { x: 40, y, size: 10, font: bold, color: dark })
  page.drawText(`£${data.totalAmount.toFixed(2)}`, { x: 130, y, size: 10, font: regular, color: dark })
  y -= 16
  page.drawText(`Payment Terms:`, { x: 40, y, size: 10, font: bold, color: dark })
  page.drawText(data.paymentTerms, { x: 130, y, size: 10, font: regular, color: dark })
  y -= 16

  // Legal
  drawSection("Legal")
  drawWrappedText(
    `This agreement shall be governed by the laws of ${data.governingLaw}. Both parties agree to the terms outlined in this document.`,
    40, width - 80, 10
  )

  // Signatures
  drawSection("Signatures")
  y -= 10
  page.drawLine({ start: { x: 40, y }, end: { x: 220, y }, thickness: 0.5, color: dark })
  page.drawLine({ start: { x: 320, y }, end: { x: 500, y }, thickness: 0.5, color: dark })
  y -= 14
  page.drawText(data.providerName, { x: 40, y, size: 9, font: regular, color: gray })
  page.drawText(data.clientName, { x: 320, y, size: 9, font: regular, color: gray })
  y -= 12
  page.drawText("Provider", { x: 40, y, size: 8, font: bold, color: gray })
  page.drawText("Client", { x: 320, y, size: 8, font: bold, color: gray })

  return pdfDoc.save()
}