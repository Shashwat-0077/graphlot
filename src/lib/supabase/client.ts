"use client";

import { createBrowserClient } from "@supabase/ssr";

// TODO : Remove this shitty ass auth from the app

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
