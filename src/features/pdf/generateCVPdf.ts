import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

type CVData = {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  website?: string
  summary: string
  expJobTitle: string
  expCompany: string
  expDates: string
  expDescription: string
  eduDegree: string
  eduSchool: string
  eduDates: string
  skills: string
}

export async function generateCVPdf(data: CVData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const { width, height } = page.getSize()

  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const blue = rgb(0.15, 0.39, 0.92)
  const dark = rgb(0.1, 0.1, 0.1)
  const gray = rgb(0.45, 0.45, 0.45)
  const lightGray = rgb(0.93, 0.93, 0.93)

  // Header
  page.drawRectangle({ x: 0, y: height - 110, width, height: 110, color: blue })

  page.drawText(data.fullName, {
    x: 40, y: height - 50, size: 26, font: bold, color: rgb(1, 1, 1),
  })
  page.drawText(data.jobTitle, {
    x: 40, y: height - 72, size: 13, font: regular, color: rgb(0.85, 0.85, 0.85),
  })

  // Contact info row
  const contactY = height - 95
  const contactItems = [
    data.email,
    data.phone,
    data.location,
    data.website || "",
  ].filter(Boolean)

  let contactX = 40
  contactItems.forEach((item, i) => {
    page.drawText(item, { x: contactX, y: contactY, size: 9, font: regular, color: rgb(0.9, 0.9, 0.9) })
    contactX += regular.widthOfTextAtSize(item, 9) + 16
    if (i < contactItems.length - 1) {
      page.drawText("·", { x: contactX - 10, y: contactY, size: 9, font: regular, color: rgb(0.7, 0.7, 0.7) })
    }
  })

  let y = height - 140

  const drawSection = (title: string) => {
    y -= 10
    page.drawText(title.toUpperCase(), { x: 40, y, size: 9, font: bold, color: blue })
    y -= 6
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: lightGray })
    y -= 14
  }

  const drawText = (text: string, x: number, size: number, font = regular, color = dark) => {
    page.drawText(text, { x, y, size, font, color })
    y -= size + 4
  }

  const drawWrappedText = (text: string, x: number, maxWidth: number, size: number) => {
    const words = text.split(" ")
    let line = ""
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (regular.widthOfTextAtSize(test, size) > maxWidth && line) {
        page.drawText(line, { x, y, size, font: regular, color: dark })
        y -= size + 4
        line = word
      } else {
        line = test
      }
    }
    if (line) {
      page.drawText(line, { x, y, size, font: regular, color: dark })
      y -= size + 4
    }
  }

  // Summary
  drawSection("Professional Summary")
  drawWrappedText(data.summary, 40, width - 80, 10)

  // Experience
  y -= 6
  drawSection("Experience")
  drawText(data.expJobTitle, 40, 11, bold)
  y += 4
  page.drawText(`${data.expCompany}  ·  ${data.expDates}`, { x: 40, y, size: 9, font: regular, color: gray })
  y -= 14
  drawWrappedText(data.expDescription, 40, width - 80, 10)

  // Education
  y -= 6
  drawSection("Education")
  drawText(data.eduDegree, 40, 11, bold)
  y += 4
  page.drawText(`${data.eduSchool}  ·  ${data.eduDates}`, { x: 40, y, size: 9, font: regular, color: gray })
  y -= 14

  // Skills
  y -= 6
  drawSection("Skills")
  const skillList = data.skills.split(",").map(s => s.trim()).filter(Boolean)
  let skillX = 40
  for (const skill of skillList) {
    const skillWidth = regular.widthOfTextAtSize(skill, 9) + 16
    if (skillX + skillWidth > width - 40) {
      skillX = 40
      y -= 22
    }
    page.drawRectangle({ x: skillX, y: y - 4, width: skillWidth, height: 18, color: lightGray })
    page.drawText(skill, { x: skillX + 8, y: y + 2, size: 9, font: regular, color: dark })
    skillX += skillWidth + 8
  }

  return pdfDoc.save()
}