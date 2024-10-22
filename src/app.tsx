import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import RootLayout, { rootLoader } from '@/layouts/RootLayout'
import Home from '@/pages/Home'
import SuggestionsLayout from '@/layouts/SuggestionsLayout'
import SettingsPage, { settingsActions } from '@/pages/Settings'
import GetRandomStretch from '@/pages/suggestions/GetRandomStretch'

const router = createHashRouter([
  {
    id: 'root',
    path: '',
    loader: rootLoader,
    element: <RootLayout />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        action: settingsActions,
      },
      {
        path: 'suggestions',
        element: <SuggestionsLayout />,
        children: [
          {
            children: [
              {
                path: 'random',
                children: [
                  {
                    path: 'stretch',
                    element: <GetRandomStretch />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <RootLayout />,
  },
])

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<RouterProvider router={router} />)
} else {
  console.error('Root container not found')
}
