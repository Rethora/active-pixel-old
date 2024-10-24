import { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { makeLoader } from 'react-router-typesafe'
import { Category, getRandomSuggestionWithFilters } from '@/utils/suggestions'

export const rootLoader = makeLoader(() => ({
  settingsPromise: window.electronAPI.getStoreValue('settings'),
}))

const RootLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.electronAPI.onUnproductivePeriod((activePercentage) => {
      console.log('Unproductive period! Active Percentage:', activePercentage)
      const filters = {
        category: ['stretching'] as unknown as Category[],
      }
      const suggestion = getRandomSuggestionWithFilters(filters)
      console.log(suggestion)
      navigate('suggestions/filtered', {
        state: {
          suggestion,
          filters,
        },
      })
    })
    window.electronAPI.handleTask((task) => {
      console.log('Task:', task)
      const suggestion = getRandomSuggestionWithFilters(task.filters)
      console.log('suggestion', suggestion)
      navigate('suggestions/filtered', {
        state: { suggestion, filters: task.filters },
      })
    })
  }, [navigate])

  return (
    <div>
      <div>
        <ul>
          <li>
            <Link to="home">Home</Link>
          </li>
          <li>
            <Link to="notfound">Not Found</Link>
          </li>
          <li>
            <Link to="settings">Settings</Link>
          </li>
          <li>
            <Link to="task/list">List Tasks</Link>
          </li>
          <li>
            <Link to="task/new">New Task</Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  )
}

export default RootLayout
