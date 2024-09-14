"use client";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Header from "@/components/Header";
import {
  faComment,
  faEarthAmericas,
  faImages,
  faLock,
  faPen,
  faShare,
  faThumbsUp,
  faUserGroup,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";
import { v4 } from "uuid";

const date = new Date();

function timeSince(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return `${interval} năm trước`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} tháng trước`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} ngày trước`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} giờ trước`;
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} phút trước`;
  }

  return `${Math.floor(seconds)} giây trước`;
}

export default function Page() {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<any>([]);
  const [visibility, setVisibility] = useState("public");
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [comments, setComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [mediaURLs, setMediaURLs] = useState<any>([]);

  useEffect(() => {
    if (!userHasLogin) {
      router.push("/sign-in");
    }
  }, []);

  const userHasLogin =
    JSON.parse(localStorage.getItem("userHasLogin") as string) || undefined;
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

  useEffect(() => {
    axios
      .get("http://localhost:8080/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/comments")
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  }, []);

  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleContentChange = (e: any) => setContent(e.target.value);

  const handleMediaChange = (e: any) => {
    const files = Array.from(e.target.files);
    const newMediaFiles = files.map((file: any) => {
      return {
        file,
        preview: URL.createObjectURL(file), // Local preview URL
        type: file.type.startsWith("image/") ? "image" : "video",
      };
    });
    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  const handleVisibilityChange = (e: any) => setVisibility(e.target.value);

  const handleSubmit = async (e: any) => {
    console.log(mediaFiles);
    
    if (mediaFiles === null) return;
  
    const uploadedMedia = await Promise.all(
      mediaFiles.map(async (mediaFile: any) => {
        const mediaRef = ref(
          storage,
          `${mediaFile.type}s/${mediaFile.file.name + v4()}`
        );
        await uploadBytes(mediaRef, mediaFile.file);
        const url = await getDownloadURL(mediaRef);
  
        return {
          url: url,
          type: mediaFile.type,
        };
      })
    );
  
    try {
      const currentTimestamp = Date.now();
      const newPost = {
        id: Math.floor(Math.random() * 1000000000),
        userId: isUser?.id,
        content: {
          text: content,
          media: uploadedMedia,
        },
        createdAt: currentTimestamp,
        status: visibility,
        engagement: {
          shares: 0,
          comments: 0,
          reactions: {
            like: 0,
          },
        },
      };
  
      await axios.post("http://localhost:8080/posts", newPost);
  
      setPosts((prevPosts: any) => [newPost, ...prevPosts]);
      setOpenForm(false);
      setMediaFiles([]);
      setContent("");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  

  const removeMedia = (indexToRemove: any) => {
    setMediaFiles(
      mediaFiles.filter((_: any, index: any) => index !== indexToRemove)
    );
  };

  const toggleLike = (id: number) => {
    // Find the post in the state
    const post = posts.find((post) => post.id === id);
    if (!post) return;

    // Check if the post is liked
    const isPostLiked = likedPosts.includes(id);

    // Update the like count locally
    const updatedPost = {
        ...post,
        engagement: {
            ...post.engagement,
            reactions: {
                ...post.engagement.reactions,
                like: isPostLiked
                    ? post.engagement.reactions.like - 1
                    : post.engagement.reactions.like + 1,
            },
        },
    };

    // Update local state
    setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === id ? updatedPost : p))
    );

    // Update liked posts state
    setLikedPosts((prevLikedPosts) =>
        isPostLiked
            ? prevLikedPosts.filter((postId) => postId !== id)
            : [...prevLikedPosts, id]
    );

    // Send the updated like count to the server
    axios
        .put(`http://localhost:8080/posts?id=${id}`, updatedPost)
        .catch((err) => console.log(err));
};

  return (
    <div>
      <Header />
      <div
        className={`flex min-h-screen h-auto bg-[#18191a] text-white justify-between`}
      >
        {/* Sidebar */}
        <div className="w-1/4 ml-3 mt-3 sticky top-0">
          <div className="flex gap-3 w-full bg-[#18191a] p-2 cursor-pointer hover:bg-[#3a3b3c] rounded-md items-center">
            <img src={isUser?.avatar} width={35} className="rounded-full" />
            <span>{isUser?.name}</span>
          </div>
          <div className="flex gap-3 w-full bg-[#18191a] p-1 cursor-pointer h-[51px] items-center hover:bg-[#3a3b3c] rounded-md">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/friend.png?alt=media&token=7d1bae17-844d-4c1d-be0f-da0cc25c1786"
              width={40}
              className="pl-1"
              alt=""
            />
            <span>Bạn bè</span>
          </div>
          <div className="flex gap-3 w-full bg-[#18191a] p-1 cursor-pointer h-[51px] items-center hover:bg-[#3a3b3c] rounded-md">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/groups.png?alt=media&token=c8d71350-31de-4bbc-af16-934c0b104c12"
              alt=""
              width={40}
              className="pl-1"
            />
            <span>Nhóm</span>
          </div>
          <div className="flex gap-3 w-full bg-[#18191a] p-1 cursor-pointer h-[51px] items-center hover:bg-[#3a3b3c] rounded-md">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/video.png?alt=media&token=55931a8b-3026-418f-93c3-a2578c6eb986"
              alt=""
              width={40}
              className="pl-1"
            />
            <span>Video</span>
          </div>
          <div className="flex gap-3 w-full bg-[#18191a] p-1 cursor-pointer h-[51px] items-center hover:bg-[#3a3b3c] rounded-md">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/market.png?alt=media&token=c44b21fd-0add-4805-8e4f-b5a74a578cea"
              alt=""
              width={40}
              className="pl-1"
            />
            <span>Marketplace</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-5 w-2/5 mt-5">
          <div className="flex gap-1">
            <div className="w-[80px] h-[120px] bg text-center bg-blue-400 text-2xl rounded-2xl font-semibold cursor-pointer hover:bg-opacity-80">
              + Thêm story
            </div>
          </div>
          <div className="w-full bg-[#262626] h-auto p-2 rounded-lg">
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
          {sortedPosts?.map((post) => {
            if (
              post.status === "public" ||
              (post.status == "only-me" && post.userId === isUser.id)
            ) {
              return (
                <div key={post.id} className="w-full bg-[#262626] rounded-lg">
                  <div className="p-5 flex justify-between">
                    <div className="flex gap-3 items-center">
                      <img
                        src={isUser.avatar}
                        className="w-[50px] h-[50px] rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{isUser.name}</div>
                        <div className="text-sm text-gray-400">
                          {timeSince(post.createdAt)} -{" "}
                          {post.status === "public" ? (
                            <FontAwesomeIcon icon={faEarthAmericas} />
                          // ) : post.status === "friends" ? (
                            // <FontAwesomeIcon icon={faUserGroup} />
                          ) : post.status === "only-me" ? (
                            <FontAwesomeIcon icon={faLock} />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="font-bold cursor-pointer text-[#d2d2d2] w-[40px] h-[40px] text-center rounded-full text-[24px] hover:bg-[#4a4b4d] leading-6">
                        ...
                      </div>
                    </div>
                  </div>
                  <div className="pl-5 pb-3">{post.content.text}</div>
                  <div>
                    {post.content.media.length > 1 ? (
                      <Carousel
                        showThumbs={false}
                        infiniteLoop
                        useKeyboardArrows
                      >
                        {post.content.media.map((media, index) => (
                          <div key={index}>
                            {media.type === "image" ? (
                              <img
                                src={media.url}
                                className="w-full h-auto rounded-lg"
                              />
                            ) : (
                              <video
                                src={media.url}
                                controls
                                className="w-full h-auto rounded-lg"
                              />
                            )}
                          </div>
                        ))}
                      </Carousel>
                    ) : (
                      post.content.media.map((media, index) => (
                        <div key={index}>
                          {media.type === "image" ? (
                            <img
                              src={media.url}
                              className="w-full h-auto rounded-lg"
                            />
                          ) : (
                            <video
                              src={media.url}
                              controls
                              className="w-full h-auto rounded-lg"
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 ml-3 mr-3 border-b border-[#3a3b3c]">
                    {post.engagement.reactions.like !== 0 ? (
                      <div className="flex gap-1 items-center">
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/facebook-reactions.png?alt=media&token=a5093af4-3f1f-4942-a488-2de85a9872ba"
                          alt=""
                          width={25}
                        />{" "}
                        <p className="text-gray-400">
                          {post.engagement.reactions.like}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    {post.engagement.comments !== 0 ? (
                      <div className="flex gap-1 items-center">
                        <p className="text-gray-400">
                          {post.engagement.comments}
                        </p>
                        <FontAwesomeIcon
                          icon={faComment}
                          className="text-gray-400"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex pl-3 pr-3 pt-1 pb-1">
                    <div
                      className={`p-2 hover:bg-[#575757] w-[35%] text-center rounded-md cursor-pointer text-gray-400`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} /> <span>Thích</span>
                    </div>
                    <div className="text-gray-400 p-2 hover:bg-[#575757] w-[35%] text-center rounded-md cursor-pointer">
                      <FontAwesomeIcon icon={faComment} />{" "}
                      <span>Bình luận</span>
                    </div>
                    <div className="text-gray-400 p-2 hover:bg-[#575757] w-[35%] text-center rounded-md cursor-pointer">
                      <FontAwesomeIcon icon={faShare} /> <span>Chia sẻ</span>
                    </div>
                  </div>
                  <div className="border-b border-[#3a3b3c] ml-3 mr-3"></div>
                </div>
              );
            }
          })}
        </div>

        {/* Right Sidebar */}
        <div className="w-1/4 mr-3"></div>
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
            placeholder="Bạn đang nghĩ gì thế?"
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
