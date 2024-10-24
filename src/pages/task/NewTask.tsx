import TaskForm from '@/forms/TaskForm'
import { makeLoader } from 'react-router-typesafe'

export const postNewTask = makeLoader(async ({ request }) => {
  const formData = await request.formData()
  const formDataEntries = Object.fromEntries(formData.entries())
  switch (request.method) {
    case 'POST':
      window.electronAPI.createTask({
        name: formDataEntries['name'] as string,
        cronExpression: formDataEntries['cronExpression'] as string,
        filters: JSON.parse(formDataEntries['filters'] as string),
        enabled: formDataEntries['enabled'] === 'on',
      })
      break
    default:
      break
  }

  return null
})

const NewTask = () => {
  return (
    <div>
      <h1>New Task</h1>
      <TaskForm action="/task/new" method="POST" />
    </div>
  )
}

export default NewTask
