"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  CreditCard,
  ArrowLeft,
  LogOut,
  Users,
  FileText,
  Layers,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/app/actions/auth";

import Profile from "./profile";
import EditProfile from "./editprofile";
import Subscriptions from "@/components/dashboard/subscriptions";
import AllUsers from "@/components/dashboard/all-users";
import UpdateContent from "./update-content";
import AllSubscriptions from "@/components/dashboard/all-subscriptions";

interface User {
  name: string;
  role: string;
  email: string;
  user_id: number;
  username: string;
  phone_number: string;
  firstname: string;
  lastname: string;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  component: React.ReactNode;
}

export const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeComponent, setActiveComponent] =
    React.useState<React.ReactNode | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const commonNavItems: NavItem[] = [
    { label: "Profile", icon: User, component: <Profile user={user} /> },
    {
      label: "Edit Profile",
      icon: Settings,
      component: <EditProfile user={user} />,
    },
    {
      label: "Subscriptions",
      icon: CreditCard,
      component: <Subscriptions user={user} />,
    },
  ];

  const adminNavItems: NavItem[] = [
    { label: "All Users", icon: Users, component: <AllUsers /> },
    { label: "Update Content", icon: FileText, component: <UpdateContent /> },
    {
      label: "All Subscriptions",
      icon: Layers,
      component: <AllSubscriptions />,
    },
  ];

  const navItems =
    user.role === "admin"
      ? [...commonNavItems, ...adminNavItems]
      : commonNavItems;

  const handleComponentChange = (component: React.ReactNode) => {
    setActiveComponent(component);
  };

  const Sidebar = () => (
    <ScrollArea className="h-full py-6 pl-4 pr-6">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start text-base font-normal"
            onClick={() => handleComponentChange(item.component)}
          >
            <item.icon className="mr-2 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="mt-28 text-black space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <button
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ease-in-out"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 border-r lg:block">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="flex items-center justify-between border-b p-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 text-black">
              <SheetHeader className="p-6 ">
                <SheetTitle>Dashboard Menu</SheetTitle>
              </SheetHeader>
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
        <div className="p-6">
          {activeComponent || (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Welcome, {user.username}!
              </h2>
              <p className="text-gray-600">
                Select an option from the sidebar to get started.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
