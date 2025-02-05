import { render, screen, fireEvent } from '@testing-library/react';
import DynamicGrid from '../src/DynamicGrid';

describe('DynamicGrid', () => {
  const mockColumns = [
    {
      field: 'name',
      title: 'Name',
      sortable: true
    }
  ];

  it('renders without crashing', () => {
    render(
      <DynamicGrid
        baseUrl="http://api.test"
        endpoint="/test"
        columnSettings={mockColumns}
      />
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  // Diğer test senaryoları...
});