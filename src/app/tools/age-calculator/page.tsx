'use client'

import { useState, useMemo } from 'react'
import AdBanner from '@/components/AdBanner'

function getAge(dob: Date, now: Date) {
  let years = now.getFullYear() - dob.getFullYear()
  let months = now.getMonth() - dob.getMonth()
  let days = now.getDate() - dob.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days, totalDays: Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24)) }
}

function getNextBirthday(dob: Date, now: Date) {
  const next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate())
  if (next <= now) {
    next.setFullYear(next.getFullYear() + 1)
  }
  const diff = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return { date: next, daysUntil: diff }
}

export default function AgeCalculatorPage() {
  const [dobInput, setDobInput] = useState('1990-06-15')
  const now = useMemo(() => new Date(), [])

  const dob = new Date(dobInput)
  const age = !isNaN(dob.getTime()) ? getAge(dob, now) : null
  const nextBirthday = !isNaN(dob.getTime()) ? getNextBirthday(dob, now) : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Age Calculator Free Online — Calculate Exact Age</h1>
      <p className="text-gray-500 mb-6">Free online age calculator. Calculate your exact age in years, months, and days. Find out how many days until your next birthday.</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input type="date" value={dobInput} onChange={e => setDobInput(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>

        {age && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-600">{age.years}</div>
                <div className="text-sm text-gray-500">Years</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-600">{age.months}</div>
                <div className="text-sm text-gray-500">Months</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-600">{age.days}</div>
                <div className="text-sm text-gray-500">Days</div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-center">
              <div className="text-sm text-gray-500">Total Days Old</div>
              <div className="text-2xl font-bold text-amber-600">{age.totalDays.toLocaleString()}</div>
            </div>

            {nextBirthday && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-center">
                <div className="text-sm text-gray-500">Next Birthday</div>
                <div className="text-lg font-semibold text-rose-600">
                  {nextBirthday.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-2xl font-bold text-rose-600 mt-1">
                  {nextBirthday.daysUntil} {nextBirthday.daysUntil === 1 ? 'day' : 'days'} to go!
                </div>
              </div>
            )}
          </div>
        )}

        {isNaN(dob.getTime()) && (
          <p className="text-red-500 text-sm">Please enter a valid date of birth.</p>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use</h2>
        <ol>
          <li>Enter your date of birth by clicking the date picker or typing in YYYY-MM-DD format.</li>
          <li>Your exact age is calculated automatically in years, months, and days.</li>
          <li>View your total number of days old for a precise measurement.</li>
          <li>Check the countdown to your next birthday.</li>
        </ol>

        <h2>Tips</h2>
        <ul>
          <li>Use this calculator to verify age for applications, forms, or registrations.</li>
          <li>The total days counter is useful for tracking milestones like 10,000 days old.</li>
          <li>Bookmark the page with your birth date pre-filled for quick future reference.</li>
        </ul>

        <h2>FAQ</h2>
        <div>
          <h3>How is my exact age calculated?</h3>
          <p>Your age is calculated by comparing your date of birth to the current date. It accounts for differences in years, months, and days, including leap years.</p>
          <h3>Does the calculator account for leap years?</h3>
          <p>Yes, the JavaScript Date object handles leap years automatically, so February 29 birthdays are correctly accounted for.</p>
          <h3>What if I was born on February 29?</h3>
          <p>The calculator will show your next birthday on February 28 or March 1 in non-leap years, depending on how the date is interpreted.</p>
        </div>
      </section>
    </div>
  )
}
