"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faUser, faUsers, faChartPie } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import Card from "./components/Card";
import { usePathname, useRouter } from "next/navigation";

export default function Home() {
  const pathName = usePathname()
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("userHasLogin");
    router.push("/admin/sign-in");
  };
  return (
    <div className="flex">
      <Sidebar logout={() => handleLogout()} />
      <div className="flex-1 p-6 bg-gray-100">
        <Header />
        {
          pathName === "/admin" ? (
            <div className="grid grid-cols-4 gap-6 mt-6">
              <Card
                icon={<FontAwesomeIcon icon={faChartLine} />}
                title="New Posts"
                value="50,000"
                description="+55% than yesterday"
                trend={55}
              />
              <Card
                icon={<FontAwesomeIcon icon={faUser} />}
                title="Today's Users"
                value="2,300"
                description="+3% than last month"
                trend={3}
              />
              <Card
                icon={<FontAwesomeIcon icon={faUsers} />}
                title="New Users"
                value="3,462"
                description="-2% than last month"
                trend={-2}
              />
              <Card
                icon={<FontAwesomeIcon icon={faChartPie} />}
                title="New Groups"
                value="430"
                description="+5% than yesterday"
                trend={5}
              />
            </div>
          ) : ''
        }
      </div>
    </div>
  );
}
