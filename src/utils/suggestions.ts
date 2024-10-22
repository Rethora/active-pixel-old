import suggestions from '@/data/suggestions.json'

export type Force = null | 'static' | 'pull' | 'push'

export type Level = 'beginner' | 'intermediate' | 'expert'

export type Mechanic = null | 'isolation' | 'compound'

export type Equipment =
  | null
  | 'medicine ball'
  | 'dumbbell'
  | 'body only'
  | 'bands'
  | 'kettlebells'
  | 'foam roll'
  | 'cable'
  | 'machine'
  | 'barbell'
  | 'exercise ball'
  | 'e-z curl bar'
  | 'other'

export type PrimaryMuscles =
  | 'abdominals'
  | 'abductors'
  | 'adductors'
  | 'biceps'
  | 'calves'
  | 'chest'
  | 'forearms'
  | 'glutes'
  | 'hamstrings'
  | 'lats'
  | 'lower back'
  | 'middle back'
  | 'neck'
  | 'quadriceps'
  | 'shoulders'
  | 'traps'
  | 'triceps'

export type SecondaryMuscles =
  | 'abdominals'
  | 'abductors'
  | 'adductors'
  | 'biceps'
  | 'calves'
  | 'chest'
  | 'forearms'
  | 'glutes'
  | 'hamstrings'
  | 'lats'
  | 'lower back'
  | 'middle back'
  | 'neck'
  | 'quadriceps'
  | 'shoulders'
  | 'traps'
  | 'triceps'

export type Category =
  | 'powerlifting'
  | 'strength'
  | 'stretching'
  | 'cardio'
  | 'olympic weightlifting'
  | 'strongman'
  | 'plyometrics'

export interface Suggestion {
  id: string
  name: string
  force: Force
  level: Level
  mechanic: Mechanic
  equipment: Equipment
  primaryMuscles: PrimaryMuscles[]
  secondaryMuscles: SecondaryMuscles[]
  instructions: string[]
  category: Category
  images: string[]
}

export interface SuggestionFilters {
  force?: Force
  level?: Level
  mechanic?: Mechanic
  equipment?: Equipment
  primaryMuscles?: PrimaryMuscles[]
  secondaryMuscles?: SecondaryMuscles[]
  category?: Category
}

export const getRandomSuggestionWithOptionalFilters = (
  filters: SuggestionFilters = {},
) => {
  const {
    force = null,
    level = null,
    mechanic = null,
    equipment = null,
    primaryMuscles = [],
    secondaryMuscles = [],
    category = null,
  } = filters

  const filteredSuggestions = (suggestions as Suggestion[]).filter(
    (suggestion) => {
      return (
        (force === null || suggestion.force === force) &&
        (level === null || suggestion.level === level) &&
        (mechanic === null || suggestion.mechanic === mechanic) &&
        (equipment === null || suggestion.equipment === equipment) &&
        (primaryMuscles.length === 0 ||
          primaryMuscles.some((muscle) =>
            suggestion.primaryMuscles.includes(muscle),
          )) &&
        (secondaryMuscles.length === 0 ||
          secondaryMuscles.some((muscle) =>
            suggestion.secondaryMuscles.includes(muscle),
          )) &&
        (category === null || suggestion.category === category)
      )
    },
  )

  const randomIndex = Math.floor(Math.random() * filteredSuggestions.length)
  return filteredSuggestions[randomIndex]
}

export const getSuggestionById = (id: string) => {
  return suggestions.find((exercise) => exercise.id === id)
}
