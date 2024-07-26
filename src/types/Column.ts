export interface Column {
    id: string;
    label: string;
    align?: 'right' | 'left' | 'center';
    minWidth?: number;
    format?: (value: unknown|string|Date) => string;
}