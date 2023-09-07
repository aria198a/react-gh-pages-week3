import axios from "axios"
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
const { VITE_APP_HOST } = import.meta.env

function SignUp() {

    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: '',
        password: '',
        nickname: ''
    })
    const [checkPassword, setCheckPassword] = useState('')

    function updateForm(e) {
        const {name, value} = e.target
        setForm({...form, [name]: value})
    }

    function signUp() {
        if (form.password !== checkPassword) {
            Swal.fire({
                title: '再次密碼不一樣',
                icon: 'error',
            })
            return
        }

        (async () => {
            await axios.post(`${VITE_APP_HOST}/users/sign_up`, form)
                .then((response) => {
                    Swal.fire({
                        title: '註冊成功',
                        text: `UID: ${response.data.uid}`,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    navigate('/')
                })
                .catch((error) => {
                    Swal.fire({
                        title: "註冊失敗",
                        text: error.response.data.message,
                        icon: 'error',
                    })
                })
        })()
    }

    return (
        <div id="signUpPage" className="bg-yellow">
            <div className="container signUpPage vhContainer">
                <div className="side">
                    <a href="/react-final-work/#"><img className="logoImg" src="/logo_lg.svg" alt="" /></a>
                    <img className="d-m-n" src="/left.svg" alt="workImg" />
                </div>
                <div>
                    <form className="formControls" action="index.html">
                        <h2 className="formControls_txt">註冊帳號</h2>
                        <label className="formControls_label" htmlFor="email">Email</label>
                        <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" onChange={(e) => updateForm(e)} required />
                        <label className="formControls_label" htmlFor="nickname">您的暱稱</label>
                        <input className="formControls_input" type="text" name="nickname" id="nickname" placeholder="請輸入您的暱稱" onChange={(e) => updateForm(e)} />
                        <label className="formControls_label" htmlFor="password">密碼</label>
                        <input className="formControls_input" type="password" name="password" id="password" placeholder="請輸入密碼" onChange={(e) => updateForm(e)} required />
                        <label className="formControls_label" htmlFor="checkPassword">再次輸入密碼</label>
                        <input className="formControls_input" type="password" name="password" id="checkPassword" placeholder="請再次輸入密碼" onChange={(e) => setCheckPassword(e.target.value)} required />
                        <input className="formControls_btnSubmit" type="button" onClick={() => signUp()} value="註冊帳號" />
                        <NavLink className="formControls_btnLink" to="/">登入</NavLink>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp