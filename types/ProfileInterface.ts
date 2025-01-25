export interface Profile = {
    user_id: string;
    username: string;
    email: string;
    created_at: Date;
    full_name?: string;
    avatar_url?: string;
    preferences?: Record<string, any>; // currency, isDecimalActive
    updated_at: Date;
};