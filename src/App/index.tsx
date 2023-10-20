import './style.css';

import type {FC} from 'react';
import {getData} from '../DB/data';
import {useRemote} from '../Http';
import {Photos} from './Photos';

export const App: FC = () => {
  const state = useRemote(getData);

  switch (state.type) {
    case 'Idle':
    case 'Loading':
      return 'loading...';

    case 'Error':
      return <h1>Error! {state.error.error.message}</h1>;

    case 'Data':
      return <Photos model={state.data} />;
  }
};
