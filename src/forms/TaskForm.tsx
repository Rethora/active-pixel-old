import CronScheduler from '@/components/CronScheduler'
import SelectSuggestionFilters from '@/components/SelectSuggestionFilters'
import { FormMethod } from '@/utils/form'
import { Task } from '@/utils/store'
import { SuggestionFilters } from '@/utils/suggestions'
import { useState } from 'react'
import { Form } from 'react-router-dom'

interface Props {
  action: string
  method: FormMethod
  defaultValues?: Task
}

const TaskForm = ({ action, method, defaultValues }: Props) => {
  const [cronExpression, setCronExpression] = useState(
    defaultValues?.cronExpression ?? '0 * * * *',
  )
  const [filters, setFilters] = useState<SuggestionFilters>(
    defaultValues?.filters ?? ({} as SuggestionFilters),
  )

  return (
    <Form method={method} action={action}>
      <h2>Name</h2>
      <input
        type="text"
        name="name"
        placeholder="Task name"
        required
        defaultValue={defaultValues?.name}
      />
      <h2>Enabled</h2>
      <input
        type="checkbox"
        name="enabled"
        defaultChecked={defaultValues?.enabled ?? true}
      />
      <br />
      <br />
      <h2>Schedule</h2>
      <CronScheduler value={cronExpression} setValue={setCronExpression} />
      <input type="hidden" name="cronExpression" value={cronExpression} />
      <SelectSuggestionFilters
        onFiltersChange={(filters) => {
          setFilters(filters)
        }}
        defaultValues={defaultValues?.filters}
      />
      <input type="hidden" name="filters" value={JSON.stringify(filters)} />
      <button type="submit">Submit</button>
    </Form>
  )
}

export default TaskForm
