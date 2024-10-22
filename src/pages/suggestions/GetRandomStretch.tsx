import { getRandomSuggestionWithOptionalFilters } from '@/utils/suggestions'
import { useState } from 'react'

const GetRandomStretch = () => {
  const [stretch, setStretch] = useState(
    getRandomSuggestionWithOptionalFilters({ category: 'stretching' }),
  )

  return (
    <div>
      {stretch === undefined ? (
        <h1>
          There were no results with the selected filters, try narrowing your
          search
        </h1>
      ) : (
        <div>
          <h1>{stretch.name}</h1>
          <h2>Instructions</h2>
          <ul>
            {stretch.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
          <h2>Primary Muscles</h2>
          <ul>
            {stretch.primaryMuscles.map((muscle, index) => (
              <li key={index}>{muscle}</li>
            ))}
          </ul>
          <h2>Secondary Muscles</h2>
          <ul>
            {stretch.secondaryMuscles.map((muscle, index) => (
              <li key={index}>{muscle}</li>
            ))}
          </ul>
          <h2>Images</h2>
          <ul>
            {stretch.images.map((image, index) => (
              <li key={index}>
                <img
                  src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${image}`}
                  alt={stretch.name}
                />
              </li>
            ))}
          </ul>
          <div>
            <button
              onClick={() =>
                setStretch(
                  getRandomSuggestionWithOptionalFilters({
                    category: 'stretching',
                  }),
                )
              }
            >
              Get another stretch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GetRandomStretch
