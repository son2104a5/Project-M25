"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faUsers, faComments, faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  return (
    <div className="h-screen bg-gray-800 text-white w-64 p-4">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
      <ul>
        <li className="mb-4">
          <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
          Dashboard
        </li>
        <li className="mb-4">
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          Users
        </li>
        <li className="mb-4">
          <FontAwesomeIcon icon={faComments} className="mr-2" />
          Comments
        </li>
        <li className="mb-4">
          <FontAwesomeIcon icon={faBell} className="mr-2" />
          Notifications
        </li>
        <li className="mt-auto">
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Sign Out
        </li>
      </ul>
    </div>
  );
}
