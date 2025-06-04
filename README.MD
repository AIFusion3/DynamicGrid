# DynamicGrid Component

DynamicGrid is a dynamic data table component developed using React and Mantine UI. It provides pagination, sorting, editing, and custom display options by fetching data from REST APIs.

## 🚀 Features

- ✨ Automatic REST API integration
- 📑 Pagination
- 🔄 Sorting
- ✏️ Inline editing
- ✅ Multiple selection
- 🎨 Customizable appearance
- 🔗 Custom link and image views
- 🏷️ Chip/Badge displays
- 🔒 Token-based authorization support

## 📦 Installation

```bash
npm install @mantine/core @mantine/hooks @tabler/icons-react
npm install git+https://github.com/AIFusion3/DynamicGrid.git
```

## 💻 Usage

```tsx
import DynamicGrid, { ColumnSetting } from 'dynamic-grid';
import { IconEdit, IconTrash } from '@tabler/icons-react';

const MyComponent = () => {
  const columnSettings = [
    {
      field: 'id',
      title: 'ID',
      sortable: true
    },
    {
      field: 'name',
      title: 'Name',
      sortable: true,
      editable: true
    },
    {
      field: 'createdAt',
      title: 'Created Date',
      displayType: 'date',
      sortable: true
    },
    {
      field: 'updatedAt',
      title: 'Last Update',
      displayType: 'datetime',
      sortable: true
    },
    {
      field: 'avatar',
      title: 'Profile',
      displayType: 'image',
      imageStyle: {
        borderRadius: '50%',
        width: '40px'
      }
    },
    {
      field: 'website',
      title: 'Website',
      displayType: 'link',
      target: '_blank'
    },
    {
      field: 'status',
      title: 'Status',
      displayType: 'chip',
      chipCondition: {
        trueLabel: 'Active',
        falseLabel: 'Inactive',
        trueColor: 'green',
        falseColor: 'red'
      }
    },
    {
      field: 'actions',
      title: 'Actions',
      actions: [
        {
          name: 'edit',
          label: 'Edit',
          icon: 'Edit',
          variant: 'outline',
          color: 'blue'
        },
        {
          name: 'delete',
          label: 'Delete',
          icon: 'Trash',
          variant: 'subtle',
          color: 'red'
        }
      ]
    }
  ];

  const handleRowAction = (actionName: string, rowData: any) => {
    console.log(`${actionName} action for:`, rowData);
  };

  return (
    <DynamicGrid
      baseUrl="https://api.example.com"
      endpoint="/users"
      columnSettings={columnSettings}
      enableEdit={true}
      enableCheckbox={true}
      pageSize={10}
      tokenRequired={true}
      onRowAction={handleRowAction}
      onRowSelected={(selectedRows) => console.log('Selected:', selectedRows)}
      tableSettings={{
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: true
      }}
      queryParams={{
        status: 'active'
      }}
    />
  );
};
```

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| baseUrl | string | - | Base URL of your API (e.g. "https://api.example.com"). Used as prefix for all API requests |
| endpoint | string | - | API endpoint path (e.g. "/users" or "/api/products"). Combined with baseUrl to form complete API URL |
| columnSettings | ColumnSetting[] | - | Column configurations |
| enableEdit | boolean | false | Enables editing feature |
| enableCheckbox | boolean | false | Enables multiple selection |
| tokenRequired | boolean | false | For APIs requiring token |
| pageSize | number | 10 | Number of records per page |
| queryParams | object | {} | Query parameters to add to API call |
| onRowAction | function | - | Callback function triggered when an action button/menu item is clicked. Returns action name and row data |
| onRowSelected | function | - | Callback function triggered when rows are selected/unselected. Returns array of selected rows when enableCheckbox is true |
| tableSettings | object | - | Table appearance settings |
| isMenuAction | boolean | false | When true, action buttons are displayed in a dropdown menu instead of buttons |

## 📝 Column Settings

```typescript
interface ColumnSetting {
  field: string;                // Data field
  title: string;               // Column header
  width?: string | number;     // Column width
  sortable?: boolean;          // Sortable
  editable?: boolean;          // Editable
  displayType?: 'text' | 'date' | 'datetime' | 'number' | 'money' | 'image' | 'link' | 'chip';
  format?: string;             // Value format
  url?: string;                // URL for link
  target?: string;             // Link target
  imageStyle?: CSSProperties;  // Image style
  linkStyle?: CSSProperties;   // Link style
  chipCondition?: {            // Chip display settings
    field?: string;
    value?: any;
    trueColor?: string;
    falseColor?: string;
    trueLabel?: string;
    falseLabel?: string;
  };
  actions?: ActionButton[];    // Action buttons
}
```

## 🎯 Action Buttons

```typescript
interface ActionButton {
  name: string;               // Action name
  label: string;             // Button label
  icon?: string;             // Tabler icon name
  variant?: string;          // Button variant
  size?: string;             // Button size
  disabled?: boolean;        // Disabled state
  color?: string;            // Button color
}
```

## 📊 API Response Format

Expected response format from API:

```json
{
  "data": [],           // Records
  "total": 0,          // Total number of records
  "page": 1,           // Current page
  "pageSize": 10       // Records per page
}
```

## 🔐 Token Usage

When `tokenRequired` is set to true, the component reads the 'token' key from localStorage and adds it as a Bearer token to API requests.


### Basic Usage
```tsx
const columnSettings = [
  { field: 'id', title: 'ID' },
  { field: 'name', title: 'Name' }
];

<DynamicGrid
  baseUrl="https://api.example.com"
  endpoint="/users"
  columnSettings={columnSettings}
/>
```

### Advanced Usage

```json settings.json
[
    {
        "field": "image",
        "title": "",
        "sortable": true,
        "editable": true,
        "displayType": "image",
        "width": "50px",
        "imageStyle": {
            "width": "30px",
            "height": "30px",
            "borderRadius": "50%"
        }
    },
    {
        "field": "name",
        "title": "Ürün Adı",
        "sortable": true,
        "editable": false,
        "displayType": "link",
        "url": "#{id}",
        "target": "_blank",
        "width": "30%",
        "linkStyle": {
            "color": "#000",
            "textDecoration": "none"
        }
    },
    {
        "field": "price",
        "title": "Fiyat",
        "sortable": true,
        "displayType": "money",
        "width": "100px"
    },
    {
        "field": "brand",
        "title": "Marka",
        "sortable": true
    },
    {
        "field": "productInfo",
        "title": "Ürün Bilgisi",
        "format": "{brand} - {weight}"
    },
    {
        "field": "status",
        "title": "Durum",
        "displayType": "chip",
        "chipCondition": {
            "trueLabel": "Aktif",
            "falseLabel": "Pasif",
            "trueColor": "green",
            "falseColor": "red"
        }
    },
    {
        "field": "actions",
        "title": "",
        "width": "200px",
        "actions": [
            {
                "label": "Düzenle",
                "name": "edit",
                "iconName": "edit",
                "onClick": "edit",
                "variant": "outline",
                "icon":"Edit"
            },
            {
                "label": "Sil",
                "name": "delete",
                "iconName": "trash",
                "onClick": "delete",
                "variant": "light",
                "icon":"Trash"
            }
        ]
    }
]
```
```tsx
'use client';
import { Button, TextInput, Group, Box } from '@mantine/core';
import { useState } from 'react';
import gridSettings from './settings.json';
import DynamicGrid, { ColumnSetting } from 'dynamic-grid';

export default function Home() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [queryParams, setQueryParams] = useState({
    keyword: ''
  });

  const handleSearch = () => {
    console.log(searchKeyword);
    setQueryParams(prev => ({
      ...prev,
      keyword: searchKeyword
    }));
  };

  return (
    <main style={{ padding: 20 }}>
      <Group mb="md">
        <TextInput
          placeholder="Arama yap..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
        />
        <Button onClick={handleSearch}>Ara</Button>
      </Group>

     <Box style={{height: 'calc(100vh - 100px)'}}>
     <DynamicGrid
        baseUrl="http://localhost:3000"
        endpoint="/api/products"
        columnSettings={gridSettings as ColumnSetting[]}
        enableEdit={true}
        tokenRequired={false}
        pageSize={10}
        enableCheckbox={false}
        isMenuAction={true}
        queryParams={queryParams}
        onRowSelected={(selectedRows) => {
          console.log('Selected rows:', selectedRows);
        }}
        tableSettings={{
          highlightOnHover: false,
          withTableBorder: true,
          withColumnBorders: false
        }}
        onRowAction={(action, rowData) => {
          console.log(action, rowData);
        }}
      />
     </Box>
    </main>
  );
}
```

## 🌐 API Integration

DynamicGrid uses `baseUrl` and `endpoint` parameters to fetch data from REST APIs:

- `baseUrl`: The main URL of your API (e.g., "https://api.example.com"). Used as the base address for all API requests.
- `endpoint`: The path to fetch data from API (e.g., "/users" or "/api/products"). Combined with baseUrl to form the complete API URL.

Example usages:
```typescript
// For user list:
baseUrl: "https://api.example.com"
endpoint: "/users"
// Final URL: https://api.example.com/users

// For product list:
baseUrl: "https://api.example.com"
endpoint: "/api/products"
// Final URL: https://api.example.com/api/products

// With query parameters:
baseUrl: "https://api.example.com"
endpoint: "/users"
queryParams: { status: "active", role: "admin" }
// Final URL: https://api.example.com/users?status=active&role=admin
```

## 📄 License

MIT

## 📅 Display Types

- **text**: Basic text display
- **date**: Date only format (DD/MM/YYYY)
- **datetime**: Date and time format (DD/MM/YYYY HH:MM)
- **number**: Formatted number
- **money**: Currency format
- **image**: Image display
- **link**: Clickable link
- **chip**: Colored badge/chip

 