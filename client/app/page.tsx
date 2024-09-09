"use client";
import Header from "@/components/Header";
import { faImages, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const date = new Date();

export default function Page() {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<any>([]);
  const [visibility, setVisibility] = useState("public");
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(true);

  useEffect(() => {
    if (!userHasLogin) {
      router.push("/sign-in");
    }
  }, []);

  const userHasLogin = JSON.parse(localStorage.getItem("userHasLogin") as string) || undefined;
  const isUser: any = users?.find((user: any) => user.email === userHasLogin);

  useEffect(() => {
    axios
      .get("http://localhost:8080/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/stories")
      .then((res) => setStories(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleContentChange = (e: any) => setContent(e.target.value);
  const handleMediaChange = (e: any) => {
    const files = Array.from(e.target.files);
    const newMediaFiles = files.map((file: any) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
    }));
    setMediaFiles((prevFiles: any) => [...prevFiles, ...newMediaFiles]);
  };
  const handleVisibilityChange = (e: any) => setVisibility(e.target.value);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios.post("http://localhost:8080/posts", {
      id: Math.floor(Math.random() * 1000000000),
      userId: isUser?.id,
      content: {
        text: content,
        media: [
          mediaFiles.map((item: any)=>{
            return {
              url: item.preview,
              type: item.type,
            }
          }),
        ],
      },
      createdAt: date.toISOString(),
      status: mediaFiles?.visibility,
      engagement: {
        shares: 0,
        reactions: {
          like: 0,
        },
      },
    });
    setOpenForm(false)
    setMediaFiles([])
  };
  const removeMedia = (indexToRemove: any) => {
    setMediaFiles(
      mediaFiles.filter((_: any, index: any) => index !== indexToRemove)
    );
  };

  return (
    <div>
      <Header />
      <div
        className={`flex min-h-screen h-auto bg-[#18191a] text-white justify-between`}
      >
        {/* Sidebar */}
        <div className="w-1/4"></div>

        {/* Main Content */}
        <div className="flex flex-col gap-5 w-1/2">
          <div>
            <div className="w-[80px] h-[120px] bg text-center bg-blue-400 text-2xl rounded-2xl font-semibold">
              + Thêm story
            </div>
          </div>
          <div className="w-full bg-[#262626] h-auto p-2 rounded">
            <div className="flex gap-3 items-center">
              <img src={isUser?.avatar} className="w-[50px] rounded-full" />
              <div
                className="bg-[#3a3b3c] p-2 rounded-3xl hover:opacity-80 text-[#cacaca] w-full"
                onClick={() => setOpenForm(true)}
              >
                Bạn đang nghĩ gì thế ?
              </div>
            </div>
          </div>
        </div>

        

        {/* Right Sidebar */}
        <div className="w-1/4"></div>
      </div>

      {/* Backdrop for Form */}
      {openForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40" />
      )}

      {/* Form */}
      <div
        className={`fixed top-6 items-center w-full h-screen text-white ${
          openForm ? "block" : "hidden"
        } z-50`}
      >
        <div className="bg-[#3a3b3c] border border-[#515253] rounded-lg p-4 max-w-lg mx-auto">
          <div className="flex justify-between pb-5 mb-5 items-center border-b border-[#636363]">
            <div></div>
            <div className="font-bold text-2xl pl-8">Tạo bài viết</div>
            <div
              className="cursor-pointer w-8 h-8 text-center bg-[#646464] rounded-full leading-8"
              onClick={() => setOpenForm(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img
                src={isUser?.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <span>{isUser?.name}</span>
            </div>
            <select
              value={visibility}
              onChange={handleVisibilityChange}
              className="border border-[#3a3b3c] rounded-lg p-2 bg-[#4e4e4e]"
            >
              <option value="public">Công khai</option>
              <option value="friends">Bạn bè</option>
              <option value="only-me">Chỉ mình tôi</option>
            </select>
          </div>
          <textarea
            placeholder="Nguyễn ơi, bạn đang nghĩ gì thế?"
            value={content}
            onChange={handleContentChange}
            className="w-full border border-[#616161] rounded-lg p-3 resize-none bg-[#3a3b3c]"
          />
          {/* Image previews */}
          <div className="bg-[#3a3b3c] border border-[#585858] rounded-lg p-4 max-w-lg mx-auto text-white">
            {mediaFiles.length > 0 && (
              <div className="relative bg-[#3a3b3c] rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="relative w-full h-64 overflow-y-auto scrollbar-custom">
                  {mediaFiles.map((media: any, index: any) => (
                    <div key={index} className="relative h-64 rounded-lg">
                      {media.type === "image" ? (
                        <img
                          src={media.preview}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={media.preview}
                          controls
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                      <button
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="absolute top-2 left-2 space-x-2">
                    <button className="bg-white text-black font-semibold py-1 px-3 rounded-lg shadow">
                      <FontAwesomeIcon icon={faPen} /> Chỉnh sửa
                    </button>
                    <label
                      htmlFor="image-upload"
                      className="bg-white text-black font-semibold py-1 px-3 rounded-lg shadow cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faImages} /> Thêm ảnh/video
                    </label>
                  </div>
                </div>
              </div>
            )}
            {!mediaFiles.length && (
              <div className="relative bg-[#525252] rounded-lg flex flex-col items-center justify-center hover:bg-opacity-70">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="w-full h-64 flex items-center justify-center rounded-lg flex-col">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-gray-400 mt-2 font-semibold">
                      Thêm ảnh/video
                    </span>
                    <span className="text-gray-500 text-xs font-semibold">
                      hoặc kéo và thả
                    </span>
                  </div>
                </label>
              </div>
            )}
            <input
              type="file"
              id="image-upload"
              className="hidden"
              onChange={handleMediaChange}
              multiple
            />
            <div className="mt-4 flex justify-between items-center border-t border-gray-600 pt-4">
              <div className="flex space-x-4">
                <button className="text-green-500">🏞</button>
                <button className="text-blue-500">👥</button>
                <button className="text-yellow-500">😊</button>
                <button className="text-red-500">📍</button>
                <button className="text-gray-500">GIF</button>
              </div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-3"
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
}
