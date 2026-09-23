import { NavLink, Link } from "react-router-dom";
import { FaBook, FaInfoCircle, FaPhoneAlt, FaSignInAlt } from "react-icons/fa";

const NavbarUserJobSeeker = () => {
  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition
     ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="w-full border-b px-8 py-4 flex items-center bg-white">
      {/* LEFT - LOGO */}
      <div className="flex-1">
        <Link to="/participant/home" className="text-xl font-bold flex items-center gap-2">
          📚 <span>IndoKerja.ID</span>
        </Link>
      </div>

      {/* CENTER - MENU */}
      <div className="flex gap-4 flex-1 justify-center">
        <NavLink to="/jobseeker/job-list" className={navClass}>
          <FaBook />
          Jobs
        </NavLink>

        <NavLink to="/jobseeker/application-history" className={navClass}>
          <FaInfoCircle />
          Application History
        </NavLink>
      </div>

      {/* RIGHT - LOGOUT */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={() => {
            console.log('BEFORE ', localStorage.getItem('token'));
            // 1. Hapus token dari localStorage
            localStorage.removeItem('token');
            // 2. (Opsional) Hapus data lain jika ada, misal: localStorage.removeItem('user')
            console.log('AFTER ', localStorage.getItem('token'));
            // 3. Pindahkan user ke halaman login
            window.location.href = '/jobseeker/login';
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition border hover:bg-gray-100 cursor-pointer"
        >
          <FaSignInAlt />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavbarUserJobSeeker;
