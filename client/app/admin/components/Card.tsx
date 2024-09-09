"use client"
export default function Card({ icon, title, value, description, trend }: any) {
    return (
      <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-sm ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
            {description}
          </p>
        </div>
      </div>
    );
  }
  