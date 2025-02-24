'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TextInput,
  Group,
  Text,
  ActionIcon,
  Box,
  LoadingOverlay,
  Pagination,
  Button,
  MantineProvider,
  Checkbox,
  Menu,
} from '@mantine/core';
import * as TablerIcons from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import React from 'react';
import { IconCheck, IconX, IconDotsVertical } from '@tabler/icons-react';

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
  isMenuAction?: boolean;
  tableSettings?: {
    highlightOnHover?: boolean;
    withTableBorder?: boolean; 
    withColumnBorders?: boolean;
  };
}

export default function DynamicGrid({
  baseUrl,
  endpoint,
  columnSettings,
  enableEdit = false,
  enableCheckbox = false,
  tokenRequired = false,
  pageSize = 10,
  queryParams = {},
  onRowAction,
  onRowSelected,
  isMenuAction = false,
  tableSettings = {
    highlightOnHover: true,
    withTableBorder: true,
    withColumnBorders: true
  },
}: DynamicGridProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    field: string;
    value: any;
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
  
      if (tokenRequired) {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
  
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('page_size', pageSize.toString());
      
      if (sortField) {
        params.append('sort_field', sortField);
        params.append('sort_direction', sortDirection);
      }

      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, value);
      });
  
      const response = await fetch(`${baseUrl}${endpoint}?${params.toString()}`, {
        method: 'GET',
        headers
      });
  
      const result = await response.json();
      
      setData(result.data);
      setTotalPages(result.total);
  
    } catch (error) {
      console.error('Fetch error:', error);
      setData([]);
      setTotalPages(0);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch data',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, sortField, sortDirection, JSON.stringify(queryParams)]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : '';
    }, obj);
  };

  const formatValue = (row: any, setting: ColumnSetting) => {
    if (!row) return '';
  
    const formatText = (text: string) => {
      try {
        const regex = /\{([^}]+)\}/g;
        const matches = text.match(regex);
        
        if (!matches) return text;
        
        let result = text;
        matches.forEach(match => {
          const key = match.slice(1, -1);
          result = result.replace(match, getNestedValue(row, key) || '');
        });
        
        return result;
      } catch {
        return text;
      }
    };
  
    if (setting.format) {
      return formatText(setting.format);
    }
  
    const value = getNestedValue(row, setting.field);
    
    switch (setting.displayType) {
      case 'date':
        return value ? new Date(value).toLocaleString('tr-TR', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : '';
      case 'number':
        return value ? Number(value).toLocaleString() : '';
      case 'money':
        return value ? Number(value).toLocaleString('tr-TR', {
          style: 'currency',
          currency: 'TRY',
        }) : '';
      case 'image':
        return value ? <img src={value} alt="" style={{ maxHeight: '50px', ...setting.imageStyle }} /> : '';
      case 'link':
        const href = setting.url ? formatText(setting.url) : value;
        return <a href={href} target={setting.target || '_self'} style={setting.linkStyle} rel="noopener noreferrer">{value}</a>;
      case 'chip':
        if (!setting.chipCondition) return value;
        
        const checkField = setting.chipCondition.field || setting.field;
        const checkValue = setting.chipCondition.value ?? true;
        const isTrue = getNestedValue(row, checkField) === checkValue;
        
        const color = isTrue ? 
          (setting.chipCondition.trueColor || 'green') : 
          (setting.chipCondition.falseColor || 'red');
        
        const label = isTrue ? 
          (setting.chipCondition.trueLabel || value) : 
          (setting.chipCondition.falseLabel || value);

        return (
          <Box
            style={{
              backgroundColor: `var(--mantine-color-${color}-1)`,
              color: `var(--mantine-color-${color}-filled)`,
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            {label}
          </Box>
        );
      default:
        return value || '';
    }
  };

  const handleCellDoubleClick = (rowIndex: number, field: string, value: any) => {
    if (!enableEdit) return;

    const setting = columnSettings.find((s) => s.field === field);
    if (!setting?.editable) return;

    setEditingCell({ rowIndex, field, value });
  };

  const handleEditSave = async () => {
    if (!editingCell) return;

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (tokenRequired) {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const setting = columnSettings.find((s) => s.field === editingCell.field);
      const updateField = setting?.editField || setting?.field;

      await fetch(`${baseUrl}${endpoint}/${data[editingCell.rowIndex].id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ [updateField as string]: editingCell.value }),
      });

      const newData = [...data];
      newData[editingCell.rowIndex] = {
        ...newData[editingCell.rowIndex],
        [editingCell.field]: editingCell.value,
      };
      setData(newData);
      setEditingCell(null);

      notifications.show({
        title: 'Success',
        message: 'Updated successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update',
        color: 'red',
      });
    }
  };

  const handleRowSelect = (row: any, checked: boolean) => {
    const newSelectedRows = checked 
      ? [...selectedRows, row]
      : selectedRows.filter(r => r.id !== row.id);
    
    setSelectedRows(newSelectedRows);
    onRowSelected?.(newSelectedRows);
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (TablerIcons as any)[`Icon${iconName}`];
    return IconComponent ? <IconComponent size={16} /> : null;
  };

  return (
    <MantineProvider>
      <Box 
        pos="relative" 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 'inherit'
        }}
      >
        <LoadingOverlay visible={loading} />
        <Box style={{ flex: 1 }}>
          <Table 
            highlightOnHover={tableSettings.highlightOnHover}
            withTableBorder={tableSettings.withTableBorder}
            withColumnBorders={tableSettings.withColumnBorders}
          >
            <Table.Thead>
              <Table.Tr>
                {enableCheckbox && (
                  <Table.Th style={{ width: '40px' }}>
                    <Checkbox
                      checked={selectedRows.length === data.length}
                      indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                      onChange={(e) => {
                        const newSelectedRows = e.currentTarget.checked ? [...data] : [];
                        setSelectedRows(newSelectedRows);
                        onRowSelected?.(newSelectedRows);
                      }}
                    />
                  </Table.Th>
                )}
                {columnSettings.map((setting) => (
                  <Table.Th
                    key={setting.field}
                    onClick={() =>
                      setting.sortable ? handleSort(setting.field) : undefined
                    }
                    style={{ 
                      cursor: setting.sortable ? 'pointer' : 'default',
                      width: setting.width || 'auto'
                    }}
                  >
                    <Group gap="xs">
                      <>{setting.title}</>
                      {sortField === setting.field && (
                        <Text>{sortDirection === 'asc' ? '↑' : '↓'}</Text>
                      )}
                    </Group>
                  </Table.Th>
                ))}
                {isMenuAction && <Table.Th style={{ width: '50px' }}></Table.Th>}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row, rowIndex) => (
                <Table.Tr key={row.id || rowIndex}>
                  {enableCheckbox && (
                    <Table.Td>
                      <Checkbox
                        checked={selectedRows.some(r => r.id === row.id)}
                        onChange={(e) => handleRowSelect(row, e.currentTarget.checked)}
                      />
                    </Table.Td>
                  )}
                  {columnSettings.map((setting) => (
                    <Table.Td
                      key={setting.field}
                      onDoubleClick={() =>
                        handleCellDoubleClick(
                          rowIndex,
                          setting.field,
                          row[setting.field]
                        )
                      }
                    >
                      {setting.actions && !isMenuAction ? (
                        <Group gap="xs">
                          {setting.actions.map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              size={action.size || 'xs'}
                              variant={action.variant || 'filled'}
                              disabled={action.disabled}
                              color={action.color}
                              leftSection={getIcon(action.icon)}
                              onClick={() => onRowAction?.(action.name, row)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </Group>
                      ) : editingCell?.rowIndex === rowIndex &&
                        editingCell?.field === setting.field ? (
                        <Group>
                          <TextInput
                            value={editingCell.value}
                            onChange={(e) =>
                              setEditingCell({
                                ...editingCell,
                                value: e.target.value,
                              })
                            }
                          />
                          <ActionIcon
                            color="green"
                            variant="subtle"
                            onClick={handleEditSave}
                          >
                            <IconCheck size={16} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => setEditingCell(null)}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                        </Group>
                      ) : (
                        formatValue(row, setting)
                      )}
                    </Table.Td>
                  ))}
                  {isMenuAction && (
                    <Table.Td>
                      <Menu>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          {columnSettings.map(setting => 
                            setting.actions?.map((action, actionIndex) => (
                              <Menu.Item
                                key={actionIndex}
                                leftSection={getIcon(action.icon)}
                                disabled={action.disabled}
                                color={action.color}
                                onClick={() => onRowAction?.(action.name, row)}
                              >
                                {action.label}
                              </Menu.Item>
                            ))
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  )}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>

       
       
      </Box>
    </MantineProvider>
  );
}