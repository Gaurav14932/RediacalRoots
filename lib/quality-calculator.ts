import type { Grade } from '@/lib/types'

export function computeGrade(
  moisture: number,
  foreignMatter: number,
  damagedGrain: number,
): Grade {
  // Standard Agmark / e-NAM agricultural quality thresholds
  const moistureGrade: Grade = moisture <= 12 ? 'A' : moisture <= 14 ? 'B' : 'C'
  const foreignGrade: Grade = foreignMatter <= 2 ? 'A' : foreignMatter <= 4 ? 'B' : 'C'
  const damagedGrade: Grade = damagedGrain <= 3 ? 'A' : damagedGrain <= 6 ? 'B' : 'C'

  // Final computed grade is determined by the lowest metric
  const grades = [moistureGrade, foreignGrade, damagedGrade]
  if (grades.includes('C')) return 'C'
  if (grades.includes('B')) return 'B'
  return 'A'
}
