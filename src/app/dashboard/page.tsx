import React from "react";

import { createClient } from "@/utils/supabase/server";

export default async function Dashboard() {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    return <div>{JSON.stringify(user)}</div>;
}
