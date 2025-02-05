import React, { useState, useCallback } from "react";
import { Card, message } from "antd";
import TaskPopup from "../component/AddTask";
import { EditTaskDropdown } from "../helper/CommonFunction";
import { capitalizeFirstLetter, removeHtmlTags } from "../helper/UtilCommon";
import { TaskData, Task, TaskCardProps } from "../types/task";
import TaskCard from "../component/TaskCard";

enum SectionStatus {
    TODO = "TO-DO",
    IN_PROGRESS = "IN-PROGRESS",
    COMPLETED = "COMPLETED",
}

interface UpdateTaskPayload {
    taskStatus: SectionStatus;
}


interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setDragTask: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (taskData: TaskData) => Promise<void>;
  selectedTaskId: string;
  setSelectedTaskId: React.Dispatch<React.SetStateAction<string>>;
  selectedIdTaskData: Task | null;
  setSelectedIdTaskData: React.Dispatch<React.SetStateAction<Task | null>>;
  getTaskById: (id: string) => Promise<Task>;
  deleteTaskById: (id: string) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskPayload) => Promise<void>;
  onCloseModal: () => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  setTasks,
  setDragTask,
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  selectedTaskId,
  setSelectedTaskId,
  selectedIdTaskData,
  setSelectedIdTaskData,
  getTaskById,
  deleteTaskById,
  updateTask,
  onCloseModal,
}) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dropTarget, setDropTarget] = useState<SectionStatus | null>(null);

  const handleDragStart = (task: Task) => setDraggedTask(task);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDragEnter = (section: SectionStatus) => setDropTarget(section);

  const handleDragLeave = () => setDropTarget(null);

  const handleDrop = useCallback(
    async (newSection: SectionStatus) => {
      if (!draggedTask) return;

      try {
        const updatedTask = { ...draggedTask, taskStatus: newSection };
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === draggedTask.id ? { ...task, taskStatus: newSection } : task
            )
        );
        await updateTask(draggedTask.id, updatedTask);
        message.success("Task updated successfully!");
      } catch (error) {
        console.error("Error updating task:", error);
        message.error("Problem relocating task");
      } finally {
        setDragTask(false);
        setDraggedTask(null);
        setDropTarget(null);
      }
    },
    [draggedTask, setTasks, updateTask, setDragTask]
  );

  const renderTaskSection = (section: SectionStatus, bgColor: string) => {
    const tasksInSection = tasks.filter((task) => task.taskStatus.toLowerCase() === section.toLowerCase());

    return (
      <Card
        title={<span className="px-2 py-1 rounded-sm" style={{ backgroundColor: bgColor }}>{capitalizeFirstLetter(section)}</span>}
        className={`w-1/3 shadow-md border rounded-xl transition-all ${dropTarget === section ? "border-blue-500 bg-blue-100" : "bg-gray-100"}`}
        headStyle={{ backgroundColor: "#F1F1F1", padding: 0 }}
        bodyStyle={{ backgroundColor: "#F1F1F1", padding: '20px', height: "100%" }}
        onDragOver={handleDragOver}
        onDragEnter={() => handleDragEnter(section)}
        onDragLeave={handleDragLeave}
        onDrop={() => handleDrop(section)}
      >
        {tasksInSection.length > 0 ? (
          tasksInSection.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              setSelectedTaskId={setSelectedTaskId}
              getTaskById={getTaskById}
              setIsModalOpen={setIsModalOpen}
              setSelectedIdTaskData={setSelectedIdTaskData}
              deleteTaskById={deleteTaskById}
              setTasks={setTasks}
              handleDragStart={handleDragStart}
            />
          ))
        ) : (
          <div className="min-h-32 flex justify-center items-center text-gray-500 text-lg font-semibold">
            No tasks in {capitalizeFirstLetter(section)}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="flex gap-4 p-4">
      {renderTaskSection(SectionStatus.TODO, "#FAC3FF")}
      {renderTaskSection(SectionStatus.IN_PROGRESS, "#85D9F1")}
      {renderTaskSection(SectionStatus.COMPLETED, "#A2D6A0")}

      {isModalOpen && (
        <TaskPopup
          open={isModalOpen}
          onClose={(taskData) => handleSubmit(taskData)}
          selectedTaskId={selectedTaskId}
          selectedIdtaskData={selectedIdTaskData}
          setIsModalOpen={setIsModalOpen}
          onCloseModal={onCloseModal}
        />
      )}
    </div>
  );
};

export default TaskBoard;
