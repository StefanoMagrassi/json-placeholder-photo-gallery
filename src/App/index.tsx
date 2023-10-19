import type {FC} from 'react';
import {useRemote} from '../DB/remote';
import {Photos} from './Photos';

export const App: FC = () => {
  const state = useRemote();

  switch (state.type) {
    case 'Idle':
    case 'Loading':
      return 'loading...';

    case 'Error':
      return <h1>Error! {state.error.error.message}</h1>;

    case 'Data':
      return <Photos data={state.model} />;
  }
};
