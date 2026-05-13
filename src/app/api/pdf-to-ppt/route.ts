import { NextRequest, NextResponse } from 'next/server'
import PptxGenJS from 'pptxgenjs'

export async function POST(request: NextRequest) {
  try {
    const { slides } = await request.json()

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ error: 'No slide data provided' }, { status: 400 })
    }

    const pptx = new PptxGenJS()
    pptx.author = 'ToolStation'
    pptx.title = 'Converted from PDF'
    pptx.layout = 'LAYOUT_WIDE' // 13.33 x 7.5 inches (16:9)

    const slideW = 13.33 // inches (16:9 widescreen)
    const slideH = 7.5

    for (let i = 0; i < slides.length; i++) {
      const page = slides[i]
      const pptSlide = pptx.addSlide()

      // Add text items
      if (page.textItems && Array.isArray(page.textItems)) {
        for (const item of page.textItems) {
          try {
            pptSlide.addText(item.text, {
              x: item.x,
              y: item.y,
              w: item.w || 2,
              h: item.h || 0.5,
              fontSize: item.fontSize || 12,
              fontFace: item.fontFace || 'Calibri',
              bold: item.bold || false,
              italic: item.italic || false,
              color: item.color || '333333',
              valign: 'top',
              wrap: true,
              rtlMode: false,
            })
          } catch (e) {
            // Skip problematic text items
          }
        }
      }

      // Add images
      if (page.images && Array.isArray(page.images)) {
        for (const img of page.images) {
          try {
            pptSlide.addImage({
              data: img.data,
              x: img.x,
              y: img.y,
              w: img.w,
              h: img.h,
            })
          } catch (e) {
            // Skip problematic images
          }
        }
      }
    }

    const buffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer
    const base64 = buffer.toString('base64')

    return NextResponse.json({
      pptxDataUrl: `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64}`,
      size: buffer.length,
      slides: slides.length,
    })
  } catch (error: any) {
    console.error('PPTX creation error:', error?.message || error)
    return NextResponse.json({ error: `Failed: ${error?.message || 'Unknown error'}` }, { status: 500 })
  }
}
