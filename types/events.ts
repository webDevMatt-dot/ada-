
export interface NationalEvent {
    id: number;
    title: string;
    category?: string;
    start_date: string;
    end_date?: string;
    location?: string;
    description?: string;
    is_national?: boolean;
}
