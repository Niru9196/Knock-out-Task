export interface LoginFormValues {
    email: string;
    password: string;
}

export type SignupFormValues = {
    email: string;
    password: string;
};

export interface TaskData {
    id?: string;
    key?: string;
    taskTitle: string;
    dueDate: string;
    taskStatus: "to-do" | "in-progress" | "completed";
    taskCategory: string;
    description: string;
}

export interface Task {
    id?: string;
    key?: string;
    taskTitle: string;
    dueDate: string;
    taskStatus: string;
    taskCategory: string;
    description: string;
}

export interface TaskCardProps {
    task: Task;
    setSelectedTaskId: React.Dispatch<React.SetStateAction<string>>;
    getTaskById: (id: string) => Promise<Task>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedIdTaskData: React.Dispatch<React.SetStateAction<Task | null>>;
    deleteTaskById: (id: string) => Promise<void>;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    handleDragStart: (task: Task) => void;
}

export interface TaskPopupProps {
    open: boolean;
    selectedTaskId?: string;
    selectedIdtaskData?: Partial<TaskData>;
    setIsModalOpen: (open: boolean) => void;
    onCloseModal: () => void;
    onClose: (taskData?: TaskData) => void;
}

export interface TaskHeaderProps {
    setListView: (view: boolean) => void;
    handleLogout: () => void;
    handleCategoryChange: (value: string) => void;
    handleDateChange: (date: Date | null, dateString: string) => void;
    searchTerm: string;
    handleSearch: (value: string) => void;
    setIsModalOpen: (open: boolean) => void;
    userEmail: string;
}
