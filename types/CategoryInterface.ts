export interface Category {
    id: string;
    user_id: string;
    name: string;
    type: 'expense' | 'income';
    is_default: boolean;
    icon?: string;
    color?: string;
    updated_at: Date;
}