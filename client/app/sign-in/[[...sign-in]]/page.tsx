"use client"
import axios from "axios";
import { useState } from "react";
import bcrypt from "bcryptjs-react"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter()
  const [check, setCheck] = useState<string>('none')
  const [checkEmailInput, setCheckEmailInput] = useState<string>('none')
  const [checkPasswordInput, setCheckPasswordInput] = useState<string>('none')
  const [checkStatus, setCheckStatus] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const inputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value)
    } else setPassword(e.target.value)
  }
  const submitUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (email === '') {
      setCheckEmailInput('')
    } else setCheckEmailInput('none')
    if (password === '') {
      setCheckPasswordInput('')
    } else setCheckPasswordInput('none')
    if (email !== '' && password !== '') {
      setCheckEmailInput('none')
      setCheckPasswordInput('none')
      let checkEmailResponse = await axios.get(`http://localhost:8080/users?email_like=${email}`);
      if (checkEmailResponse.data.length === 0) {
        setCheck('block')
      } else if (checkEmailResponse.data[0].status) {
        if (checkEmailResponse.data.length === 0) {
          setCheck('block')
        } else {
          bcrypt.compare(password, checkEmailResponse.data[0].password, function (err, result) {
            if (result) {
              router.push('/')
              localStorage.setItem('userHasLogin', JSON.stringify(email))
            } else {
              setCheck('block')
              console.log(err);
            }
          })
        }
      } else {
        setCheckStatus(true)
      }
    }
  }
  return (
    <div className='flex bg-slate-200'>
      <img src="https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/bg-sign.png?alt=media&token=f90c119c-62bf-4df8-a013-8900f888cd53" className='bg-gradient-to-l from-slate-300 to-slate-600 h-screen w-1/2' />
      <div className="mt-[100px] ml-[190px] bg-white h-[280px] p-5 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <form className="">
          <strong className="text-3xl">Đăng nhập</strong>
          <div className="mb-[20px] w-[400px] flex justify-between mt-6">
            <label className="">Email:</label>
            <input className="border-slate-200 border-2 rounded p-1 w-[270px] bg-transparent" type="email" value={email} name="email" onChange={inputValueChange} />
          </div>
          <div
            className="flex mb-5 text-red-500 ml-4"
            role="alert"
            style={{ display: `${checkEmailInput}` }}
          >
            * Email không được để trống
          </div>
          <div className="w-[400px] flex justify-between mb-[20px]">
            <label className="">Mật khẩu:</label>
            <input className="border-slate-200 border-2 rounded p-1 w-[270px] bg-transparent" type="password" value={password} name="password" onChange={inputValueChange} />
          </div>
          <div
            className="flex mb-5 text-red-500 ml-4"
            role="alert"
            style={{ display: `${checkPasswordInput}` }}
          >
            * Mật khẩu không được để trống
          </div>
          <div
            className="flex mb-5 text-red-500 ml-4"
            role="alert"
            style={{ display: `${check}` }}
          >
            * Email hoặc mật khẩu không tồn tại!
          </div>
          <div
            className="flex mb-5 text-red-500 ml-4"
            role="alert"
            style={{ display: `${checkStatus ? 'block' : 'none'}` }}
          >
            * Tài khoản đã bị khóa!
          </div>
          <div>
            <button type="submit" className="bg-blue-600 text-white p-2 pl-8 pr-8 mb-3 rounded hover:opacity-80" onClick={submitUser}>Đăng nhập</button>
          </div>
          <p className="">Bạn chưa có tài khoản? <Link href={'/sign-up'} className="hover:text-blue-600 ">Đăng ký ngay!</Link></p>
        </form>
      </div>
    </div>
  )
}