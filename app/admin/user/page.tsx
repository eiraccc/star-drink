'use client';
import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";

const AdminUserpage = () => {
    const fetchUsers = async () => {
        const { data, error } = await supabase
        .from('profiles')
        .select('user_id, user_name, email, role')
        .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>page</div>
    )
};

export default AdminUserpage;