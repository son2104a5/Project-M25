"use client"
export default function Header() {
    return (
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg"
          />
          <button className="ml-4">
            <img
              src="/path-to-your-avatar.jpg"
              alt="User Avatar"
              className="h-10 w-10 rounded-full"
            />
          </button>
        </div>
      </header>
    );
  }
  