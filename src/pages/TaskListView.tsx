import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Tag,
    Typography,
    message,
    Modal,
} from "antd";
import {
    UpOutlined,
    DownOutlined,
} from "@ant-design/icons";
import { capitalizeFirstLetter, checkIsMobile, removeHtmlTags } from "../helper/UtilCommon";
import TaskPopup from "../component/AddTask";
import { EditTaskDropdown } from "../helper/CommonFunction";

const { Title } = Typography;

interface TaskData {
    id: string;
    key: string;
    taskTitle: string;
    dueDate: string | null;
    taskStatus: string;
    taskCategory?: string;
    description?: string;
}

interface CollapsedSections {
    todo: boolean;
    inProgress: boolean;
    completed: boolean;
}

interface AppProps {
    tasks: TaskData[];
    setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>;
}

const App: React.FC<AppProps> = ({ tasks, setTasks,  deleteTaskById, setIsModalOpen, isModalOpen, handleSubmit, setSelectedIdTaskData, selectedIdtaskData, updateTask, setSelectedTaskId, selectedTaskId, getTaskById, onCloseModal }) => {
    const [collapsedSections, setCollapsedSections] =
        useState<CollapsedSections>({
            todo: false,
            inProgress: false,
            completed: false,
        });

    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const isMobile = checkIsMobile();

    const toggleCollapse = (section: keyof CollapsedSections) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleCheckboxChange = (taskId: string, status: string) => {
        if (selectedTasks.length > 0) {
            const selectedTaskStatus = tasks.find((task) =>
                selectedTasks.includes(task.id)
            )?.taskStatus;
            if (selectedTaskStatus && selectedTaskStatus !== status) {
                return message.error("Please select tasks from one section.");
            }
        }
        setSelectedTasks((prev) =>
            prev.includes(taskId)
                ? prev.filter((id) => id !== taskId)
                : [...prev, taskId]
        );
        
    };

    const showDeleteModal = (task: TaskData) => {
        setIsModalVisible(true);
        setSelectedTaskId(task.id);
    };

    const handleDelete = async () => {
        if (selectedTaskId) {
            try {
                await deleteTaskById(selectedTaskId);
                setTasks((prev) =>
                    prev.filter((task) => task.id !== selectedTaskId)
                );
                message.success("Task deleted successfully.");
            } catch (error) {
                message.error("Failed to delete the task.");
            }
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };;

    const renderTaskSection = (section: string, color: string) => {
        const sectionTasks = tasks.filter(
            (task) => task.taskStatus.toLowerCase() === section.toLowerCase()
        );
        return (
            <>
                <Title
                    className={`p-3 mt-2 rounded-t-xl !mb-0 ${color} pointer flex justify-between !text-base`}
                    onClick={() =>
                        toggleCollapse(section as keyof CollapsedSections)
                    }
                >
                    <div>{section}</div>
                    <div>
                        {collapsedSections[
                            section as keyof CollapsedSections
                        ] ? (
                            <UpOutlined />
                        ) : (
                            <DownOutlined />
                        )}
                    </div>
                </Title>
                {!collapsedSections[section as keyof CollapsedSections] &&
                    (sectionTasks.length > 0 ? (
                        sectionTasks.map((task) => (
                            <Row
                                key={task.id}
                                className="p-2 bg-[#F1F1F1] items-center border border-gray-300 py-3"
                            >
                                <Col span={24} md={6}>
                                    <div className="flex gap-2">
                                        <p
                                            className={
                                                section === "Completed"
                                                    ? "line-through"
                                                    : ""
                                            }
                                        >
                                            {removeHtmlTags(task.taskTitle)}
                                        </p>
                                    </div>
                                </Col>
                                <Col
                                    span={6}
                                    className="!text-base max-md:!hidden"
                                >
                                    {task.dueDate}
                                </Col>
                                <Col
                                    span={6}
                                    className="!text-base max-md:!hidden"
                                >
                                    <Tag className="!p-1 !px-3 !text-base !border-none !bg-[#DDDADD]">
                                        {task.taskStatus.toUpperCase()}
                                    </Tag>
                                </Col>
                                <Col
                                    span={6}
                                    className="!text-base max-md:!hidden"
                                >
                                    <div className="flex justify-between mx-3">
                                        <p>
                                            {capitalizeFirstLetter(task.taskCategory) || "No Category"}
                                        </p>
                                        <EditTaskDropdown id={task.id} setSelectedTaskId={setSelectedTaskId} getTaskById={getTaskById} setIsModalOpen={setIsModalOpen} setSelectedIdTaskData={setSelectedIdTaskData} deleteTaskById={deleteTaskById} setTasks={setTasks} />
                                    </div>
                                </Col>
                            </Row>
                        ))
                    ) : (
                        <Row className="bg-[#F1F1F1] h-44 flex justify-center items-center rounded-b-xl w-full mx-auto">
                            <Col
                                span={24}
                                style={{ textAlign: "center", color: "#888" }}
                            >
                                No task in {section}
                            </Col>
                        </Row>
                    ))}
            </>
        );
    };

    useEffect(() => {
        const fetchTask = async () => {
            try {
                if (selectedTaskId) {
                    const result = await getTaskById(selectedTaskId);
                    setSelectedIdTaskData(result);
                }
            } catch (error) {
                console.error("Error fetching task:", error);
            }
        };
    
        fetchTask();
    }, [selectedTaskId, getTaskById, setSelectedIdTaskData]);

    return (
        <div className="md:px-3 pb-4">
            {!isMobile && (
                <Row gutter={16} className="mt-2">
                    <Col span={6}>
                        <strong>Task Name</strong>
                    </Col>
                    <Col span={6}>
                        <strong>Due On</strong>
                    </Col>
                    <Col span={6}>
                        <strong>Task Status</strong>
                    </Col>
                    <Col span={6}>
                        <strong>Task Category</strong>
                    </Col>
                </Row>
            )}
            {renderTaskSection("To-do", "bg-[#FAC3FF]")}
            {renderTaskSection("In-Progress", "bg-[#85D9F1]")}
            {renderTaskSection("Completed", "bg-[#CEFFCC]")}
            <Modal
                title="Are you sure you want to delete?"
                open={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Yes, Delete"
                cancelText="No, Cancel"
                okButtonProps={{ danger: true }}
            >
                <p>
                    Are you sure you want to delete this item? This action
                    cannot be undone.
                </p>
            </Modal>

            {isModalOpen && <TaskPopup open={isModalOpen} onClose={(taskData) => handleSubmit(taskData)} selectedTaskId={selectedTaskId} selectedIdtaskData={selectedIdtaskData} setIsModalOpen={setIsModalOpen} onCloseModal={onCloseModal} />}
        </div>
    );
};

export default App;
