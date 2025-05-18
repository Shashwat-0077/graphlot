// useAuthSession.ts
import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback, useState, useEffect } from "react";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";

/**
 * Response from useAuthSession hook
 */
export interface AuthSessionResponse {
    // Core session data
    session: Session | null;
    // Auth status: 'loading' | 'authenticated' | 'unauthenticated'
    status: string;
    // User state
    isAuthenticated: boolean;
    isLoading: boolean;
    // Auth actions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    login: (options?: any) => Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logout: () => Promise<any>;
    refresh: () => Promise<void>;
    // Error state
    error: Error | null;
}

/**
 * Enhanced authentication hook wrapping NextAuth's useSession
 *
 * @param options.redirectTo - Path to redirect unauthenticated users to (set to '/' to redirect to home page)
 * @returns Enhanced session response with simplified interface
 */
export function useAuthSession({
    redirectTo = "/",
}: {
    redirectTo?: string;
} = {}): AuthSessionResponse {
    const router = useRouter();
    const path = usePathname();

    // Use the original useSession hook without NextAuth's built-in redirect
    const { data: sessionData, status, update } = useSession();

    // Custom redirect logic
    useEffect(() => {
        if (status === "unauthenticated" && path !== redirectTo) {
            router.push(redirectTo);
        }
    }, [status, redirectTo, router, path]);

    const [error, setError] = useState<Error | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Extended session with typed data
    const session = sessionData as Session | null;

    // Simplified auth status
    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading" || isRefreshing;

    // Enhanced login with error handling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const login = useCallback(async (options?: any) => {
        try {
            return await signIn(options);
        } catch (err) {
            const error =
                err instanceof Error ? err : new Error("Login failed");
            setError(error);
            throw error;
        }
    }, []);

    // Enhanced logout with error handling
    const logout = useCallback(async () => {
        try {
            return await signOut();
        } catch (err) {
            const error =
                err instanceof Error ? err : new Error("Logout failed");
            setError(error);
            throw error;
        }
    }, []);

    // Refresh session data
    const refresh = useCallback(async () => {
        try {
            setIsRefreshing(true);
            await update();
        } catch (err) {
            const error =
                err instanceof Error
                    ? err
                    : new Error("Failed to refresh session");
            setError(error);
            throw error;
        } finally {
            setIsRefreshing(false);
        }
    }, [update]);

    return {
        session,
        status,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refresh,
        error,
    };
}
