import { Suspense } from 'react'
import { Await, makeLoader, useLoaderData } from 'react-router-typesafe'
import Loading from '@/components/Loading'
import { getFullFilterConfig } from '@/utils/suggestions'
import { capitalize } from '@/utils/string'
import CronScheduler from '@/components/CronScheduler'
import { Link } from 'react-router-dom'

export const getTaskLoader = makeLoader(({ params }) => ({
  taskPromise: params['id']
    ? window.electronAPI.getTask(params['id'])
    : Promise.reject(new Error('Task ID is undefined')),
}))

const GetTask = () => {
  const { taskPromise } = useLoaderData<typeof getTaskLoader>()

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Await resolve={taskPromise} errorElement={<p>Error loading task</p>}>
          {(task) => (
            <div>
              {!task ? (
                <p>Task not found</p>
              ) : (
                <div>
                  <Link to={`/task/edit/${task.id}`}>Edit</Link>
                  <h1>Task View</h1>
                  <h2>Name</h2>
                  <p>{task.name}</p>
                  <h2>Enabled?</h2>
                  <p>{task.enabled ? 'Yes' : 'No'}</p>
                  <h2>Schedule</h2>
                  <CronScheduler value={task.cronExpression} disabled />
                  <h2>Applied Filters</h2>
                  {Object.entries(getFullFilterConfig(task.filters)).map(
                    ([key, value]) => (
                      <div key={key}>
                        <h3>{capitalize(key)}</h3>
                        <ul>
                          {value.map((v) => (
                            <li key={v}>{v}</li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  )
}

export default GetTask
