import { useEffect, useState } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase'
import { TodoType } from "../types/TodosTypes"

const useTodos = () => {

    const [todos, setTodos] = useState<TodoType[]>([])
    const [description, setDescription] = useState<string>('')
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        console.log("Todos component just render");
        getTodosHandler()

    }, [])



    const getTodosHandler = async () => {
        console.log("get todos method");

        try {
            setLoader(true)
            const querySnapshot = await getDocs(collection(db, "todos"));
            let todosList: TodoType[] = []
            querySnapshot.forEach((doc) => {
                todosList.push({
                    description: doc.data()?.description,
                    id: doc.id,
                    createdAt: doc.data()?.createdAt
                });
            });

            console.log('todos', todosList);
            setTodos(todosList)


        } catch (error) {
            console.log('================catch====================');
            console.log(error);
            console.log('====================================');
        }
        finally {
            setLoader(false)
        }
    }


    const onTodoSubmitHandler = async () => {
        const newDoc = {
            description,
            createdAt: new Date()
        }


        try {
            const docRef = await addDoc(collection(db, "cities"), newDoc);
            console.log("Document written with ID: ", docRef.id);

            setTodos([...todos, { ...newDoc, id: docRef.id }])
        } catch (e) {
            console.error("Error adding document: ", e);
        }



    }


    const todoDeleteHandler = async (item: TodoType) => {
        try {
            await deleteDoc(doc(db, "todos", item.id));
            let filteredTodos = todos.filter((todo: TodoType) => item.id !== todo.id)
            setTodos(filteredTodos)
        } catch (error) {
            alert(error)
        }
    }


    const todoUpdateHandler = async (item: TodoType) => {
        try {
            await updateDoc(doc(db, "todos", item.id), {
                capital: true
            });
            let updatedTodos = todos.map((todo: TodoType) => {
                console.log('====================================');
                console.log(item.id, todo.id);
                console.log('====================================');
                if (item.id === todo.id) {
                    return {

                        description,
                        createdAt: new Date(),
                        id: todo.id,

                    }
                }
                else {
                    return todo
                }
            })

            console.log('====================================');
            console.log("updatedTodos", updatedTodos);
            console.log('====================================');

            setTodos(updatedTodos)
        } catch (error) {
            alert(error)
        }
    }



    return {
        todos,
        loader,
        description,
        setTodos,
        getTodosHandler,
        todoUpdateHandler,
        onTodoSubmitHandler,
        todoDeleteHandler,
        setDescription
    }
      
}
export default useTodos