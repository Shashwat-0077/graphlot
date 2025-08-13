import { Loader2 } from "lucide-react";

export function SimpleLoader() {
    return (
        <div className="flex items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
    );
}
