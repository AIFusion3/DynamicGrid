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
```tsx
const columnSettings = [
  {
    field: 'status',
    title: 'Status',
    displayType: 'chip',
    chipCondition: {
      field: 'isActive',
      trueLabel: 'Active',
      falseLabel: 'Inactive'
    }
  },
  {
    field: 'profile',
    title: 'Profile',
    displayType: 'link',
    url: '/users/{id}/profile',
    format: '{firstName} {lastName}'
  }
];

<DynamicGrid
  baseUrl="https://api.example.com"
  endpoint="/users"
  columnSettings={columnSettings}
  enableCheckbox={true}
  enableEdit={true}
/>
```

## 📄 License

MIT

 