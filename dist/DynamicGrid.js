'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useEffect, useState } from 'react';
import { Table, TextInput, Group, Text, ActionIcon, Box, LoadingOverlay, Pagination, Button, MantineProvider, Checkbox, Menu, } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React from 'react';
import { IconCheck, IconX, IconDotsVertical, IconArrowsSort } from '@tabler/icons-react';
export default function DynamicGrid(_a) {
    var _this = this;
    var baseUrl = _a.baseUrl, endpoint = _a.endpoint, columnSettings = _a.columnSettings, _b = _a.enableEdit, enableEdit = _b === void 0 ? false : _b, _c = _a.enableCheckbox, enableCheckbox = _c === void 0 ? false : _c, _d = _a.tokenRequired, tokenRequired = _d === void 0 ? false : _d, _e = _a.pageSize, pageSize = _e === void 0 ? 10 : _e, _f = _a.enablePagination, enablePagination = _f === void 0 ? true : _f, _g = _a.actionColumnPosition, actionColumnPosition = _g === void 0 ? 'end' : _g, _h = _a.queryParams, queryParams = _h === void 0 ? {} : _h, onRowAction = _a.onRowAction, onRowSelected = _a.onRowSelected, _j = _a.isMenuAction, isMenuAction = _j === void 0 ? false : _j, _k = _a.tableSettings, tableSettings = _k === void 0 ? {
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: true
    } : _k, _l = _a.footerSettings, footerSettings = _l === void 0 ? {
        enabled: false,
        endpoint: '',
    } : _l, _m = _a.enableGrouping, enableGrouping = _m === void 0 ? false : _m, _o = _a.groupSettings, groupSettings = _o === void 0 ? [] : _o;
    var _p = useState([]), data = _p[0], setData = _p[1];
    var _q = useState(true), loading = _q[0], setLoading = _q[1];
    var _r = useState(null), sortField = _r[0], setSortField = _r[1];
    var _s = useState('asc'), sortDirection = _s[0], setSortDirection = _s[1];
    var _t = useState(1), currentPage = _t[0], setCurrentPage = _t[1];
    var _u = useState(1), totalPages = _u[0], setTotalPages = _u[1];
    var _v = useState(null), editingCell = _v[0], setEditingCell = _v[1];
    var _w = useState([]), selectedRows = _w[0], setSelectedRows = _w[1];
    var _x = useState(null), footerData = _x[0], setFooterData = _x[1];
    var _y = useState(false), footerLoading = _y[0], setFooterLoading = _y[1];
    // Grouping helper functions
    var getColumnGroupInfo = function (field) {
        if (!enableGrouping || !groupSettings)
            return null;
        return groupSettings.find(function (group) { return group.fields.includes(field); });
    };
    var isGroupedField = function (field) {
        return getColumnGroupInfo(field) !== null;
    };
    var getFilteredColumns = function () {
        return columnSettings.filter(function (setting) { return !isMenuAction || !setting.actions; });
    };
    var getSortedColumns = function () {
        var filteredColumns = getFilteredColumns();
        if (actionColumnPosition === 'start') {
            // Action sütunlarını başa al
            var actionColumns = filteredColumns.filter(function (col) { return col.actions; });
            var nonActionColumns = filteredColumns.filter(function (col) { return !col.actions; });
            return __spreadArray(__spreadArray([], actionColumns, true), nonActionColumns, true);
        }
        // Default: action sütunları sonda
        return filteredColumns;
    };
    var isActionVisible = function (action, row) {
        // showField kontrolü: eğer showField varsa ve değeri true değilse gizle
        if (action.showField) {
            var showValue = getNestedValue(row, action.showField);
            if (!showValue)
                return false;
        }
        // hideField kontrolü: eğer hideField varsa ve değeri true ise gizle
        if (action.hideField) {
            var hideValue = getNestedValue(row, action.hideField);
            if (hideValue)
                return false;
        }
        return true;
    };
    var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
        var headers, token, params_1, response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setLoading(true);
                    headers = {
                        'Content-Type': 'application/json',
                    };
                    if (tokenRequired) {
                        token = localStorage.getItem('token');
                        if (token) {
                            headers['Authorization'] = "Bearer ".concat(token);
                        }
                    }
                    params_1 = new URLSearchParams();
                    if (enablePagination) {
                        params_1.append('page', currentPage.toString());
                        params_1.append('page_size', pageSize.toString());
                    }
                    if (sortField) {
                        params_1.append('sort_field', sortField);
                        params_1.append('sort_direction', sortDirection);
                    }
                    Object.entries(queryParams).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        params_1.append(key, value);
                    });
                    return [4 /*yield*/, fetch("".concat(baseUrl).concat(endpoint, "?").concat(params_1.toString()), {
                            method: 'GET',
                            headers: headers
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    setData(result.data);
                    setTotalPages(result.total_pages || result.page || 1);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Fetch error:', error_1);
                    setData([]);
                    setTotalPages(0);
                    notifications.show({
                        title: 'Error',
                        message: 'Failed to fetch data',
                        color: 'red',
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var fetchFooterData = function () { return __awaiter(_this, void 0, void 0, function () {
        var headers, token, params_2, response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(footerSettings === null || footerSettings === void 0 ? void 0 : footerSettings.enabled) || !footerSettings.endpoint)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    setFooterLoading(true);
                    headers = {
                        'Content-Type': 'application/json',
                    };
                    if (tokenRequired) {
                        token = localStorage.getItem('token');
                        if (token) {
                            headers['Authorization'] = "Bearer ".concat(token);
                        }
                    }
                    params_2 = new URLSearchParams();
                    Object.entries(queryParams).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        params_2.append(key, value);
                    });
                    return [4 /*yield*/, fetch("".concat(baseUrl).concat(footerSettings.endpoint, "?").concat(params_2.toString()), {
                            method: 'GET',
                            headers: headers
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    setFooterData(result);
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error('Footer fetch error:', error_2);
                    setFooterData(null);
                    notifications.show({
                        title: 'Error',
                        message: 'Failed to fetch footer data',
                        color: 'red',
                    });
                    return [3 /*break*/, 6];
                case 5:
                    setFooterLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        fetchData();
        fetchFooterData();
    }, [currentPage, sortField, sortDirection, JSON.stringify(queryParams)]);
    var handleSort = function (field) {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };
    var getNestedValue = function (obj, path) {
        return path.split('.').reduce(function (acc, part) {
            if (!acc)
                return '';
            if (Array.isArray(acc)) {
                return acc.map(function (item) { return item[part]; }).filter(Boolean).join(', ');
            }
            return acc[part] !== undefined ? acc[part] : '';
        }, obj);
    };
    var formatValue = function (row, setting) {
        var _a;
        if (!row)
            return '';
        var formatText = function (text) {
            try {
                var regex = /\{([^}]+)\}/g;
                var matches = text.match(regex);
                if (!matches)
                    return text;
                var result_1 = text;
                matches.forEach(function (match) {
                    var key = match.slice(1, -1);
                    result_1 = result_1.replace(match, getNestedValue(row, key) || '');
                });
                return result_1;
            }
            catch (_a) {
                return text;
            }
        };
        if (setting.format) {
            return formatText(setting.format);
        }
        var value = getNestedValue(row, setting.field);
        switch (setting.displayType) {
            case 'date':
                return value ? new Date(value).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }) : '';
            case 'datetime':
                if (!value)
                    return '';
                try {
                    var date = new Date(value);
                    if (isNaN(date.getTime()))
                        return value;
                    var utcDay = date.getUTCDate().toString().padStart(2, '0');
                    var utcMonth = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                    var utcYear = date.getUTCFullYear();
                    var utcHours = date.getUTCHours().toString().padStart(2, '0');
                    var utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');
                    return "".concat(utcDay, ".").concat(utcMonth, ".").concat(utcYear, " ").concat(utcHours, ":").concat(utcMinutes);
                }
                catch (_b) {
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
                return value ? React.createElement("img", { src: value, alt: "", style: __assign({ maxHeight: '50px' }, setting.imageStyle) }) : '';
            case 'link':
                var href = setting.url ? formatText(setting.url) : value;
                return React.createElement("a", { href: href, target: setting.target || '_self', style: setting.linkStyle, rel: "noopener noreferrer" }, value);
            case 'chip':
                if (!setting.chipCondition)
                    return value;
                var checkField = setting.chipCondition.field || setting.field;
                var checkValue = (_a = setting.chipCondition.value) !== null && _a !== void 0 ? _a : true;
                var isTrue = getNestedValue(row, checkField) === checkValue;
                var color = isTrue ?
                    (setting.chipCondition.trueColor || 'green') :
                    (setting.chipCondition.falseColor || 'red');
                var label = isTrue ?
                    (setting.chipCondition.trueLabel || value) :
                    (setting.chipCondition.falseLabel || value);
                return (React.createElement(Box, { style: {
                        backgroundColor: "var(--mantine-color-".concat(color, "-1)"),
                        color: "var(--mantine-color-".concat(color, "-filled)"),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontSize: '12px',
                        fontWeight: 500
                    } }, label));
            default:
                return value || '';
        }
    };
    var handleCellDoubleClick = function (rowIndex, field, value) {
        if (!enableEdit)
            return;
        var setting = columnSettings.find(function (s) { return s.field === field; });
        if (!(setting === null || setting === void 0 ? void 0 : setting.editable))
            return;
        setEditingCell({ rowIndex: rowIndex, field: field, value: value });
    };
    var handleEditSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var headers, token, setting, updateField, newData, error_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!editingCell)
                        return [2 /*return*/];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    headers = {
                        'Content-Type': 'application/json',
                    };
                    if (tokenRequired) {
                        token = localStorage.getItem('token');
                        if (token) {
                            headers['Authorization'] = "Bearer ".concat(token);
                        }
                    }
                    setting = columnSettings.find(function (s) { return s.field === editingCell.field; });
                    updateField = (setting === null || setting === void 0 ? void 0 : setting.editField) || (setting === null || setting === void 0 ? void 0 : setting.field);
                    return [4 /*yield*/, fetch("".concat(baseUrl).concat(endpoint, "/").concat(data[editingCell.rowIndex].id), {
                            method: 'PATCH',
                            headers: headers,
                            body: JSON.stringify((_a = {}, _a[updateField] = editingCell.value, _a)),
                        })];
                case 2:
                    _c.sent();
                    newData = __spreadArray([], data, true);
                    newData[editingCell.rowIndex] = __assign(__assign({}, newData[editingCell.rowIndex]), (_b = {}, _b[editingCell.field] = editingCell.value, _b));
                    setData(newData);
                    setEditingCell(null);
                    notifications.show({
                        title: 'Success',
                        message: 'Updated successfully',
                        color: 'green',
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _c.sent();
                    notifications.show({
                        title: 'Error',
                        message: 'Failed to update',
                        color: 'red',
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleRowSelect = function (row, checked) {
        var newSelectedRows = checked
            ? __spreadArray(__spreadArray([], selectedRows, true), [row], false) : selectedRows.filter(function (r) { return r.id !== row.id; });
        setSelectedRows(newSelectedRows);
        onRowSelected === null || onRowSelected === void 0 ? void 0 : onRowSelected(newSelectedRows);
    };
    return (React.createElement(MantineProvider, null,
        React.createElement(Box, { pos: "relative", style: {
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 'inherit'
            } },
            React.createElement(LoadingOverlay, { visible: loading }),
            React.createElement(Box, { style: { flex: 1 } }, (function () {
                var tableComponent = (React.createElement(Table, { highlightOnHover: tableSettings.highlightOnHover, withTableBorder: tableSettings.withTableBorder, withColumnBorders: tableSettings.withColumnBorders, stickyHeader: tableSettings.stickyHeader, stickyHeaderOffset: tableSettings.stickyHeaderOffset },
                    React.createElement(Table.Thead, null,
                        enableGrouping && groupSettings && groupSettings.length > 0 && (React.createElement(Table.Tr, null,
                            enableCheckbox && React.createElement(Table.Th, null),
                            (function () {
                                var filteredColumns = getSortedColumns();
                                var renderedGroups = new Set();
                                var elements = [];
                                for (var i = 0; i < filteredColumns.length; i++) {
                                    var setting = filteredColumns[i];
                                    var groupInfo = getColumnGroupInfo(setting.field);
                                    if (groupInfo && !renderedGroups.has(groupInfo.id)) {
                                        // Grup başlığı
                                        renderedGroups.add(groupInfo.id);
                                        elements.push(React.createElement(Table.Th, { key: groupInfo.id, colSpan: groupInfo.fields.length, style: __assign({ textAlign: 'center' }, groupInfo.style) }, groupInfo.title));
                                    }
                                    else if (!groupInfo) {
                                        // Gruplanmayan sütun için boş hücre
                                        elements.push(React.createElement(Table.Th, { key: setting.field, title: setting.description, style: {
                                                cursor: setting.description ? 'pointer' : 'default'
                                            } }));
                                    }
                                }
                                return elements;
                            })(),
                            isMenuAction && React.createElement(Table.Th, null))),
                        React.createElement(Table.Tr, null,
                            enableCheckbox && (React.createElement(Table.Th, { style: { width: '40px' } },
                                React.createElement(Checkbox, { checked: selectedRows.length === data.length, indeterminate: selectedRows.length > 0 && selectedRows.length < data.length, onChange: function (e) {
                                        var newSelectedRows = e.currentTarget.checked ? __spreadArray([], data, true) : [];
                                        setSelectedRows(newSelectedRows);
                                        onRowSelected === null || onRowSelected === void 0 ? void 0 : onRowSelected(newSelectedRows);
                                    } }))),
                            getSortedColumns().map(function (setting) { return (React.createElement(Table.Th, { key: setting.field, onClick: function () {
                                    return setting.sortable ? handleSort(setting.field) : undefined;
                                }, title: setting.description, style: {
                                    cursor: 'default',
                                    width: setting.width || 'auto',
                                    minWidth: setting.width || 'auto',
                                    maxWidth: setting.width || 'auto'
                                } },
                                React.createElement(Group, { gap: "xs", wrap: "nowrap", justify: "space-between", align: "flex-start" },
                                    React.createElement(Text, { fw: 600, size: "sm", c: "black", style: {
                                            letterSpacing: '0.5px',
                                            fontSize: '12px',
                                            whiteSpace: 'normal',
                                            wordBreak: 'normal',
                                            lineHeight: 1.2,
                                            flex: 1
                                        } }, setting.title),
                                    setting.sortable && (sortField === setting.field ? (React.createElement(Text, { size: "sm", fw: 700, style: {
                                            minWidth: '16px',
                                            color: 'var(--mantine-primary-color-6)',
                                            flexShrink: 0
                                        } }, sortDirection === 'asc' ? '↑' : '↓')) : (React.createElement(IconArrowsSort, { size: 16, style: {
                                            opacity: 0.5,
                                            minWidth: '16px',
                                            minHeight: '16px',
                                            flexShrink: 0
                                        } })))))); }),
                            isMenuAction && React.createElement(Table.Th, { style: { width: '50px' } }))),
                    React.createElement(Table.Tbody, null, data.map(function (row, rowIndex) { return (React.createElement(Table.Tr, { key: row.id || rowIndex },
                        enableCheckbox && (React.createElement(Table.Td, null,
                            React.createElement(Checkbox, { checked: selectedRows.some(function (r) { return r.id === row.id; }), onChange: function (e) { return handleRowSelect(row, e.currentTarget.checked); } }))),
                        getSortedColumns().map(function (setting) { return (React.createElement(Table.Td, { key: setting.field, onDoubleClick: function () {
                                return handleCellDoubleClick(rowIndex, setting.field, row[setting.field]);
                            } }, setting.actions && !isMenuAction ? (React.createElement(Group, { gap: "xs" }, setting.actions
                            .filter(function (action) { return isActionVisible(action, row); })
                            .map(function (action, actionIndex) { return (React.createElement(Button, { key: actionIndex, size: action.size || 'xs', variant: action.variant || 'filled', disabled: action.disabled, color: action.color, leftSection: action.icon, onClick: function () { return onRowAction === null || onRowAction === void 0 ? void 0 : onRowAction(action.name, row); } }, action.label)); }))) : (editingCell === null || editingCell === void 0 ? void 0 : editingCell.rowIndex) === rowIndex &&
                            (editingCell === null || editingCell === void 0 ? void 0 : editingCell.field) === setting.field ? (React.createElement(Group, null,
                            React.createElement(TextInput, { value: editingCell.value, onChange: function (e) {
                                    return setEditingCell(__assign(__assign({}, editingCell), { value: e.target.value }));
                                } }),
                            React.createElement(ActionIcon, { color: "green", variant: "subtle", onClick: handleEditSave },
                                React.createElement(IconCheck, { size: 16 })),
                            React.createElement(ActionIcon, { color: "red", variant: "subtle", onClick: function () { return setEditingCell(null); } },
                                React.createElement(IconX, { size: 16 })))) : (formatValue(row, setting)))); }),
                        isMenuAction && (React.createElement(Table.Td, null,
                            React.createElement(Menu, null,
                                React.createElement(Menu.Target, null,
                                    React.createElement(ActionIcon, { variant: "subtle" },
                                        React.createElement(IconDotsVertical, { size: 16 }))),
                                React.createElement(Menu.Dropdown, null, columnSettings.map(function (setting) {
                                    var _a, _b;
                                    return (_b = (_a = setting.actions) === null || _a === void 0 ? void 0 : _a.filter(function (action) { return isActionVisible(action, row); })) === null || _b === void 0 ? void 0 : _b.map(function (action, actionIndex) { return (React.createElement(Menu.Item, { key: actionIndex, leftSection: action.icon, disabled: action.disabled, color: action.color, onClick: function () { return onRowAction === null || onRowAction === void 0 ? void 0 : onRowAction(action.name, row); } }, action.label)); });
                                }))))))); })),
                    (footerSettings === null || footerSettings === void 0 ? void 0 : footerSettings.enabled) && footerData && (React.createElement(Table.Tfoot, null,
                        React.createElement(Table.Tr, { style: footerSettings.style },
                            enableCheckbox && React.createElement(Table.Td, null),
                            getSortedColumns().map(function (setting) { return (React.createElement(Table.Td, { key: setting.field }, footerData[setting.field] !== undefined ?
                                formatValue(footerData, setting) : '')); }),
                            isMenuAction && React.createElement(Table.Td, null))))));
                return tableSettings.horizontalScroll && tableSettings.minWidth ? (React.createElement(Table.ScrollContainer, { minWidth: tableSettings.minWidth }, tableComponent)) : tableComponent;
            })()),
            enablePagination && (React.createElement(Group, { justify: "center", mt: "md", mb: "md" },
                React.createElement(Pagination, { value: currentPage, onChange: setCurrentPage, total: totalPages }))))));
}
