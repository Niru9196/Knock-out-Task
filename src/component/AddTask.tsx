import React, { useEffect, useState, useCallback } from "react";
import { Modal, Input, Button, Form, Select, Radio, message } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { TASK_STATUS } from "../helper/Constant";
import { TaskData, TaskPopupProps } from "../types/task";

const TaskPopup: React.FC<TaskPopupProps> = ({
    open,
    selectedTaskId = "",
    selectedIdtaskData = {},
    setIsModalOpen,
    onCloseModal,
    onClose,
}) => {
    const [taskData, setTaskData] = useState<TaskData>({
        taskTitle: "",
        description: "",
        taskCategory: "work",
        taskStatus: "to-do",
        dueDate: "",
    });

    useEffect(() => {
        if (selectedIdtaskData) {
            setTaskData((prev) => ({
                ...prev,
                ...selectedIdtaskData,
            }));
        }
    }, [selectedIdtaskData]);

    const handleInputChange = useCallback(
        (field: keyof TaskData, value: string) => {
            setTaskData((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    const countWords = (text: string): number => {
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const handleDescriptionChange = useCallback((value: string) => {
        if (countWords(value) <= 300) {
            setTaskData((prev) => ({ ...prev, description: value }));
        }
    }, []);

    const handleSubmit = useCallback(() => {
        const { taskTitle, description, dueDate } = taskData;

        if (!taskTitle.trim() || !description.trim() || !dueDate.trim()) {
            return message.error("Kindly fill all the field"); 
        }

        onClose(taskData);
    }, [taskData, onClose]);

    const handleModalClose = () => setIsModalOpen(false);

    return (
        <Modal
            title={selectedTaskId ? "Edit Task" : "Create Task"}
            open={open}
            onCancel={onCloseModal}
            footer={[
                <Button key="cancel" onClick={handleModalClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {selectedTaskId ? "Update" : "Create"}
                </Button>,
            ]}
        >
            <Form layout="vertical">
                <Form.Item label="Task Title" required>
                    <Input
                        placeholder="Enter task title"
                        value={taskData.taskTitle}
                        onChange={(e) =>
                            handleInputChange("taskTitle", e.target.value)
                        }
                    />
                </Form.Item>

                <Form.Item label="Task Description" required>
                    <ReactQuill
                        value={taskData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter task description"
                    />
                    <div className="word-count mt-1">
                        <span>
                            {countWords(taskData.description)} / 300 words
                        </span>
                    </div>
                </Form.Item>

                <Form.Item label="Task Category" required>
                    <Radio.Group
                        value={taskData.taskCategory}
                        onChange={(e) =>
                            handleInputChange("taskCategory", e.target.value)
                        }
                    >
                        <Radio value="work">Work</Radio>
                        <Radio value="personal">Personal</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="Due Date" required>
                    <Input
                        type="date"
                        value={taskData.dueDate}
                        onChange={(e) =>
                            handleInputChange("dueDate", e.target.value)
                        }
                    />
                </Form.Item>

                <Form.Item label="Task Status" required>
                    <Select
                        value={taskData.taskStatus}
                        onChange={(value) =>
                            handleInputChange("taskStatus", value)
                        }
                        options={TASK_STATUS}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskPopup;
