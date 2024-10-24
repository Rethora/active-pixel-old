import TaskForm from '@/forms/TaskForm'
import { makeAction, useLoaderData } from 'react-router-typesafe'
import Await from '@/components/Await'
import { Suspense } from 'react'
import Loading from '@/components/Loading'
import { getTaskLoader } from '@/pages/task/GetTask'
import { Task } from '@/utils/store'
import { SuggestionFilters } from '@/utils/suggestions'

export const putTaskAction = makeAction(async (props) => {
  const formData = await props.request.formData()
  const formDataEntries = Object.fromEntries(formData.entries())
  const id = props.params['id']
  if (!id) {
    throw new Error('Task ID is undefined')
  }
  const update: Partial<Omit<Task, 'id'>> = {
    name: formDataEntries['name'] as string,
    enabled: formDataEntries['enabled'] === 'on',
    cronExpression: formDataEntries['cronExpression'] as string,
    filters: JSON.parse(
      formDataEntries['filters'] as string,
    ) as SuggestionFilters,
  }
  await window.electronAPI.editTask(id, update)
  return null
})

const EditTask = () => {
  const { taskPromise } = useLoaderData<typeof getTaskLoader>()

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Await resolve={taskPromise} errorElement={<p>Error loading tasks</p>}>
          {(task) =>
            !task ? (
              <p>Task not found</p>
            ) : (
              <TaskForm
                defaultValues={task}
                action={`/task/edit/${task.id}`}
                method="PUT"
              />
            )
          }
        </Await>
      </Suspense>
    </div>
  )
}

export default EditTask
