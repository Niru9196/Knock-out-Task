import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "./App.css";
import { useFirebase } from "./context/Firebase";
import TaskPopup from "./component/AddTask";
import TaskListView from "./pages/TaskListView";
import TaskBoardView from "./pages/TaskBoardView";
import TaskHeader from "./component/TaskHeader";

import { TaskData } from "./types/task";

const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedTaskCategory, setSelectedTaskCategory] = useState<string>("");
    const [filterDueTask, setFilterDueTask] = useState<string>("");
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [listView, setListView] = useState(true);
    const [dragtask, setDragTask] = useState<boolean>(false);
    const [selectedIdtaskData, setSelectedIdTaskData] = useState({});
    const [selectedTaskId, setSelectedTaskId] = useState<string>("");

    const firebase = useFirebase();
    const { deleteTaskById, updateTask, getTaskById, auth } = useFirebase();
    const userEmail = auth?.currentUser?.email;
    const navigate = useNavigate();

    const handleDateChange = (date: any, dateString: string) => {
        setFilterDueTask(dateString);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedTaskCategory(value);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const onCloseModal = () => {
        setSelectedIdTaskData({});
        setSelectedTaskId(false);
        setIsModalOpen(false);
    };

    useEffect(() => {
        firebase.getAllTask()
            .then((task) => {
                const taskData = task.docs.map((doc) => {
                    const taskData = doc.data();
                    return {
                        id: doc.id,
                        key: doc.id,
                        taskTitle: taskData.taskTitle,
                        dueDate: taskData.dueDate,
                        taskStatus: taskData.taskStatus,
                        taskCategory: taskData.taskCategory,
                        description: taskData.description,
                    };
                });
                setTasks(taskData);
            })
            .catch((error) => console.error("Error fetching tasks:", error));
    }, [firebase, isModalOpen]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            message.success("You have successfully logged out");
            navigate("/");
        } catch (error) {
            message.error("An error occurred while logging out");
        }
    };

    const handleSubmit = async (taskData: TaskData) => {
        if (
            !taskData.taskTitle?.trim() ||
            !taskData.description?.trim() ||
            !taskData.taskCategory ||
            !taskData.dueDate ||
            !taskData.taskStatus
        ) {
            return message.error(
                "Please fill all the fields before submitting"
            );
        }
        console.log("task Data: ", taskData);
        console.log("selctid: ", selectedTaskId);
        if (selectedTaskId) {
            console.log("update");
            await firebase.updateTask(selectedTaskId, taskData);
            message.success("Task updated successfully!!");
        } else {
            console.log("here");
            await firebase.handleAddNewTask(taskData);
            message.success("Task added successfully!!");
        }
        onCloseModal();
    };

    const filteredTasks = tasks.filter((task) => {
        let isCategoryMatch = true;
        let isDateMatch = true;
        let isSearchMatch = true;

        if (selectedTaskCategory) {
            isCategoryMatch = task.taskCategory === selectedTaskCategory;
        }

        if (filterDueTask) {
            isDateMatch = task.dueDate === filterDueTask;
        }

        if (searchTerm) {
            isSearchMatch =
                task.taskTitle
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                task.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
        }

        return isCategoryMatch && isDateMatch && isSearchMatch;
    });

    return (
        <div className="App px-3">
            <TaskHeader
                setListView={setListView}
                handleLogout={handleLogout}
                handleCategoryChange={handleCategoryChange}
                handleDateChange={handleDateChange}
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                setIsModalOpen={setIsModalOpen}
                userEmail={userEmail}
            />

            {isModalOpen && (
                <TaskPopup
                    open={isModalOpen}
                    onClose={(taskData) => handleSubmit(taskData)}
                    selectedTaskId={selectedTaskId}
                    selectedIdtaskData={selectedIdtaskData}
                    setIsModalOpen={setIsModalOpen}
                    onCloseModal={onCloseModal}
                />
            )}

            <hr className="mt-6 text-[#D1D5DB]" />

            {listView ? (
                <TaskListView
                    tasks={filteredTasks}
                    setTasks={setTasks}
                    deleteTaskById={deleteTaskById}
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}
                    handleSubmit={handleSubmit}
                    setSelectedIdTaskData={setSelectedIdTaskData}
                    selectedIdtaskData={selectedIdtaskData}
                    updateTask={updateTask}
                    setSelectedTaskId={setSelectedTaskId}
                    selectedTaskId={selectedTaskId}
                    getTaskById={getTaskById}
                    onCloseModal={onCloseModal}
                />
            ) : (
                <TaskBoardView
                    tasks={filteredTasks}
                    setTasks={setTasks}
                    setDragTask={setDragTask}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    handleSubmit={handleSubmit}
                    selectedTaskId={selectedTaskId}
                    setSelectedTaskId={setSelectedTaskId}
                    selectedIdtaskData={selectedIdtaskData}
                    setSelectedIdTaskData={setSelectedIdTaskData}
                    getTaskById={getTaskById}
                    deleteTaskById={deleteTaskById}
                    updateTask={updateTask}
                    getTaskById={getTaskById}
                    onCloseModal={onCloseModal}
                />
            )}
        </div>
    );
};

export default App;
