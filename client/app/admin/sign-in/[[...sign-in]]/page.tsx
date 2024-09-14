"use client"
import axios from 'axios'
import React, { useState } from 'react'
import bcrypt from "bcryptjs-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function page() {
    const router = useRouter()
    const [check, setCheck] = useState<string>('none')
    const [adminAcc, setAdminAcc] = useState<string>('none')
    const [checkEmailInput, setCheckEmailInput] = useState<string>('none')
    const [checkPasswordInput, setCheckPasswordInput] = useState<string>('none')
    const [checkStatus, setCheckStatus] = useState<boolean>(false)
    const [email, setEmail] = useState<any>('')
    const [password, setPassword] = useState<string>('')
    const submitUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (email === ''){
            setCheckEmailInput('')
        }
        if (password === ''){
            setCheckPasswordInput('')
        }
        if(email !== '' && password !== ''){
            setCheckEmailInput('none')
            setCheckPasswordInput('none')
            let checkEmailResponse = await axios.get(`http://localhost:8080/users?email_like=${email}`);
            if(checkEmailResponse.data[0].role === 'Admin'){
                if(checkEmailResponse.data.length === 0){
                    setCheck('block')
                }else {
                    if(!checkEmailResponse.data[0].status){
                        setCheckStatus(true)
                    }else {
                        bcrypt.compare(password, checkEmailResponse.data[0].password, function(err, result) {
                            if(result){
                                router.push('/admin')
                                localStorage.setItem('userHasLogin', JSON.stringify(email))
                            }else{
                                console.log(err);
                                setCheck('block')
                            }
                        })
                    }
                }
            }else setAdminAcc('block')
        }
    }
    const inputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.name === 'email'){
            setEmail(e.target.value)
        }else setPassword(e.target.value)
    }
    return (
        <div className='flex bg-slate-200'>
            <img src="https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/bg-sign.png?alt=media&token=f90c119c-62bf-4df8-a013-8900f888cd53" className='bg-gradient-to-l from-slate-300 to-slate-600 h-screen w-1/2' />
            <form className="mt-[100px] ml-[190px] bg-white h-[280px] p-5 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
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
                    style={{ display: `${adminAcc}` }}
                >
                    * Không phải tài khoản admin
                </div>
                <div
                    className="flex mb-5 text-red-500 ml-4"
                    role="alert"
                    style={{ display: `${checkStatus ? 'block' : 'none'}` }}
                >
                    * Tài khoản đã bị khóa!
                </div>
                <div>
                    <Link href={'/admin'}><button type="submit" className="bg-blue-600 text-white p-2 pl-8 pr-8 mb-3 rounded hover:opacity-80" onClick={submitUser}>Đăng nhập</button></Link>
                </div>
                <p className="">Tạo tài khoản admin? <Link href={'/admin/sign-up'} className="hover:text-blue-600 ">Đăng ký ngay!</Link></p>
            </form>

        </div>
    )
}
