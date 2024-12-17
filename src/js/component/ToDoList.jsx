import React, { useEffect, useState } from "react";

export const ToDoList = () => {

    const [todos, setTodos] = useState([]);
    const [edit, setEdit] = useState(false);
    const [task, setTask] = useState()
    const [completedEdit, setCompletedEdit] = useState()
    const [labelEdit, setLabelEdit] = useState("")
    const [editTask, setEditTask] = useState()
   // const [newUser, setNewUser] = useState ("")

    const host = "https://playground.4geeks.com/todo";

/*     const createUser = async () => {
        const uri = `${host}/users/rfrancop01`
        const options = {
            method: 'POST'
        }
        const response = await fetch(uri, options)
        if (!response.ok) {
            if (response.status == 400) {
                console.log('El usuario ya existe');
            } else {
                console.log('Error ', response.status, response.statusText);
                return;
            }
        }
        const data = await response.json();
        setNewUser(user);
        setTodos();
    } */
    
    // OKK  Método GET -> Leer (mostrar) tareas
    const showTask = async () => {
        const uri = `${host}/users/rfrancop01`;
        const options = {
            method: "GET"
        }

/*         if (!response.ok) {
            if(response.status == 404){
                createUser()
        }else{
            console.log("error", response.status, response.statusText);
        } */

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log("error", response.status, response.statusText);
            return { error: { status: response.status, statusText: response.statusText } }
        }
        const data = await response.json();
        console.log(data);
        setTodos(data.todos);

    }


    //.OKKK  Método POST -> Crear tarea 
    const addTask = async (event) => {
        event.preventDefault()
        const dataToSend = {
            label: task,
            is_done: false
        }
        const uri = `${host}/todos/rfrancop01`;
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        }
        console.log(uri, options);
        const response = await fetch(uri, options);
        console.log(response);

        if (!response.ok) {
            console.log("error", response.status, response.statusText);
            return { error: { status: response.status, statusText: response.statusText } }
        }
        const data = await response.json()
        console.log(data);
        setTask("") //Me faltaba el estado, lo apunto para acordarme!!
        showTask();
    }


    //Método DELETE -> Eliminar tarea
    const handleDelete = async (taskId) => {
        console.log(taskId);

        const uri = `${host}/todos/${taskId}`
        const options = {
            method: "DELETE"
        }
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log("error", response.status, response.statusText);
            return 
        }
        showTask(todos);
    }

    //Método PUT -> Actualizar(editar) tarea
    const handleSubmitEdit = async (event) => {
        event.preventDefault();
        // Defino el body
        const dataToSend = {
          label: labelEdit,
          is_done: completedEdit
        };
        const uri = `${host}/todos/${editTask.id}`;
        const options = {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dataToSend)
        }
        // console.log(uri);
        // console.log(options);
        const response = await fetch(uri, options);
        if (!response.ok) {
                // tratamos el error
                console.log('error:', response.status, response.statusText)
                return   // IMPORTANTE ---- ME VOY
        }
        // const data = await response.json()
        showTask()
        // lógica para llevar a valores iniciales a los estados
        setEdit(false);
        setEditTask({})
        setLabelEdit('')
        setCompletedEdit(null)
    
        
      }

      const handleEdit = (taskEdit) => {
          setEdit(true)
          setEditTask(taskEdit)
          setLabelEdit(taskEdit.label)
          setCompletedEdit(taskEdit.is_done)
      }

    const pendingTasks = () => {
        if (todos.length === 0) {
            return "No hay tareas pendientes, añadir tareas"
        } else {
            return todos.length + " tareas pendientes"
        }
    }


    useEffect(() => {
        showTask();
    }, [])

    return (
        <div>
            <div>
                <h1 className="fs-1 fw-bold text-primary">Mis Tareas:  </h1>
                {edit ?
                    <form onSubmit={handleSubmitEdit}>
                        <div className="mb-3 mx-2">
                            <label htmlFor="editToDo" className="form-label text-success">Editar tarea</label>
                            <input type="text" className="form-control" id="editToDo" aria-describedby="emailHelp"
                                value={labelEdit}
                                onChange={(event) => {setLabelEdit(event.target.value)}}
                            />
                        </div>
                        <div className="mb-3 form-check mx-2">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1"
                                checked={completedEdit}
                                onChange={(event) => {setCompletedEdit(event.target.checked)}}
                            />
                            <label className="form-check-label" htmlFor="exampleCheck1">Realizada</label>
                        </div>
                        <button type="submit" className="btn btn-primary mx-2 mb-2">Guardar</button>
                        <button type="reset" className="btn btn-secondary mb-2">Cancelar</button>
                    </form>
                    :
                    <form onSubmit={addTask}>
                        <div className="my-3 mx-2 text-secondary">
                            <label htmlFor="inputToDo" className="form-label">Agregar Tarea</label>
                            <input type="text" className="form-control" id="inputToDo"
                                value={task}
                                onChange={(event) => setTask(event.target.value)}
                            />
                        </div>
                    </form>
                }



            </div>
            <div className="mt-2 my-4">
                <h1 className="fs-1 fw-bold text-center text-success"> Listado de Tareas</h1>
                <ul className="list-group my-3 mx-2">
                    {todos.map((item) =>
                        <li key={item.id} className="list-group-item d-flex">
                            {item.is_done ?
                                <i className="fas fa-check me-auto text-success p-2"></i>
                                :
                                <i className="fas fa-times me-auto text-danger p-2"></i>
                            }
                            {item.label}
                            <i onClick={() => handleEdit(item)} className="fas fa-edit ms-auto p-2 text-success"></i>
                            <i onClick={() => handleDelete(item.id)} className="fas fa-trash ms-2 p-2 text-danger"></i>
                        </li>
                    )}
                    <li className="list-group-item bg-light text-secondary text-end fst-italic">
                        {pendingTasks()}
                    </li>
                </ul>
            </div>
        </div>
    )
}