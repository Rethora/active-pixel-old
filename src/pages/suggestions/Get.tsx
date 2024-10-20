import { useState } from "react";
import { Suggestion, useSuggestionsContext } from "@/hooks/useSuggestions";

const Get = () => {
  const { getRandomSuggestionWithOptionalFilters } = useSuggestionsContext();
  const [suggestion, setSuggestion] = useState<Suggestion | undefined>(
    getRandomSuggestionWithOptionalFilters()
  );

  return (
    <div>
      {suggestion === undefined ? (
        <h1>
          There were no results with the selected filters, try narrowing your
          search
        </h1>
      ) : (
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
          <div>
            <button
              onClick={() =>
                setSuggestion(getRandomSuggestionWithOptionalFilters())
              }
            >
              Get another suggestion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Get;
