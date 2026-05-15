import { getToolMetadata } from '@/lib/tool-metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getToolMetadata(params, 'BMI Calculator Free Online — Body Mass Index Calculator', "Free online BMI calculator. Calculate your Body Mass Index instantly. Check if you're underweight, normal, overweight, or obese based on your height and weight.", 'bmi-calculator')
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
