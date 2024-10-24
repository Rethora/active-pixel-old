import {
  Force,
  Level,
  Mechanic,
  Equipment,
  PrimaryMuscles,
  SecondaryMuscles,
  Category,
} from '@/utils/suggestions'

export type FormMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export const generateSelectOptions = (enumObj: { [key: string]: unknown }) => {
  return Object.values(enumObj).filter((value) => typeof value === 'string')
}

export const generateFormInputs = () => {
  return [
    {
      label: 'Force',
      name: 'force',
      options: generateSelectOptions(Force),
    },
    {
      label: 'Level',
      name: 'level',
      options: generateSelectOptions(Level),
    },
    {
      label: 'Mechanic',
      name: 'mechanic',
      options: generateSelectOptions(Mechanic),
    },
    {
      label: 'Equipment',
      name: 'equipment',
      options: generateSelectOptions(Equipment),
    },
    {
      label: 'Primary Muscles',
      name: 'primaryMuscles',
      options: generateSelectOptions(PrimaryMuscles),
    },
    {
      label: 'Secondary Muscles',
      name: 'secondaryMuscles',
      options: generateSelectOptions(SecondaryMuscles),
    },
    {
      label: 'Category',
      name: 'category',
      options: generateSelectOptions(Category),
    },
  ]
}
