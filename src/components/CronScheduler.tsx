import { useCallback } from 'react'
import { Cron } from 'react-js-cron'
import cronParser from 'cron-parser'

import 'react-js-cron/dist/styles.css'

interface Props {
  value: string
  setValue?: (newValue: string) => void
  disabled?: boolean
}

const CronScheduler = ({
  value,
  setValue = () => null,
  disabled = false,
}: Props) => {
  const calculateNextRunTime = useCallback(() => {
    try {
      const interval = cronParser.parseExpression(value)
      return interval.next().toString()
    } catch (err) {
      console.error(err)
      return 'Invalid cron expression'
    }
  }, [value])

  return (
    <div>
      <Cron
        value={value}
        setValue={setValue}
        humanizeLabels
        humanizeValue
        clockFormat="12-hour-clock"
        clearButton={false}
        disabled={disabled}
      />
      <p>Next Run Time At: {calculateNextRunTime()}</p>
    </div>
  )
}

export default CronScheduler
