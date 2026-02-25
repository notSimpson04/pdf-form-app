import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { InvoiceFormData } from "../../types/forms";

export async function generateInvoicePdf(data: InvoiceFormData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) //A4 size in points
    const { width, height } = page.getSize()

    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const blue = rgb(0.15, 0.39, 0.92)
    const dark = rgb(0.1, 0.1, 0.1)
    const gray = rgb(0.45, 0.45, 0.45)
    const lightGray = rgb(0.93, 0.93, 0.93)

    // Header
    page.drawRectangle({
        x: 0,
        y: height - 100,
        width,
        height: 100,
        color: blue,
    })

    //Title
    page.drawText("INVOICE", {
        x: 40,
        y: height - 78,
        size: 11,
        font: regular,
        color: rgb(0.85, 0.85, 0.85),
    })

    //Dates (top right)
    page.drawText(`Issue Date: ${data.issueDate}`, {
        x: width - 200,
        y: height - 45,
        size: 10,
        font: regular,
        color: rgb(1, 1, 1),
    })
    page.drawText(`Due Date: ${data.dueDate}`, {
        x: width - 200,
        y: height - 62,
        size: 10,
        font: regular,
        color: rgb(1, 1, 1),
    })

    //From Section
    page.drawText("FROM", {x: 40, y: height - 130, size: 9, font: bold, color: blue})
    page.drawText(data.senderName, {x: 40, y: height - 148, size: 11, font: bold, color: dark})
    page.drawText(data.senderEmail, {x: 40, y: height - 163, size: 10, font: regular, color: gray})
    page.drawText(data.senderAddress, {x: 40, y: height - 178, size: 10, font: regular, color: gray})

    //To SEction
    page.drawText("BILL TO", {x: 300, y: height - 130, size: 9, font: bold, color: blue})
    page.drawText(data.clientName, {x: 300, y: height - 148, size: 11, font: bold, color: dark})
    page.drawText(data.clientEmail, {x: 300, y: height - 163, size: 10, font: regular, color: gray})
    page.drawText(data.clientAddress, {x: 300, y: height - 178, size: 10, font: regular, color: gray})

    //Table Header
    const tabletop = height - 230
    page.drawRectangle({x: 40, y: tabletop, width: width - 80, height: 28, color: lightGray})
    page.drawText("DESCRIPTION", {x: 45, y: tabletop + 9, size: 9, font: bold, color: dark})
    page.drawText("QUANTITY", {x: 340, y: tabletop + 9, size: 9, font: bold, color: dark})
    page.drawText("PRICE", {x: 400, y: tabletop + 9, size: 9, font: bold, color: dark})
    page.drawText("TOTAL", {x: 470, y: tabletop + 9, size: 9, font: bold, color: dark})

    //Table Row
    const rowY = tabletop - 28
    const total = (data.itemQuantity * data.itemRate).toFixed(2)
    page.drawText(data.itemDescription, {x: 52, y: rowY + 9, size: 10, font: regular, color: dark})
    page.drawText(String(data.itemQuantity), {x: 340, y: rowY + 9, size: 10, font: regular, color: dark})
    page.drawText(`$${data.itemRate.toFixed(2)}`, {x: 400, y: rowY + 9, size: 10, font: regular, color: dark})
    page.drawText(`$${total}`, {x: 470, y: rowY + 9, size: 10, font: regular, color: dark})

    //Divider
    page.drawLine({
        start: { x: 40, y: rowY - 5},
        end: {x: width - 40, y: rowY - 5},
        thickness: 0.5,
        color: lightGray,
    })

    //Total Box
    const totalY = rowY - 50
    page.drawRectangle({x: 380, y: totalY, width: 175, height: 36, color: blue})
    page.drawText("GRAND TOTAL", {x: 392, y: totalY + 22, size: 9, font: bold, color: rgb(1, 1, 1)})
    page.drawText(`$${total}`, {x: 392, y: totalY + 8, size: 13, font: bold, color: rgb(1, 1, 1)})

    // Footer
    page.drawText("Thank you for your business!", {x: 40, y: 40, size: 10, font: regular, color: gray})

    return pdfDoc.save()

}