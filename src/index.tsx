import {createRoot} from 'react-dom/client';
import {App} from './App';
import {HttpServiceLive} from './Http';

const container = document.getElementById('app');
const root = createRoot(container!);
const services = HttpServiceLive();

const AppWithServices = services(App);

root.render(<AppWithServices />);
