import suggestions from '@/data/suggestions.json'

export enum Force {
  Static = 'static',
  Pull = 'pull',
  Push = 'push',
  None = 'none', // Replace null with 'none'
}

export enum Level {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Expert = 'expert',
}

export enum Mechanic {
  Isolation = 'isolation',
  Compound = 'compound',
  None = 'none', // Replace null with 'none'
}

export enum Equipment {
  MedicineBall = 'medicine ball',
  Dumbbell = 'dumbbell',
  BodyOnly = 'body only',
  Bands = 'bands',
  Kettlebells = 'kettlebells',
  FoamRoll = 'foam roll',
  Cable = 'cable',
  Machine = 'machine',
  Barbell = 'barbell',
  ExerciseBall = 'exercise ball',
  EZCurlBar = 'e-z curl bar',
  Other = 'other',
  None = 'none', // Replace null with 'none'
}

export enum PrimaryMuscles {
  Abdominals = 'abdominals',
  Abductors = 'abductors',
  Biceps = 'biceps',
  Calves = 'calves',
  Chest = 'chest',
  Forearms = 'forearms',
  Glutes = 'glutes',
  Hamstrings = 'hamstrings',
  Lats = 'lats',
  LowerBack = 'lower back',
  MiddleBack = 'middle back',
  Neck = 'neck',
  Quadriceps = 'quadriceps',
  Shoulders = 'shoulders',
  Traps = 'traps',
  Triceps = 'triceps',
}

export enum SecondaryMuscles {
  Abdominals = 'abdominals',
  Abductors = 'abductors',
  Biceps = 'biceps',
  Calves = 'calves',
  Chest = 'chest',
  Forearms = 'forearms',
  Glutes = 'glutes',
  Hamstrings = 'hamstrings',
  Lats = 'lats',
  LowerBack = 'lower back',
  MiddleBack = 'middle back',
  Neck = 'neck',
  Quadriceps = 'quadriceps',
  Shoulders = 'shoulders',
  Traps = 'traps',
  Triceps = 'triceps',
}

export enum Category {
  Powerlifting = 'powerlifting',
  Strength = 'strength',
  Stretching = 'stretching',
  Cardio = 'cardio',
  OlympicWeightlifting = 'olympic weightlifting',
  Strongman = 'strongman',
  Plyometrics = 'plyometrics',
}

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
  force?: Force[]
  level?: Level[]
  mechanic?: Mechanic[]
  equipment?: Equipment[]
  primaryMuscles?: PrimaryMuscles[]
  secondaryMuscles?: SecondaryMuscles[]
  category?: Category[]
}

export type SuggestionFilterKey = keyof SuggestionFilters

export const getFullFilterConfig = (filters: SuggestionFilters = {}) => {
  return {
    force:
      filters.force && filters.force.length > 0
        ? filters.force
        : Object.values(Force),
    level:
      filters.level && filters.level.length > 0
        ? filters.level
        : Object.values(Level),
    mechanic:
      filters.mechanic && filters.mechanic.length > 0
        ? filters.mechanic
        : Object.values(Mechanic),
    equipment:
      filters.equipment && filters.equipment.length > 0
        ? filters.equipment
        : Object.values(Equipment),
    primaryMuscles:
      filters.primaryMuscles && filters.primaryMuscles.length > 0
        ? filters.primaryMuscles
        : Object.values(PrimaryMuscles),
    secondaryMuscles:
      filters.secondaryMuscles && filters.secondaryMuscles.length > 0
        ? filters.secondaryMuscles
        : Object.values(SecondaryMuscles),
    category:
      filters.category && filters.category.length > 0
        ? filters.category
        : Object.values(Category),
  }
}

const processedSuggestions = suggestions.map((suggestion) => ({
  ...suggestion,
  force: suggestion.force ?? 'none',
  mechanic: suggestion.mechanic ?? 'none',
  equipment: suggestion.equipment ?? 'none',
})) as Suggestion[]

export const getSuggestionsWithFilters = (
  filters: SuggestionFilters = {},
): Suggestion[] => {
  return processedSuggestions.filter((suggestion) => {
    return (
      (!filters.force ||
        filters.force.length === 0 ||
        filters.force.includes(suggestion.force)) &&
      (!filters.level ||
        filters.level.length === 0 ||
        filters.level.includes(suggestion.level)) &&
      (!filters.mechanic ||
        filters.mechanic.length === 0 ||
        filters.mechanic.includes(suggestion.mechanic)) &&
      (!filters.equipment ||
        filters.equipment.length === 0 ||
        filters.equipment.includes(suggestion.equipment)) &&
      (!filters.primaryMuscles ||
        filters.primaryMuscles.length === 0 ||
        filters.primaryMuscles.some((muscle) =>
          suggestion.primaryMuscles.includes(muscle),
        )) &&
      (!filters.secondaryMuscles ||
        filters.secondaryMuscles.length === 0 ||
        filters.secondaryMuscles.some((muscle) =>
          suggestion.secondaryMuscles.includes(muscle),
        )) &&
      (!filters.category ||
        filters.category.length === 0 ||
        filters.category.includes(suggestion.category))
    )
  })
}

export const getRandomSuggestion = (
  suggestions: Suggestion[],
): Suggestion | undefined => {
  if (suggestions.length === 0) {
    return undefined
  }

  const randomIndex = Math.floor(Math.random() * suggestions.length)
  return suggestions[randomIndex]
}

export const getRandomSuggestionWithFilters = (
  filters: SuggestionFilters = {},
): Suggestion | undefined => {
  const filteredSuggestions = getSuggestionsWithFilters(filters)
  return getRandomSuggestion(filteredSuggestions)
}

export const getSuggestionById = (id: string) => {
  return suggestions.find((exercise) => exercise.id === id)
}
