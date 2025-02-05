import React from 'react';
interface ActionButton {
    label: string;
    icon?: string;
    name: string;
    variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'transparent' | 'white' | 'gradient';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    color?: string;
}
interface ChipCondition {
    field?: string;
    value?: any;
    trueColor?: string;
    falseColor?: string;
    trueLabel?: string;
    falseLabel?: string;
}
export interface ColumnSetting {
    field: string;
    title: string;
    width?: string | number;
    sortable?: boolean;
    editable?: boolean;
    editField?: string;
    displayType?: 'text' | 'date' | 'number' | 'money' | 'image' | 'link' | 'chip';
    format?: string;
    url?: string;
    target?: '_self' | '_blank' | '_parent' | '_top';
    imageStyle?: React.CSSProperties;
    linkStyle?: React.CSSProperties;
    chipCondition?: ChipCondition;
    actions?: ActionButton[];
}
interface DynamicGridProps {
    baseUrl: string;
    endpoint: string;
    columnSettings: ColumnSetting[];
    enableEdit?: boolean;
    enableCheckbox?: boolean;
    tokenRequired?: boolean;
    pageSize?: number;
    queryParams?: Record<string, string>;
    onRowAction?: (actionName: string, rowData: any) => void;
    onRowSelected?: (selectedRows: any[]) => void;
    tableSettings?: {
        highlightOnHover?: boolean;
        withTableBorder?: boolean;
        withColumnBorders?: boolean;
    };
}
export default function DynamicGrid({ baseUrl, endpoint, columnSettings, enableEdit, enableCheckbox, tokenRequired, pageSize, queryParams, onRowAction, onRowSelected, tableSettings, }: DynamicGridProps): React.JSX.Element;
export {};
