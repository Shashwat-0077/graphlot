import { useQuery } from "@tanstack/react-query";

import { auth } from "@/modules/auth";

const useSession = () => {
    const { data, status } = useQuery({
        queryKey: ["session"],
        queryFn: async () => {
            const res = await auth();

            return {
                user: {
                    name: res?.user?.name ?? undefined,
                    email: res?.user?.email ?? undefined,
                    image: res?.user?.image ?? undefined,
                },
                accessToken: res?.accessToken ?? undefined,
                expires: res?.expires ?? undefined,
            };
        },
        staleTime: 5 * (60 * 1000),
        gcTime: 10 * (60 * 1000),
        refetchOnWindowFocus: true,
    });
    return { session: data, status };
};

export default useSession;
