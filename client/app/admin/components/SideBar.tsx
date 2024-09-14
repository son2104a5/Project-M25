"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faComments,
  faSignOutAlt,
  faNewspaper,
  faAddressCard,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

type Props = {
  logout: () => void;
}

export default function Sidebar({ logout }: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-between h-screen bg-gray-800 text-white w-64 p-4">
      <div>
        <div className="flex gap-2 items-center font-semibold text-3xl mb-5">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/project-m2-4c29a.appspot.com/o/logo.png?alt=media&token=3812c421-0d50-4359-b716-c872b53405c4"
            alt=""
            width={70}
          />
          <span className="">ChimeIn</span>
        </div>
        <ul>
          <li className="mb-4 p-3 hover:bg-blue-400 rounded-md cursor-pointer" onClick={() => router.push('/admin')}>
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
            Dashboard
          </li>
          <li className="mb-4 p-3 hover:bg-blue-400 rounded-md cursor-pointer" onClick={() => router.push('/admin/users')}>
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            Users
          </li>
          <li className="mb-4 p-3 hover:bg-blue-400 rounded-md cursor-pointer" onClick={() => router.push('/admin/comments')}>
            <FontAwesomeIcon icon={faComments} className="mr-2" />
            Comments
          </li>
          <li className="mb-4 p-3 hover:bg-blue-400 rounded-md cursor-pointer" onClick={() => router.push('/admin/posts')}>
            <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
            Posts
          </li>
        </ul>
      </div>
      <div>
        <div className="flex gap-2 items-center font-semibold text-xl mb-5 border-b border-white">
          Account pages
        </div>
        <ul>
          <li className="mb-4 p-3 hover:bg-blue-400 rounded-md cursor-pointer" onClick={()=>router.push('/')}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" />
            Return
          </li>
          <li className="mb-4 p-3 hover:bg-blue-400 rounded-md cursor-pointer" onClick={()=>router.push('/admin/profile')}>
            <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
            Profile
          </li>
          <li className="mb-4 p-3 hover:bg-blue-400 rounded-md cursor-pointer" onClick={()=>logout()}>
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Sign Out
          </li>
        </ul>
      </div>
    </div>
  );
}
