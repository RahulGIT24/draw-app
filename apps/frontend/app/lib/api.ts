import { toast } from "sonner";
import { NextRouter } from "next/router";
import axios from "axios";

type Method = "get" | "post" | "put" | "delete"

export async function apiCall(router: NextRouter,method:Method,data?:any) {
    try {
        const headers = {
            authorization:localStorage.getItem("token")
        }

    } catch (error: any) {
        if (error.response?.status === 404) {
            toast.error("Invalid Room Id");
            router.push("/");
        }
        if (error.response?.status === 403) {
            localStorage.removeItem("token");
            router.push("/signin");
            toast.error("Session Expired");
        }
    }
}
