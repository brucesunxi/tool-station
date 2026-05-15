import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BMI Calculator Free Online — Body Mass Index Calculator',
  description: 'Free online BMI calculator. Calculate your Body Mass Index instantly. Check if you\'re underweight, normal, overweight, or obese based on your height and weight.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
