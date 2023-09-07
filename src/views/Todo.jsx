import axios from "axios"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import Swal from 'sweetalert2'
const { VITE_APP_HOST } = import.meta.env

function TodoList() {

    const [token, setToken] = useState('')
    const [nickname, setNickname] = useState('')

    const [todo, setTodo] = useState('')
    const [todoList, setTodoList] = useState([])
    const [todoStatus, setTodoStatus] = useState('all')

    const [inCompletedItem, setInCompletedItem] = useState(0)

    const filterTodo = todoList.filter((item) => {
        if (todoStatus === "completed") {
            return item.status
        }
        if (todoStatus === "inCompleted") {
            return !item.status
        }
        return true
    })

    function changeTodoStatus(status) {
        setTodoStatus(status)
    }

    useEffect(() => {
        const cookies = document.cookie.split("; ")
        const cookieToken = cookies.find((row) => row.startsWith("token="))?.split("=")[1];

        setToken(cookieToken)

        // 驗證token
        ;(async () => {
            await axios.get(`${VITE_APP_HOST}/users/checkout`, {
                headers: {
                    Authorization: cookieToken
                }
            })
            .then((response) => {
                setNickname(response.data.nickname)
            })
            .catch((error) => {
                Swal.fire({
                    title: "驗證失敗",
                    text: error.response.data.message,
                    icon: 'error'
                })
            })
        })()

        getTodo(cookieToken)

    }, [])

    useEffect(() => {
        let count = 0
        todoList.forEach((item) => {
            count += item.status ? 0 : 1
        })
        setInCompletedItem(count)
    }, [todoList])
    
    async function removeTodo(item) {
        await axios.delete(`${VITE_APP_HOST}/todos/${item.id}`, {headers: {Authorization: token}})
        .then((response) => {
            setTodoList(todoList.filter((todoItem) => item.id !== todoItem.id))
            getTodo(token)
        })
        .catch((error) => {
            Swal.fire({
                title: "驗證失敗",
                text: error.response.data.message,
                icon: 'error'
            })
        })
    }

    async function removeTodoList() {
        todoList.forEach((item) => {
            if (item.status) {
                removeTodo(item)
            }
        })
    }

    async function getTodo(cookieToken) {
        await axios.get(`${VITE_APP_HOST}/todos/`, {headers: {Authorization: cookieToken}})
        .then((response) => {
            setTodoList(response.data.data.map((item) => {
                return {
                    id: item.id,
                    content: item.content,
                    status: item.status
                }
            }))
        })
        .catch((error) => {
            Swal.fire({
                title: "新增失敗",
                text: error.response.data.message,
                icon: 'error'
            })
        })
    }

    async function signOut() {
        await axios.post(`${VITE_APP_HOST}/users/sign_out`, {}, {
            headers: {
                Authorization: token
            }
        })
        .then((response) => {
            Swal.fire({
                title: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            })
        })
        .catch((error) => {
            Swal.fire({
                title: "登出失敗",
                text: error.response.data.message,
                icon: 'error'
            })
        })
    }

    async function addTodo() {
        await axios.post(`${VITE_APP_HOST}/todos/`, {content: todo}, {headers: {Authorization: token}})
            .then((response) => {
                getTodo(token)
                setTodo('')
            })
            .catch((error) => {
                Swal.fire({
                    title: "內容錯誤",
                    text: error.response.data.message,
                    icon: 'error'
                })
            })
    }

    async function updateStatus(e, item) {
        setTodoList(todoList.map((todoItem) => {
            return item.id === todoItem.id
                ? {...item, status: e.target.checked}
                : todoItem
        }))

        await axios.patch(`${VITE_APP_HOST}/todos/${item.id}/toggle`, {}, {headers: {Authorization: token}})
            .then((response) => {
                // console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            addTodo()
        }
    }
    
    return (
        <div id="todoListPage" className="bg-half">
        <nav>
            <h1><a href="/todoList" style={{backgroundImage: 'url("/logo (2).svg")'}}>ONLINE TODO LIST</a></h1>
            <ul>
                <li className="todo_sm"><a href="/todoList"><span>{nickname}的待辦</span></a></li>
                <li><NavLink to="/" onClick={() => signOut()}>登出</NavLink></li>
            </ul>
        </nav>
        <div className="container todoListPage vhContainer">
            <div className="todoList_Content">
                <div className="inputBox">
                    <input
                        type="text"
                        placeholder="請輸入待辦事項"
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <button type="button" onClick={() => addTodo()}>
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
                <div className="todoList_list">
                    <ul className="todoList_tab">
                        <li><button type="button" onClick={() => changeTodoStatus("all")} className={todoStatus === "all" ? 'active' : ''}>全部</button></li>
                        <li><button type="button" onClick={() => changeTodoStatus("inCompleted")} className={todoStatus === "inCompleted" ? 'active' : ''}>待完成</button></li>
                        <li><button type="button" onClick={() => changeTodoStatus("completed")} className={todoStatus === "completed" ? 'active' : ''}>已完成</button></li>
                    </ul>
                    <div className="todoList_items">
                        <ul className="todoList_item">
                            {filterTodo.length === 0
                                &&  <li className="todoList_label" style={{justifyContent: 'space-around'}}>
                                        目前尚無待辦事項
                                    </li>
                            }
                            {filterTodo.map((item) => {
                                return (
                                    <li key={item.id}>
                                        <label className="todoList_label">
                                            <input className="todoList_input" type="checkbox" checked={item.status} onChange={(e) => updateStatus(e, item)}/>
                                            <span>{item.content}</span>
                                        </label>
                                        <button type="button" onClick={() => removeTodo(item)}>
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="todoList_statistics">
                            <p> {inCompletedItem} 個待完成項目</p>
                            <button type="button" onClick={() => removeTodoList()}>清除已完成項目</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default TodoList