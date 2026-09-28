import React from "react";
import { useDispatch } from "react-redux";
import authService from '../../appwrite/auth'
import { logout } from "../../store/authSlice";
import toast from "react-hot-toast";

function LogoutBtn({ className = "" }){
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout()
            .then(() => {
                dispatch(logout())
                toast.success("Logged out successfully");
            })
            .catch((err) => {
                console.error("Logout error:", err);
                toast.error("Failed to log out");
            });
    }
    return(
    <button className={`inline-block rounded-full border border-white/15 bg-white/5 px-6 py-2 text-sm font-semibold text-slate-200 duration-300 hover:border-rose-300/60 hover:bg-rose-400/15 hover:text-white ${className}`}   
    onClick={logoutHandler}
    >Logout
    </button>
    )
}

export default LogoutBtn