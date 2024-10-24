import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SuggestionCard from '@/components/SuggestionCard'
import {
  getRandomSuggestionWithFilters,
  Suggestion,
  SuggestionFilters,
} from '@/utils/suggestions'

const GetFilteredSuggestion = () => {
  const { state } = useLocation() as {
    state: { suggestion: Suggestion; filters: SuggestionFilters }
  }
  const [currentSuggestion, setCurrentSuggestion] = useState<
    Suggestion | undefined
  >(state.suggestion)

  useEffect(() => {
    setCurrentSuggestion(state.suggestion)
  }, [state])

  if (currentSuggestion === undefined) {
    return (
      <h1>
        There were no results with the selected filters, try narrowing your
        search
      </h1>
    )
  }

  return (
    <div>
      <SuggestionCard suggestion={currentSuggestion} />
      <button
        onClick={() =>
          setCurrentSuggestion(getRandomSuggestionWithFilters(state.filters))
        }
      >
        Get another suggestion
      </button>
    </div>
  )
}
export default GetFilteredSuggestion
