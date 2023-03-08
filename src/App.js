import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TaskList from './components/TaskList'

export const URL = process.env.REACT_APP_BACKEND_URL;

function App() {
	const notify = () => toast("Wow so easy!");
  return (
    <div className="app">
      <div className="task-container">
       <TaskList />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
