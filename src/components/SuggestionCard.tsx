import { Suggestion } from '@/utils/suggestions'

interface Props {
  suggestion: Suggestion
}

const SuggestionCard = ({ suggestion }: Props) => {
  return (
    <div>
      <div>
        <h1>{suggestion.name}</h1>
        <h2>Instructions</h2>
        <ul>
          {suggestion.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
        <h2>Primary Muscles</h2>
        <ul>
          {suggestion.primaryMuscles.map((muscle, index) => (
            <li key={index}>{muscle}</li>
          ))}
        </ul>
        <h2>Secondary Muscles</h2>
        <ul>
          {suggestion.secondaryMuscles.map((muscle, index) => (
            <li key={index}>{muscle}</li>
          ))}
        </ul>
        <h2>Images</h2>
        <ul>
          {suggestion.images.map((image, index) => (
            <li key={index}>
              <img
                src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${image}`}
                alt={suggestion.name}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SuggestionCard
