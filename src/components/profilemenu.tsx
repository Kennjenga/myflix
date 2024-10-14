import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfileMenu = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
      <div className="py-1">
        <Link
          href="/dashboard"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300"
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
