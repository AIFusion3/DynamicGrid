import React from 'react';
interface ActionButton {
    label: string;
    icon?: React.ReactElement;
    name: string;
    variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'transparent' | 'white' | 'gradient';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    color?: string;
    showField?: string;
    hideField?: string;
}
interface ChipCondition {
    field?: string;
    value?: any;
    trueColor?: string;
    falseColor?: string;
    trueLabel?: string;
    falseLabel?: string;
}
export interface ColumnGroup {
    id: string;
    title: string;
    fields: string[];
    style?: React.CSSProperties;
}
export interface ColumnSetting {
    field: string;
    title: string;
    description?: string;
    width?: string | number;
    sortable?: boolean;
    editable?: boolean;
    editField?: string;
    displayType?: 'text' | 'date' | 'datetime' | 'datetimez' | 'number' | 'money' | 'image' | 'link' | 'chip';
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
    enablePagination?: boolean;
    actionColumnPosition?: 'start' | 'end';
    queryParams?: Record<string, string>;
    onRowAction?: (actionName: string, rowData: any) => void;
    onRowSelected?: (selectedRows: any[]) => void;
    isMenuAction?: boolean;
    tableSettings?: {
        highlightOnHover?: boolean;
        withTableBorder?: boolean;
        withColumnBorders?: boolean;
        stickyHeader?: boolean;
        stickyHeaderOffset?: number;
        horizontalScroll?: boolean;
        minWidth?: number;
    };
    footerSettings?: {
        enabled: boolean;
        endpoint: string;
        style?: React.CSSProperties;
    };
    enableGrouping?: boolean;
    groupSettings?: ColumnGroup[];
}
export default function DynamicGrid({ baseUrl, endpoint, columnSettings, enableEdit, enableCheckbox, tokenRequired, pageSize, enablePagination, actionColumnPosition, queryParams, onRowAction, onRowSelected, isMenuAction, tableSettings, footerSettings, enableGrouping, groupSettings, }: DynamicGridProps): React.JSX.Element;
export {};
