"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/SideBar'
import Header from '../components/Header'
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function page() {
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

            </div>
        </div>
    )
}
