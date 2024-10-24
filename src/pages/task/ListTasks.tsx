import { Suspense } from 'react'
import { Await, makeLoader, useLoaderData } from 'react-router-typesafe'
import Loading from '@/components/Loading'
import { Link } from 'react-router-dom'

export const listTasksLoader = makeLoader(() => ({
  tasksPromise: window.electronAPI.getAllTasks(),
}))

const ListTasks = () => {
  const { tasksPromise } = useLoaderData<typeof listTasksLoader>()

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Await resolve={tasksPromise} errorElement={<p>Error loading tasks</p>}>
          {(tasks) => (
            <div>
              <h1>Tasks</h1>
              <ul>
                {tasks.map((task) => (
                  <div key={task.id}>
                    <Link to={`/task/get/${task.id}`}>
                      <li>{task.name}</li>
                    </Link>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  )
}

export default ListTasks
