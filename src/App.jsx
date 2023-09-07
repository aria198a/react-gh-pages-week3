import { Routes, Route } from "react-router-dom";
import SignUp from "./views/SignUp";
import Todo from "./views/Todo";
import Login from "./views/Login";

function App() {
  return(
   <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/todo" element={<Todo />}></Route>
      </Routes>
   </>
  )
}

export default App