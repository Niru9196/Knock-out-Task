import { EditTaskDropdown } from "../helper/CommonFunction";
import { capitalizeFirstLetter, removeHtmlTags } from "../helper/UtilCommon";
import { TaskCardProps } from "../types/task";

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  setSelectedTaskId,
  getTaskById,
  setIsModalOpen,
  setSelectedIdTaskData,
  deleteTaskById,
  setTasks,
  handleDragStart,
}) => {
  return (
    <div
      draggable
      onDragStart={() => handleDragStart(task)}
      className="bg-white rounded-xl p-4 mb-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
    >
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-lg font-semibold text-gray-800">
          {task.taskTitle}
        </span>
        <EditTaskDropdown
          id={task.id ?? ""}
          setSelectedTaskId={setSelectedTaskId}
          getTaskById={getTaskById}
          setIsModalOpen={setIsModalOpen}
          setSelectedIdTaskData={setSelectedIdTaskData}
          deleteTaskById={deleteTaskById}
          setTasks={setTasks}
        />
      </div>
      <div className="text-gray-600 mt-2">
        {removeHtmlTags(task.description)}
      </div>
      <div className="mt-3 text-blue-500 font-medium">
        {capitalizeFirstLetter(task.taskCategory)}
      </div>
    </div>
  );
};

export default TaskCard;
