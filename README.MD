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
| baseUrl | string | - | Base URL of the API |
| endpoint | string | - | API endpoint |
| columnSettings | ColumnSetting[] | - | Column configurations |
| enableEdit | boolean | false | Enables editing feature |
| enableCheckbox | boolean | false | Enables multiple selection |
| tokenRequired | boolean | false | For APIs requiring token |
| pageSize | number | 10 | Number of records per page |
| queryParams | object | {} | Query parameters to add to API call |
| onRowAction | function | - | Callback for action buttons |
| onRowSelected | function | - | Callback for selected rows |
| tableSettings | object | - | Table appearance settings |

## 📝 Column Settings

```typescript
interface ColumnSetting {
  field: string;                // Data field
  title: string;               // Column header
  width?: string | number;     // Column width
  sortable?: boolean;          // Sortable
  editable?: boolean;          // Editable
  displayType?: 'text' | 'date' | 'number' | 'money' | 'image' | 'link' | 'chip';
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

## 📄 License

MIT

 