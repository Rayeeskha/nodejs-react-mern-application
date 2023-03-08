import axios from "axios";
import React, { useEffect, useState } from "react";
import TaskForm from './TaskForm'
import Task from './Task'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {URL} from '../App';
import loadingImg  from '../assets/loader.gif';

const TaskList = () => {
	// Task List Start
	const [tasks,setTasks]= useState([]);

	const [completedTasks, setCompletedTasks] = useState([]);

	const [isLoading,setIsLoading] = useState(false);

	// Edit state
	const [isEditing, setIsEditing]  = useState(false);

	const [taskID, setTaskID]  = useState("");

	// Task List End 
	const [formData, setFormData] = useState({
		name:"",
		completed:false
	})

	const {name} =  formData

	const handleInputChange = (e) => {
		const {name, value} = e.target
		setFormData({...formData,[name]:value})
	}
	// GET TASKS
	const getTasks = async () => {
		setIsLoading(true);
		try{
			const {data} = await axios.get(`${URL}/api/tasks/`, formData);
			setTasks(data);
			// console.log(data);
			setIsLoading(false);
		}catch(error){
			toast.error(error.message);
			setIsLoading(false);
		};
	};

	useEffect(() =>{
		getTasks()
	},[]);

	// END GET 


	// DELETE TASK
	const deleteTask = async (id) => {
		try{
			await axios.delete(`${URL}/api/tasks/${id}`);
			getTasks();
			toast.success('Taks Deleted Successfully !');
		}catch(error){
			toast.error(error.message);
		};
	};
	//END DELETE 

	// GET SINGLE TASK
	const getSingleTask = async (task) => {
		setFormData({name:task.name, completed:false});
		
		setTaskID(task._id);
		setIsEditing(true);
	};
	// END SINGLE TASK

	// UPDATE TASK
	const updateTask = async (e) => {
		e.preventDefault();
		if (name === "") {
			return toast.error('Input field cannot be empty');
		}
		try{
			await axios.put(`${URL}/api/tasks/${taskID}`, formData);
			setFormData({...formData, name:""});

			setIsEditing(false);

			toast.success('Task updated successfully !');
			getTasks();
		}catch(error){
			toast.error(error.message);
		}
	};
	//END UPDATE TASK

	// SET TO COMPLETE TASK
	const setToCompleteTask = async (task) => {
		const newFormData = {
			name : task.name,
			completed : true,
		}
		try{
			await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
			setFormData({...formData, name:""});
			toast.success('Task completed successfully !');
			getTasks();
		}catch(error){
			toast.error(error.message);
		}
	};
	//END SET TO COMPLETE TASK

	// Complete task use effect
	useEffect(() => {
		const cTask = tasks.filter((task) => {
			return task.completed == true;
		});
		setCompletedTasks(cTask);
	},[tasks]); 
	// Complete task use effect


	// CREATE TASKS
	const createTask = async (e) => {
		e.preventDefault();
		if (name === "") {
			return toast.error('Input field cannot be empty');
		}
		try{
			await axios.post(`${URL}/api/tasks/`, formData);
			setFormData({...formData, name:""});
			toast.success('Task added successfully !');
			getTasks();
		}catch(error){
			toast.error(error.message);
		}

		console.log(formData);
	};

	return <div>
		<h2>Task Manager</h2>
		<TaskForm name={name} handleInputChange={handleInputChange} 
		 createTask={createTask}  isEditing={isEditing}
		 updateTask={updateTask} />

		{tasks.length > 0 && (
		 	<div className="--flex-between --pb">
				<p>Total Tasks : </p> {tasks.length}
				<p>Completed Tasks : </p> {completedTasks.length}
			</div>
		
		)}
		
		<hr/>
		
		{
			isLoading && (
				<div className="--flex-center">
					<img src={loadingImg} alt="Loading" />
				</div>
			)
		}

		{
			!isLoading && tasks.length === 0 ? (
				<p className="--py">No Task Found Please add a Task !</p>
			
			)  : (
				<>
					{tasks.map((task, index) => {
						return <Task key={task.id} task={task} 
						index={index} deleteTask={deleteTask} 
						getSingleTask={getSingleTask} 
						setToCompleteTask={setToCompleteTask} />
					})}
				</>
			)

		}
		
	</div>
};

export default TaskList;