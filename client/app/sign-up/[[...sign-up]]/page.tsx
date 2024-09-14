"use client"
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import bcrypt from "bcryptjs-react"
import { useRouter } from "next/navigation";

export default function Page() {
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
          role: 'User',
          name: username,
          email: email,
          password: bcrypt.hashSync(password, 10),
          status: true,
          banner: 'https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/Screenshot%202024-09-10%20231906.png?alt=media&token=65a4c0a2-d5ef-4a54-8f90-9eba454416bb',
          bio: '',
          follows: [],
          friends: [],
          groups: [],
          createAt: new Date().toISOString(),
          avatar: "https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/avatar-default.png?alt=media&token=55935550-839a-4465-a0ea-9c0bc25ac3db"
        };
        try {
          await axios.post('http://localhost:8080/users', user);
          setCheckName('none');
          setCheckEmail('none');
          setCheckPassword('none');
          setCheckEmailHasRegistered('none');
          router.push('/sign-in')
        } catch (error) {
          console.error(error);
        }
      } else {
        setCheckEmailHasRegistered('');
      }
    }
  };
  return (
    <div className='flex bg-slate-200'>
      <img src="https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/bg-sign.png?alt=media&token=f90c119c-62bf-4df8-a013-8900f888cd53" className='bg-gradient-to-l from-slate-300 to-slate-600 h-screen w-1/2' />
      <div className="mt-[100px] ml-[190px] bg-white h-[350px] p-5 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <form className="">
          <strong className="text-3xl">Đăng ký tài khoản</strong>
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
          <p className="">Bạn đã có tài khoản? <Link href={'/sign-in'} className="hover:text-blue-600">Đăng nhập</Link></p>
        </form>
      </div>
    </div>
  )
}