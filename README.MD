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
      description: 'Full name of the user',
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
        withColumnBorders: true,
        stickyHeader: true,
        stickyHeaderOffset: 60
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
| enablePagination | boolean | true | Enables or disables pagination |
| actionColumnPosition | 'start' \| 'end' | 'end' | Controls position of action columns (start or end of table) |
| queryParams | object | {} | Query parameters to add to API call |
| onRowAction | function | - | Callback function triggered when an action button/menu item is clicked. Returns action name and row data |
| onRowSelected | function | - | Callback function triggered when rows are selected/unselected. Returns array of selected rows when enableCheckbox is true |
| tableSettings | object | - | Table appearance and behavior settings |
| isMenuAction | boolean | false | When true, action buttons are displayed in a dropdown menu instead of buttons |

## ⚙️ Table Settings

```typescript
interface TableSettings {
  highlightOnHover?: boolean;      // Satırların üzerine gelindiğinde vurgulanması
  withTableBorder?: boolean;       // Tablo dış çerçevesi
  withColumnBorders?: boolean;     // Sütun arası çizgiler
  stickyHeader?: boolean;          // Başlık satırlarının sabit kalması
  stickyHeaderOffset?: number;     // Sabit başlığın üstten uzaklığı (px)
  horizontalScroll?: boolean;      // Yatay kaydırma özelliği
  minWidth?: number;               // Tablo minimum genişliği (px)
}
```
```

### Table Settings Kullanımı

```tsx
<DynamicGrid
  // ... diğer props
  tableSettings={{
    highlightOnHover: true,        // Satır vurgulama aktif
    withTableBorder: true,         // Dış çerçeve var
    withColumnBorders: false,      // Sütun çizgileri yok
    stickyHeader: true,            // Başlık sabit
    stickyHeaderOffset: 60,        // Navbar için 60px boşluk
    horizontalScroll: true,        // Yatay kaydırma aktif
    minWidth: 2300                 // Minimum tablo genişliği
  }}
/>
```
```

### Sticky Header Özellikleri

- **Uzun Tablolar**: Scroll sırasında başlık satırları görünür kalır
- **Navbar Uyumluluğu**: `stickyHeaderOffset` ile sabit navbar'lar için boşluk ayarlanabilir
- **Grup Başlıkları**: Column grouping aktifse grup başlıkları da sabit kalır
- **Responsive**: Mobil cihazlarda da düzgün çalışır

### Sütun Başlığı Stilleri

DynamicGrid'de sütun başlıkları modern ve okunabilir bir tasarıma sahiptir:

- **Typography**: 12px font boyutu, 600 font weight
- **Letter Spacing**: 0.5px harf aralığı
- **Flex Layout**: Başlık ve sıralama ikonu arasında esnek düzen
- **Word Break**: Uzun başlıklar için kelime kırma
- **Sort Icons**: Aktif sıralama için renkli oklar, pasif için şeffaf ikonlar
- **Tooltip Support**: `description` field'i ile açıklama tooltip'leri

### Horizontal Scroll Özellikleri

- **Çok Sütunlu Tablolar**: Geniş tablolarda yatay kaydırma sağlar
- **Minimum Genişlik**: `minWidth` ile tablo genişliği kontrol edilir
- **Mantine ScrollContainer**: Mantine'in native scroll container'ı kullanılır
- **Performans**: Sadece gerekli olduğunda scroll container aktif olur
- **Responsive**: Mobil cihazlarda da düzgün çalışır

### Horizontal Scroll Kullanımı

```tsx
<DynamicGrid
  baseUrl="https://api.example.com"
  endpoint="/products"
  columnSettings={columnSettings}
  tableSettings={{
    horizontalScroll: true,    // Yatay kaydırma aktif
    minWidth: 2300,           // Minimum 2300px genişlik
    stickyHeader: true,       // Başlık sabit kalır
    withTableBorder: true
  }}
/>
```

### Kullanım Senaryoları

- **E-ticaret Ürün Listeleri**: Çok sayıda ürün özelliği
- **Finansal Raporlar**: Detaylı finansal veriler
- **Personel Yönetimi**: Kapsamlı personel bilgileri
- **Envanter Takibi**: Detaylı stok bilgileri
- **Analitik Dashboard**: Çok sütunlu raporlar

## 📄 Pagination Control

DynamicGrid'de pagination özelliğini açıp kapatabilirsiniz. Bu özellik, küçük veri setlerinde veya infinite scroll kullanmak istediğinizde kullanışlıdır.

### Pagination Kullanımı

```tsx
// Pagination Aktif (Default)
<DynamicGrid
  baseUrl="https://api.example.com"
  endpoint="/users"
  columnSettings={columnSettings}
  enablePagination={true}  // Default olarak true
  pageSize={10}            // Sayfa başına 10 kayıt
/>

// Pagination Pasif - Tüm veriler tek sayfada
<DynamicGrid
  baseUrl="https://api.example.com"
  endpoint="/users"
  columnSettings={columnSettings}
  enablePagination={false}  // Pagination kapatıldı
  // pageSize prop'u gerek yok
/>
```

### Pagination Özellikleri

- **Default Aktif**: `enablePagination=true` (varsayılan değer)
- **API Parametreleri**: Pagination kapalıyken `page` ve `page_size` parametreleri API'ye gönderilmez
- **UI Kontrolü**: Pagination kapalıyken alt kısımdaki sayfa numaraları gizlenir
- **Performans**: Pagination kapalıyken tüm veriler tek API çağrısında çekilir
- **Esnek Kullanım**: Küçük veri setleri veya infinite scroll senaryoları için ideal

### Kullanım Senaryoları

- **Küçük Veri Setleri**: 50-100 kayıtlık listeler için pagination gereksiz olabilir
- **Infinite Scroll**: Kendi scroll mantığınızı implement etmek istiyorsanız
- **Export İşlemleri**: Tüm verileri tek seferde çekmek gerektiğinde
- **Dashboard Widgets**: Özet tablolar için sayfalama gereksiz

## 📝 Column Settings

```typescript
interface ColumnSetting {
  field: string;                // Data field
  title: string;               // Column header
  description?: string;        // Column tooltip description
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
  icon?: React.ReactElement; // React icon element
  variant?: string;          // Button variant
  size?: string;             // Button size
  disabled?: boolean;        // Disabled state
  color?: string;            // Button color
  showField?: string;        // Field name - action visible when this field is true
  hideField?: string;        // Field name - action hidden when this field is true
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

## 📊 Footer Feature

DynamicGrid'e tablo alt kısmında özet bilgileri gösterebilen footer özelliği eklenmiştir. Bu özellik ayrı bir API endpoint'inden tek bir obje çekerek, sütun field'larıyla eşleşen verileri footer satırında gösterir.

### Footer Kullanımı

```tsx
<DynamicGrid
  baseUrl="https://api.example.com"
  endpoint="/users"
  columnSettings={[
    { field: 'name', title: 'İsim', sortable: true },
    { field: 'salary', title: 'Maaş', displayType: 'money' },
    { field: 'age', title: 'Yaş', displayType: 'number' },
    { field: 'count', title: 'Toplam Kayıt', displayType: 'number' }
  ]}
  footerSettings={{
    enabled: true,
    endpoint: '/users/summary',
    style: { 
      backgroundColor: '#f8f9fa', 
      fontWeight: 'bold',
      borderTop: '2px solid #dee2e6'
    }
  }}
/>
```

### Footer API Response Formatı

Footer endpoint'i tek bir obje dönmelidir. Bu obje, sütun field'larıyla eşleşen property'lere sahip olmalıdır:

```json
{
  "name": "TOPLAM",
  "salary": 125000.50,
  "age": null,
  "count": 45
}
```

### Footer Ayarları

```typescript
footerSettings?: {
  enabled: boolean;        // Footer'ı aktif/pasif yapar
  endpoint: string;        // Footer verilerini çekeceği API endpoint'i
  style?: CSSProperties;   // Footer satırına uygulanacak CSS stilleri
}
```

### Footer Özellikler

- **Otomatik Formatlama**: Footer verileri, sütun ayarlarındaki `displayType`'a göre formatlanır (money, number, date vb.)
- **Boş Değer Kontrolü**: Footer'da bulunmayan field'lar boş gösterilir
- **Stil Özelleştirme**: Footer satırına özel CSS stilleri uygulanabilir
- **Token Desteği**: Ana veri çekimi gibi token gerektiren API'lar desteklenir
- **Query Parametreleri**: Ana tablodaki query parametreleri footer API'sine de gönderilir

### Footer Kullanım Senaryoları

- **Finansal Tablolar**: Toplam tutar, ortalama değer
- **Personel Listeleri**: Toplam maaş, personel sayısı
- **Satış Raporları**: Toplam satış, ortalama sipariş tutarı
- **Envanter Yönetimi**: Toplam stok değeri, ürün sayısı

## 🎯 Action Column Position Control

DynamicGrid'de action sütunlarının (butonlar/menu) tabloda başta mı yoksa sonda mı görüneceğini kontrol edebilirsiniz.

### Action Column Position Kullanımı

```tsx
// Action Sütunu Sonda (Default)
<DynamicGrid
  baseUrl="https://api.example.com"
  endpoint="/users"
  columnSettings={columnSettings}
  actionColumnPosition="end"  // Default değer
/>

// Action Sütunu Başta
<DynamicGrid
  baseUrl="https://api.example.com"
  endpoint="/users"
  columnSettings={columnSettings}
  actionColumnPosition="start"  // Action sütunu başta
/>
```

### Action Column Position Özellikleri

- **`actionColumnPosition="start"`**: Action sütunları tabloda başta görünür
- **`actionColumnPosition="end"`**: Action sütunları tabloda sonda görünür (default)
- **Otomatik Sıralama**: Action sütunları otomatik olarak başa veya sona yerleştirilir
- **Diğer Sütunlar**: Normal sütunların sırası değişmez
- **Tüm Bölümler**: Header, body, footer ve grouping'de çalışır
- **Mobil Uyumlu**: Mobil görünümlerde daha iyi kullanıcı deneyimi sağlar

### Kullanım Senaryoları

- **Mobil Öncelikli**: Action butonları başta olduğunda mobil cihazlarda daha kolay erişim
- **Tasarım Gereksinimleri**: Belirli tasarım standartlarına uygunluk
- **Kullanıcı Alışkanlıkları**: Farklı kullanıcı gruplarının tercihleri
- **Responsive Tasarım**: Farklı ekran boyutlarında optimize edilmiş görünüm

## 🎭 Conditional Action Visibility

DynamicGrid'de action butonlarının görünürlüğünü veri durumuna göre dinamik olarak kontrol edebilirsiniz. Bu özellik, kullanıcı yetkilerine, veri durumuna veya diğer koşullara göre action'ları göstermenizi/gizlemenizi sağlar.

### Conditional Action Kullanımı

```tsx
const columnSettings: ColumnSetting[] = [
  {
    field: 'name',
    title: 'İsim',
    actions: [
      {
        label: 'Düzenle',
        name: 'edit',
        showField: 'canEdit',        // canEdit true ise görünür
        icon: <IconEdit size={16} />
      },
      {
        label: 'Sil',
        name: 'delete',
        hideField: 'isDeleted',      // isDeleted true ise gizli
        icon: <IconTrash size={16} />
      },
      {
        label: 'Onayla',
        name: 'approve',
        showField: 'needsApproval',  // needsApproval true ise görünür
        hideField: 'isApproved',     // isApproved true ise gizli
        icon: <IconCheck size={16} />
      }
    ]
  }
];
```

### Conditional Action Özellikleri

- **`showField`**: Belirtilen field'ın değeri `true` ise action görünür
- **`hideField`**: Belirtilen field'ın değeri `true` ise action gizli
- **Nested Field Desteği**: `user.permissions.canEdit` gibi nested field'lar desteklenir
- **Her İki Tip**: Hem button hem menu action'ları için çalışır
- **Dinamik Kontrol**: Her satır için ayrı ayrı kontrol edilir
- **Performans**: Gereksiz render'ları önler

### Conditional Logic

```typescript
// showField kontrolü
if (action.showField) {
  const showValue = getNestedValue(row, action.showField);
  if (!showValue) return false; // Gizle
}

// hideField kontrolü  
if (action.hideField) {
  const hideValue = getNestedValue(row, action.hideField);
  if (hideValue) return false; // Gizle
}

return true; // Göster
```

### Kullanım Senaryoları

- **Yetki Kontrolü**: Kullanıcının yetkisine göre action'ları gösterme/gizleme
- **Durum Kontrolü**: Veri durumuna göre uygun action'ları gösterme
- **İş Akışı**: Belirli aşamalarda sadece ilgili action'ları gösterme
- **Güvenlik**: Hassas işlemleri sadece yetkili kullanıcılara gösterme
- **UX Optimizasyonu**: Kullanıcı deneyimini iyileştirmek için gereksiz action'ları gizleme

### Örnek Veri Yapısı

```json
{
  "id": 1,
  "name": "John Doe",
  "canEdit": true,           // showField için
  "isDeleted": false,        // hideField için
  "needsApproval": true,     // showField için
  "isApproved": false,       // hideField için
  "user": {
    "permissions": {
      "canDelete": true      // Nested field örneği
    }
  }
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
          withColumnBorders: false,
          stickyHeader: true,
          stickyHeaderOffset: 60
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

## 📊 Column Grouping (Sütun Gruplama)

DynamicGrid'e sütunları mantıklı gruplar halinde organize edebilme özelliği eklenmiştir. Bu özellik, ilişkili sütunları tek bir üst başlık altında toplayarak tablonun daha okunabilir olmasını sağlar.

### Column Grouping Kullanımı

```tsx
import DynamicGrid, { ColumnSetting, ColumnGroup } from 'dynamic-grid';

const columnSettings = [
  { field: 'name', title: 'Ürün Adı', sortable: true },
  { field: 'price', title: 'Fiyat', displayType: 'money', sortable: true },
  { field: 'sellCount', title: 'Satış Adedi', displayType: 'number', sortable: true },
  { field: 'stock', title: 'Stok', displayType: 'number', sortable: true },
  { field: 'category', title: 'Kategori', sortable: true }
];

const groupSettings = [
  {
    id: 'salesData',
    title: 'Satış Verileri',
    fields: ['price', 'sellCount'],
    style: { 
      backgroundColor: '#e3f2fd',
      fontWeight: 'bold',
      color: '#1976d2'
    }
  },
  {
    id: 'inventory',
    title: 'Envanter',
    fields: ['stock'],
    style: { 
      backgroundColor: '#f3e5f5',
      fontWeight: 'bold',
      color: '#7b1fa2'
    }
  }
];

<DynamicGrid
  enableGrouping={true}
  groupSettings={groupSettings}
  columnSettings={columnSettings}
  baseUrl="https://api.example.com"
  endpoint="/products"
  // ... diğer props
/>
```

### Column Group Interface

```typescript
interface ColumnGroup {
  id: string;                    // Grup için benzersiz kimlik
  title: string;                 // Grup başlığında gösterilecek metin
  fields: string[];              // Bu gruba dahil edilecek field'lar
  style?: React.CSSProperties;   // Grup başlığına uygulanacak CSS stilleri
}
```

### Grouping Props

```typescript
enableGrouping?: boolean;        // Sütun gruplama özelliğini aktif/pasif yapar
groupSettings?: ColumnGroup[];   // Grup tanımlarının listesi
```

### Grup Özellikleri

- **Esnek Gruplama**: İstediğiniz sütunları istediğiniz gruplar altında toplayabilirsiniz
- **Stil Özelleştirme**: Her grup başlığına özel CSS stilleri uygulayabilirsiniz
- **Karışık Yapı**: Bazı sütunlar gruplu, bazıları tek başına olabilir
- **Geriye Uyumluluk**: `enableGrouping=false` iken normal tablo görünümü korunur
- **Sıralama Desteği**: Gruplanmış sütunlarda sıralama özellikleri çalışmaya devam eder

### HTML Yapısı

Column grouping aktif olduğunda tablo şu yapıya sahip olur:

```html
<thead>
  <!-- Grup başlıkları satırı -->
  <tr>
    <th></th>                           <!-- Gruplanmayan sütunlar için boş -->
    <th colspan="2">Satış Verileri</th>  <!-- Grup başlığı 2 sütuna yayılır -->
    <th>Envanter</th>                   <!-- Tek sütunlu grup -->
    <th></th>                           <!-- Gruplanmayan sütun için boş -->
  </tr>
  
  <!-- Normal sütun başlıkları satırı -->
  <tr>
    <th>Ürün Adı</th>
    <th>Fiyat</th>
    <th>Satış Adedi</th>
    <th>Stok</th>
    <th>Kategori</th>
  </tr>
</thead>
```

### Kullanım Senaryoları

- **E-ticaret**: Ürün bilgileri, fiyat bilgileri, stok bilgileri
- **Finansal Raporlar**: Gelir verileri, gider verileri, kar/zarar
- **Personel Yönetimi**: Kişisel bilgiler, iletişim bilgileri, maaş bilgileri
- **Proje Yönetimi**: Proje detayları, zaman bilgileri, kaynak bilgileri
- **Müşteri Analizi**: Demografik bilgiler, satış verileri, davranış verileri

## 🔐 Token Usage

When `tokenRequired` is set to true, the component reads the 'token' key from localStorage and adds it as a Bearer token to API requests.

 