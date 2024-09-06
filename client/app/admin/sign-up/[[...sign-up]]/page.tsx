"use client"
import bcrypt from "bcryptjs-react"
import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function page() {
    const router = useRouter()
    const [username, setUsername] = useState<string>('')
    const takeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }
    const [password, setPassword] = useState<string>('')
    const takePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)

    }
    const [email, setEmail] = useState<string>('')
    const takeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }
    const [checkName, setCheckName] = useState<string>('none')
    const [checkEmail, setCheckEmail] = useState<string>('none')
    const [checkEmailHasRegistered, setCheckEmailHasRegistered] = useState<string>('none')
    const [checkPassword, setCheckPassword] = useState<string>('none')
    const saveUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (username === '') {
            setCheckName('');
        } else {
            setCheckName('none');
        }
        if (email === '') {
            setCheckEmail('');
        } else {
            setCheckEmail('none');
        }
        if (password === '') {
            setCheckPassword('');
        } else {
            setCheckPassword('none');
        }

        if (username !== '' && email !== '' && password !== '') {
            let checkEmailResponse = await axios.get(`http://localhost:8080/users?email_like=${email}`);
            if (checkEmailResponse.data.length === 0) {
                let user: User = {
                    id: Math.floor(Math.random() * 1000000000),
                    role: 'Admin',
                    name: username,
                    email: email,
                    password: bcrypt.hashSync(password, 10),
                    status: true,
                    banner: '',
                    bio: '',
                    follows: [],
                    friends: [],
                    groups: [],
                    createAt: new Date().toISOString(),
                    avatar: "https://firebasestorage.googleapis.com/v0/b/ptit-son.appspot.com/o/images%2Favatar-trang-4.jpg?alt=media&token=42d35db7-47e1-451d-acd1-8ceced065c6f"
                };
                try {
                    await axios.post('http://localhost:8080/users', user);
                    setCheckName('none');
                    setCheckEmail('none');
                    setCheckPassword('none');
                    setCheckEmailHasRegistered('none');
                    router.push('/admin/sign-in');
                } catch (error) {
                    console.error(error);
                }
            } else {
                setCheckEmailHasRegistered('');
            }
        }
    };
    return (
        <div className='flex'>
            <img src="https://firebasestorage.googleapis.com/v0/b/m25-project-cde45.appspot.com/o/bg-sign.png?alt=media&token=88eb49e7-75d0-4b18-83bc-0864c26bff77" className='bg-gradient-to-l from-slate-300 to-slate-600 h-screen w-1/2' />
            <div className='mt-[80px] ml-[190px]'>
                <form className="">
                    <strong className="text-3xl">Đăng ký tài khoản Admin</strong>
                    <div className="mt-[30px] mb-[20px] w-[400px] flex justify-between">
                        <label className="">Tên của bạn:</label>
                        <input className="border-slate-200 border-2 rounded p-1 w-[270px] bg-transparent" type="email" onChange={takeName} />
                    </div>
                    <div
                        className="flex mb-5 text-red-500 ml-4"
                        role="alert"
                        style={{ display: `${checkName}` }}
                    >
                        * Tên không được để trống.
                    </div>
                    <div className="mb-[20px] w-[400px] flex justify-between">
                        <label className="">Email:</label>
                        <input className="border-slate-200 border-2 rounded p-1 w-[270px] bg-transparent" type="email" onChange={takeEmail} />
                    </div>
                    <div
                        className="flex mb-5 text-red-500 ml-4"
                        role="alert"
                        style={{ display: `${checkEmail}` }}
                    >
                        * Email không được để trống.
                    </div>
                    <div
                        className="flex mb-5 text-red-500 ml-4"
                        role="alert"
                        style={{ display: `${checkEmailHasRegistered}` }}
                    >
                        * Email đã tồn tại.
                    </div>
                    <div className="w-[400px] flex justify-between mb-[20px]">
                        <label className="">Mật khẩu:</label>
                        <input className="border-slate-200 border-2 rounded p-1 w-[270px] bg-transparent" type="password" onChange={takePass} />
                    </div>
                    <div
                        className="flex mb-5 text-red-500 ml-4"
                        role="alert"
                        style={{ display: `${checkPassword}` }}
                    >
                        * Mật khẩu không được để trống!
                    </div>
                    <div>
                        <button type="submit" className="bg-blue-600 text-white p-2 pl-10 pr-10 mb-3 rounded hover:opacity-80" onClick={saveUser}>Đăng ký</button>
                    </div>
                    <p className="">Bạn đã có tài khoản? <Link href={'/admin/sign-in'} className="hover:text-blue-600">Đăng nhập</Link></p>
                </form>
            </div>
        </div>
    )
}
