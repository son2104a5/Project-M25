"use client"
import Header from "@/components/Header";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function page() {
  const [users, setUsers] = useState<User[]>([]);
  const [openFormEdit, setOpenFormEdit] = useState(false)
  const userHasLogin =
    JSON.parse(localStorage.getItem("userHasLogin") as string) || undefined;
  const isUser: any = users?.find((user: any) => user.email === userHasLogin);

  useEffect(() => {
    axios
      .get("http://localhost:8080/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <Header></Header>
      <div className="flex min-h-screen h-auto bg-[#18191a] text-white flex-col items-center">
        <div className="w-full flex flex-col items-center bg-gradient-to-b from-[#ffffff] to-[#1f1f1f]">
          {/* Cover Photo */}
          <div className="relative w-3/5 h-48 mb-[50px]">
            <img
              src={isUser?.banner}
              alt="Cover"
              className="w-full h-[250px] object-cover"
            />
          </div>

          {/* Profile Picture and Info */}
          <div className="relative flex flex-col items-center -mt-14">
            <div className="w-36 h-36 bg-gray-600 rounded-full border-4 border-gray-900 overflow-hidden">
              <img
                src={isUser?.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="mt-4 text-2xl font-bold">{isUser?.name}</h1>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Thêm vào tin</button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded" onClick={()=>setOpenFormEdit(true)}>Chỉnh sửa trang cá nhân</button>
            <button className="bg-gray-800 text-white px-4 py-2 rounded">
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>
          {/* Profile Navigation Tabs */}
          <div className="mt-4 border-t border-gray-700 w-full flex justify-center">
            <div className="flex space-x-6 my-3">
              <a href="#" className="text-blue-500 border-b-2 border-blue-500 pb-1">Bài viết</a>
              <a href="#" className="text-gray-400 hover:text-white">Giới thiệu</a>
              <a href="#" className="text-gray-400 hover:text-white">Bạn bè</a>
              <a href="#" className="text-gray-400 hover:text-white">Ảnh</a>
              <a href="#" className="text-gray-400 hover:text-white">Video</a>
              <a href="#" className="text-gray-400 hover:text-white">Check in</a>
              <a href="#" className="text-gray-400 hover:text-white">Xem thêm</a>
            </div>
          </div>
        </div>


        {/* Edit Profile Modal */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${openFormEdit ? 'block' : 'hidden'}`}>
          <div className="bg-[#242526] w-[400px] p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-4">
              <h2 className="text-xl font-bold text-white">Chỉnh sửa trang cá nhân</h2>
              <button className="text-white hover:text-gray-400" onClick={()=>setOpenFormEdit(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {/* Profile Picture Section */}
              <div>
                <div className="flex justify-between">
                  <h3 className="text-gray-400">Ảnh đại diện</h3>
                  <button className="ml-4 text-blue-500 hover:underline">Chỉnh sửa</button>
                </div>
                <div className="w-20 h-20 bg-gray-600 rounded-full overflow-hidden ml-[140px] mt-3">
                  <img
                    src={isUser?.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Cover Photo Section */}
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-400">Ảnh bìa</h3>
                  <button className="text-blue-500 hover:underline">Chỉnh sửa</button>
                </div>
                <div className="mt-2">
                  <div className="w-full h-24 bg-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={isUser?.banner}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
