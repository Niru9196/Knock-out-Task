import React, { useCallback } from "react";
import { Button, Dropdown, message, MenuProps } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Task } from "../types/task";

interface EditTaskDropdownProps {
  id: string;
  setSelectedTaskId: (id: string) => void;
  getTaskById: (id: string) => Promise<Task>;
  setIsModalOpen: (prevState: boolean) => void;
  setSelectedIdTaskData: (data: Task) => void;
  deleteTaskById: (id: string) => Promise<void>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const EditTaskDropdown: React.FC<EditTaskDropdownProps> = ({
  id,
  setSelectedTaskId,
  getTaskById,
  setIsModalOpen,
  setSelectedIdTaskData,
  deleteTaskById,
  setTasks,
}) => {
  const handleEditTask = useCallback(
    async (id: string) => {
      try {
        setSelectedTaskId(id);
        const taskData = await getTaskById(id);
        setSelectedIdTaskData(taskData);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error fetching task details:", error);
        message.error("Error fetching task details.");
      }
    },
    [setSelectedTaskId, getTaskById, setSelectedIdTaskData, setIsModalOpen],
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      try {
        await deleteTaskById(id);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        message.success("Task deleted successfully.");
      } catch (error) {
        console.error("Error deleting task:", error);
        message.error("Problem deleting task");
      }
    },
    [deleteTaskById, setTasks],
  );

  const menuItems: MenuProps["items"] = [
    {
      key: "edit",
      label: "Edit",
      onClick: () => handleEditTask(id),
    },
    {
      key: "delete",
      label: "Delete",
      onClick: () => handleDeleteTask(id),
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
      placement="bottomLeft"
    >
      <Button
        icon={<MoreOutlined />}
        className="!border-none bg-transparent hover:bg-gray-200"
        aria-label="Task options"
      />
    </Dropdown>
  );
};

export { EditTaskDropdown };
