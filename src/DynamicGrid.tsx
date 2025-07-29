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
import { notifications } from '@mantine/notifications';
import React from 'react';
import { IconCheck, IconX, IconDotsVertical, IconArrowsSort } from '@tabler/icons-react';

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

export default function DynamicGrid({
  baseUrl,
  endpoint,
  columnSettings,
  enableEdit = false,
  enableCheckbox = false,
  tokenRequired = false,
  pageSize = 10,
  enablePagination = true,
  actionColumnPosition = 'end',
  queryParams = {},
  onRowAction,
  onRowSelected,
  isMenuAction = false,
  tableSettings = {
    highlightOnHover: true,
    withTableBorder: true,
    withColumnBorders: true
  },
  footerSettings = {
    enabled: false,
    endpoint: '',
  },
  enableGrouping = false,
  groupSettings = [],
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
  const [footerData, setFooterData] = useState<any>(null);
  const [footerLoading, setFooterLoading] = useState(false);

  // Grouping helper functions
  const getColumnGroupInfo = (field: string) => {
    if (!enableGrouping || !groupSettings) return null;
    return groupSettings.find(group => group.fields.includes(field));
  };

  const isGroupedField = (field: string) => {
    return getColumnGroupInfo(field) !== null;
  };

  const getFilteredColumns = () => {
    return columnSettings.filter(setting => !isMenuAction || !setting.actions);
  };

  const getSortedColumns = () => {
    const filteredColumns = getFilteredColumns();
    
    if (actionColumnPosition === 'start') {
      // Action sütunlarını başa al
      const actionColumns = filteredColumns.filter(col => col.actions);
      const nonActionColumns = filteredColumns.filter(col => !col.actions);
      return [...actionColumns, ...nonActionColumns];
    }
    
    // Default: action sütunları sonda
    return filteredColumns;
  };

  const isActionVisible = (action: ActionButton, row: any) => {
    // showField kontrolü: eğer showField varsa ve değeri true değilse gizle
    if (action.showField) {
      const showValue = getNestedValue(row, action.showField);
      if (!showValue) return false;
    }

    // hideField kontrolü: eğer hideField varsa ve değeri true ise gizle
    if (action.hideField) {
      const hideValue = getNestedValue(row, action.hideField);
      if (hideValue) return false;
    }

    return true;
  };

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
      if (enablePagination) {
        params.append('page', currentPage.toString());
        params.append('page_size', pageSize.toString());
      }

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
      setTotalPages( result.total_pages || result.page || 1);

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

  const fetchFooterData = async () => {
    if (!footerSettings?.enabled || !footerSettings.endpoint) return;

    try {
      setFooterLoading(true);
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
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, value);
      });

      const response = await fetch(`${baseUrl}${footerSettings.endpoint}?${params.toString()}`, {
        method: 'GET',
        headers
      });

      const result = await response.json();
      setFooterData(result);

    } catch (error) {
      console.error('Footer fetch error:', error);
      setFooterData(null);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch footer data',
        color: 'red',
      });
    } finally {
      setFooterLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchFooterData();
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
      if (!acc) return '';

      if (Array.isArray(acc)) {
        return acc.map(item => item[part]).filter(Boolean).join(', ');
      }

      return acc[part] !== undefined ? acc[part] : '';
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
        return value ? new Date(value).toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) : '';
      case 'datetime':
        if (!value) return '';
        
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) return value;

          const utcDay = date.getUTCDate().toString().padStart(2, '0');
          const utcMonth = (date.getUTCMonth() + 1).toString().padStart(2, '0');
          const utcYear = date.getUTCFullYear();
          const utcHours = date.getUTCHours().toString().padStart(2, '0');
          const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');
          
          return `${utcDay}.${utcMonth}.${utcYear} ${utcHours}:${utcMinutes}`;
        } catch {
          return value;
        }
      case 'datetimez':
        return value ? new Date(value).toLocaleString('tr-TR', {
          timeZone: 'Europe/Istanbul',
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
          {(() => {
            const tableComponent = (
              <Table
                highlightOnHover={tableSettings.highlightOnHover}
                withTableBorder={tableSettings.withTableBorder}
                withColumnBorders={tableSettings.withColumnBorders}
                stickyHeader={tableSettings.stickyHeader}
                stickyHeaderOffset={tableSettings.stickyHeaderOffset}
              >
                <Table.Thead>
                  {enableGrouping && groupSettings && groupSettings.length > 0 && (
                    <Table.Tr>
                      {enableCheckbox && <Table.Th></Table.Th>}
                      {(() => {
                        const filteredColumns = getSortedColumns();
                        const renderedGroups = new Set();
                        const elements = [];

                        for (let i = 0; i < filteredColumns.length; i++) {
                          const setting = filteredColumns[i];
                          const groupInfo = getColumnGroupInfo(setting.field);

                          if (groupInfo && !renderedGroups.has(groupInfo.id)) {
                            // Grup başlığı
                            renderedGroups.add(groupInfo.id);
                            elements.push(
                              <Table.Th
                                key={groupInfo.id}
                                colSpan={groupInfo.fields.length}
                                style={{
                                  textAlign: 'center',
                                  ...groupInfo.style
                                }}
                              >
                                {groupInfo.title}
                              </Table.Th>
                            );
                          } else if (!groupInfo) {
                            // Gruplanmayan sütun için boş hücre
                            elements.push(
                              <Table.Th
                                key={setting.field}
                                title={setting.description}
                                style={{
                                  cursor: setting.description ? 'pointer' : 'default'
                                }}
                              ></Table.Th>
                            );
                          }
                        }

                        return elements;
                      })()}
                      {isMenuAction && <Table.Th></Table.Th>}
                    </Table.Tr>
                  )}

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
                    {getSortedColumns().map((setting) => (
                      <Table.Th
                        key={setting.field}
                        onClick={() =>
                          setting.sortable ? handleSort(setting.field) : undefined
                        }
                        title={setting.description}
                        style={{
                          cursor: 'default',
                          width: setting.width || 'auto',
                          minWidth: setting.width || 'auto',
                          maxWidth: setting.width || 'auto'
                        }}
                      >
                        <Group
                          gap="xs"
                          wrap="nowrap"
                          justify="space-between"
                          align="flex-start"
                        >
                          <Text
                            fw={600}
                            size="sm"
                            c="black"
                            style={{
                              letterSpacing: '0.5px',
                              fontSize: '12px',
                              whiteSpace: 'normal',
                              wordBreak: 'normal',
                              lineHeight: 1.2,
                              flex: 1
                            }}
                          >
                            {setting.title}
                          </Text>
                          {setting.sortable && (
                            sortField === setting.field ? (
                              <Text
                                size="sm"
                                fw={700}
                                style={{
                                  minWidth: '16px',
                                  color: 'var(--mantine-primary-color-6)',
                                  flexShrink: 0
                                }}
                              >
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </Text>
                            ) : (
                              <IconArrowsSort
                                size={16}
                                style={{
                                  opacity: 0.5,
                                  minWidth: '16px',
                                  minHeight: '16px',
                                  flexShrink: 0
                                }}
                              />
                            )
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
                      {getSortedColumns().map((setting) => (
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
                                {setting.actions
                                  .filter(action => isActionVisible(action, row))
                                  .map((action, actionIndex) => (
                                  <Button
                                    key={actionIndex}
                                    size={action.size || 'xs'}
                                    variant={action.variant || 'filled'}
                                    disabled={action.disabled}
                                    color={action.color}
                                    leftSection={action.icon}
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
                                setting.actions
                                  ?.filter(action => isActionVisible(action, row))
                                  ?.map((action, actionIndex) => (
                                  <Menu.Item
                                    key={actionIndex}
                                    leftSection={action.icon}
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
                {footerSettings?.enabled && footerData && (
                  <Table.Tfoot>
                    <Table.Tr style={footerSettings.style}>
                      {enableCheckbox && <Table.Td></Table.Td>}
                      {getSortedColumns().map((setting) => (
                        <Table.Td key={setting.field}>
                          {footerData[setting.field] !== undefined ?
                            formatValue(footerData, setting) : ''
                          }
                        </Table.Td>
                      ))}
                      {isMenuAction && <Table.Td></Table.Td>}
                    </Table.Tr>
                  </Table.Tfoot>
                )}
              </Table>
            );

            return tableSettings.horizontalScroll && tableSettings.minWidth ? (
              <Table.ScrollContainer minWidth={tableSettings.minWidth}>
                {tableComponent}
              </Table.ScrollContainer>
            ) : tableComponent;
          })()}
        </Box>

        {enablePagination && (
          <Group justify="center" mt="md" mb="md">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
            />
          </Group>
        )}
      </Box>
    </MantineProvider>
  );
}