import { useEffect, useState, ChangeEvent, useCallback } from 'react'
import { generateFormInputs } from '@/utils/form'
import {
  getSuggestionsWithFilters,
  SuggestionFilterKey,
  SuggestionFilters,
} from '@/utils/suggestions'

interface Props {
  onFiltersChange?: (filters: SuggestionFilters) => void
  defaultValues?: SuggestionFilters
}

const formInputs = generateFormInputs()

const SelectSuggestionFilters = ({ onFiltersChange, defaultValues }: Props) => {
  const [filters, setFilters] = useState<SuggestionFilters>(
    defaultValues ?? ({} as SuggestionFilters),
  )
  const [numberOfResults, setNumberOfResults] = useState(
    getSuggestionsWithFilters(filters).length,
  )

  useEffect(() => {
    const filteredSuggestions = getSuggestionsWithFilters(filters)
    const numberOfFilteredResults = filteredSuggestions.length
    setNumberOfResults(numberOfFilteredResults)
    onFiltersChange && onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target
    setFilters((prevFilters) => {
      const filterKey = name as SuggestionFilterKey
      const currentValues = (prevFilters[filterKey] ?? []) as string[]
      if (checked) {
        return {
          ...prevFilters,
          [filterKey]: [...currentValues, value],
        }
      } else {
        return {
          ...prevFilters,
          [filterKey]: currentValues.filter((v) => v !== value),
        }
      }
    })
  }

  const getNumberOfResultsText = useCallback(() => {
    if (numberOfResults === 0) {
      return 'There are no results matching your filters. Try different filters!'
    } else if (numberOfResults === 1) {
      return 'There is only 1 result matching your filters!'
    } else if (numberOfResults < 5) {
      return `There are only ${numberOfResults} results matching your filters!`
    } else {
      return `There are ${numberOfResults} results matching your filters.`
    }
  }, [numberOfResults])

  return (
    <div>
      <h2>Filters</h2>
      {formInputs.map((input) => (
        <div key={input.name}>
          <h3>{input.label}</h3>
          <div>
            {input.options.map((option) => (
              <div key={option}>
                <input
                  type="checkbox"
                  name={input.name}
                  value={option}
                  onChange={handleChange}
                  defaultChecked={
                    (
                      defaultValues?.[
                        input.name as SuggestionFilterKey
                      ] as string[]
                    )?.includes(option) || false
                  }
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p>{getNumberOfResultsText()}</p>
    </div>
  )
}

export default SelectSuggestionFilters
