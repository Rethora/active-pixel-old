import { Await as DefaultAwait } from 'react-router-dom'

type AwaitResolveRenderFunction<T> = (data: Awaited<T>) => JSX.Element

type AwaitProps<T> = {
  children: React.ReactNode | AwaitResolveRenderFunction<T>
  errorElement?: React.ReactNode
  resolve: T
}

const Await = <T,>(props: AwaitProps<T>) => {
  return <DefaultAwait {...props} />
}

export default Await
