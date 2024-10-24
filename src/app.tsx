import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import RootLayout, { rootLoader } from '@/layouts/RootLayout'
import Home from '@/pages/Home'
import SettingsPage, { settingsActions } from '@/pages/Settings'
import ListTasks, { listTasksLoader } from '@/pages/task/ListTasks'
import NewTask, { postNewTask } from '@/pages/task/NewTask'
import GetTask, { getTaskLoader } from '@/pages/task/GetTask'
import EditTask, { putTaskAction } from '@/pages/task/EditTask'
import GetFilteredSuggestion from '@/pages/suggestions/GetFilteredSuggestion'

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
        path: 'task',
        children: [
          {
            path: 'list',
            element: <ListTasks />,
            loader: listTasksLoader,
          },
          {
            path: 'get/:id',
            element: <GetTask />,
            loader: getTaskLoader,
          },
          {
            path: 'edit/:id',
            element: <EditTask />,
            loader: getTaskLoader,
            action: putTaskAction,
          },
          {
            path: 'new',
            element: <NewTask />,
            action: postNewTask,
          },
        ],
      },
      {
        path: 'suggestions',
        children: [
          {
            children: [
              {
                path: 'filtered',
                element: <GetFilteredSuggestion />,
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
