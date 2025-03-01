import { toast } from "sonner";

export const copyLink = (link:string | null) => {
    if (link) {
        navigator.clipboard.writeText(link);
        toast.success("Link Copied");
    }
}