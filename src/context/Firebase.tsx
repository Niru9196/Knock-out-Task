import { createContext, ReactNode, FC, useContext, useEffect, useState } from "react";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    Auth,
    UserCredential,
    onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    QuerySnapshot,
    DocumentData,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENTID,
    databaseURL: import.meta.env.VITE_DATABASEURL,
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
const firestore = getFirestore(firebaseApp);

interface Task {
    taskTitle: string;
    description: string;
    taskCategory: string;
    dueDate: string;
    taskStatus: "to-do" | "in-progress" | "completed";
}

interface FirebaseContextValue {
    signupUserWithEmailAndPassword: (
        email: string,
        password: string
    ) => Promise<UserCredential>;
    putData: (key: string, data: unknown) => Promise<void>;
    handleAddNewTask: (task: Task) => Promise<void>;
    getAllTask: () => Promise<QuerySnapshot<DocumentData>>;
    getTaskById: (taskId: string) => Promise<DocumentData | undefined>;
    deleteTaskById: (taskId: string) => Promise<void>;
    updateTask: (taskId: string, updatedData: Partial<Task>) => Promise<void>;
    auth: Auth;
    currentUser: any;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error("useFirebase must be used within a FirebaseProvider");
    }
    return context;
};

interface FirebaseProviderProps {
    children: ReactNode;
}

export const FirebaseProvider: FC<FirebaseProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Check if there's a user in localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));  // Restore from localStorage
        }
    
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user)); // Store user in localStorage
          } else {
            localStorage.removeItem('currentUser'); // Remove user from localStorage on sign out
          }
        });
    
        return () => unsubscribe();
      }, []);
  
    const handleError = (action: string, error: unknown) => {
        console.error(`Error during ${action}: `, error);
    };

    const signupUserWithEmailAndPassword = async (
        email: string,
        password: string
    ): Promise<UserCredential> => {
        try {
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            handleError("user sign-up", error);
            throw error;
        }
    };

    const putData = async (key: string, data: unknown): Promise<void> => {
        try {
            await set(ref(database, key), data);
        } catch (error) {
            handleError("putting data in database", error);
            throw error;
        }
    };

    const handleAddNewTask = async (task: Task): Promise<void> => {
        try {
            await addDoc(collection(firestore, "add_task"), task);
        } catch (error) {
            handleError("adding task to Firestore", error);
            throw error;
        }
    };

    const getAllTask = async (): Promise<QuerySnapshot<DocumentData>> => {
        try {
            return await getDocs(collection(firestore, "add_task"));
        } catch (error) {
            handleError("fetching tasks from Firestore", error);
            throw error;
        }
    };

    const getTaskById = async (
        taskId: string
    ): Promise<DocumentData | undefined> => {
        try {
            const taskRef = doc(firestore, "add_task", taskId);
            const taskSnap = await getDoc(taskRef);
            return taskSnap.exists() ? taskSnap.data() : undefined;
        } catch (error) {
            handleError("fetching task by ID", error);
            throw error;
        }
    };

    const deleteTaskById = async (taskId: string): Promise<void> => {
        try {
            await deleteDoc(doc(firestore, "add_task", taskId));
        } catch (error) {
            handleError("deleting task from Firestore", error);
            throw error;
        }
    };

    const updateTask = async (
        taskId: string,
        updatedData: Partial<Task>
    ): Promise<void> => {
        try {
            await updateDoc(doc(firestore, "add_task", taskId), updatedData);
        } catch (error) {
            handleError("updating task in Firestore", error);
            throw error;
        }
    };

    return (
        <FirebaseContext.Provider
            value={{
                signupUserWithEmailAndPassword,
                putData,
                handleAddNewTask,
                getAllTask,
                getTaskById,
                deleteTaskById,
                updateTask,
                currentUser,
                auth,
            }}
        >
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseContext;
