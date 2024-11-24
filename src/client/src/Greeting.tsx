import { trpc } from './utils/trpc';

export function Greeting() {
  const getUser = trpc.getUser.useQuery('hello');

  return <div>{getUser.data?.name}</div>;
}
