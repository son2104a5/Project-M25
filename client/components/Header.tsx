"use client";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faBell,
  faGamepad,
  faHouse,
  faMagnifyingGlass,
  faUserGroup,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Header() {
  const pathName = usePathname();
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const userHasLogin =
    JSON.parse(localStorage.getItem("userHasLogin") as string) || undefined;
  const [footerUser, setFooterUser] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:8080/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);
  const isUser: any = users?.find((user: any) => user.email === userHasLogin);
  const handleLogout = () => {
    localStorage.removeItem("userHasLogin");
    setFooterUser(false);
    router.push("/sign-in");
  };
  return (
    <div className=" sticky top-0 z-50">
      <header className="bg-[#242526] p-2 flex items-center justify-between border-b-[1px] border-[#373839]">
        {/* <!-- Left section: Logo and Search Bar --> */}
        <div className="flex items-center space-x-4">
          {/* <!-- Logo --> */}
          <img
            src="https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/logo.png?alt=media&token=3812c421-0d50-4359-b716-c872b53405c4"
            alt=""
            width={70}
            onClick={() => router.push('/')}
            className="cursor-pointer"
          />
          {/* <!-- Search Bar --> */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm trên ChimeIn"
              className="bg-[#3a3b3c] text-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none w-64"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </svg>
          </div>
        </div>

        {/* <!-- Center section: Navigation Icons --> */}
        <div className="flex h-full gap-2 items-center">
          <Link href={"/"} className={pathName == "/" ? "active" : ""}>
            <FontAwesomeIcon
              icon={faHouse}
              className="w-[120px] text-2xl text-center text-white hover:bg-[#3a3b3c] hover:rounded pt-3 pb-3"
            />
          </Link>
          <Link
            href={"/watch"}
            className={pathName == "/watch" ? "active" : ""}
          >
            <FontAwesomeIcon
              icon={faVideo}
              className="w-[120px] text-2xl text-center text-white hover:bg-[#3a3b3c] hover:rounded pt-3 pb-3"
            />
          </Link>
          <Link
            href={"/groups"}
            className={pathName == "/groups" ? "active" : ""}
          >
            <FontAwesomeIcon
              icon={faUserGroup}
              className="w-[120px] text-2xl text-center text-white hover:bg-[#3a3b3c] hover:rounded pt-3 pb-3"
            />
          </Link>
          <Link
            href={"/gaming"}
            className={pathName == "/gaming" ? "active" : ""}
          >
            <FontAwesomeIcon
              icon={faGamepad}
              className="w-[120px] text-2xl text-center text-white hover:bg-[#3a3b3c] hover:rounded pt-3 pb-3"
            />
          </Link>
        </div>

        {/* <!-- Right section: Profile and Notifications --> */}
        <div className="flex items-center space-x-4">
          <div className="bg-[#3a3b3c] rounded-full p-3 hover:bg-[#4a4b4d]">
            <FontAwesomeIcon icon={faBars} className="w-4 text-white" />
          </div>
          <div className="bg-[#3a3b3c] rounded-full p-3 hover:bg-[#4a4b4d]">
            <FontAwesomeIcon
              icon={faFacebookMessenger}
              className="w-4 text-white"
            />
          </div>
          <div className="bg-[#3a3b3c] rounded-full p-3 hover:bg-[#4a4b4d]">
            <FontAwesomeIcon icon={faBell} className="w-4 text-white" />
          </div>
          <div>
            {userHasLogin ? (
              <div
                className={`flex gap-3 items-center cursor-pointer`}
                onClick={() => setFooterUser(!footerUser)}
              >
                <img
                  src={isUser?.avatar}
                  width={45}
                  className="rounded-full"
                  alt="User Avatar"
                />
              </div>
            ) : (
              ""
            )}
            <div
              className={`flex flex-col absolute top-14 right-3 bg-white text-black ${
                footerUser ? "block" : "hidden"
              } rounded shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-50`}
            >
              <Link
                className="hover:bg-blue-400 p-2 rounded hover:text-white"
                href="/profile"
              >
                <i className="fa-solid fa-user"></i> Thông tin cá nhân
              </Link>

              {isUser?.role === "Admin" && (
                <Link
                  className="hover:bg-blue-400 p-2 rounded hover:text-white"
                  href="/admin"
                >
                  <i className="fa-solid fa-toolbox"></i> Về admin
                </Link>
              )}
              <Link
                className="hover:bg-blue-400 p-2 rounded hover:text-white"
                href="/sign-in"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
