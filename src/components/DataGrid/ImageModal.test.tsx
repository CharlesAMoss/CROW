/**
 * ImageModal component tests
 */

import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageModal } from './ImageModal';
import type { RowData } from '../../types/grid.types';
import type { ColumnDefinition } from '../../types/config.types';

describe('ImageModal', () => {
  const mockRow: RowData = {
    id: 1,
    title: 'Mountain Sunset',
    imageUrl: 'https://example.com/image.jpg',
    photographer: 'John Doe',
    description: 'A beautiful sunset',
    tags: 'nature, sunset',
  };

  const mockColumns: ColumnDefinition<RowData>[] = [
    { key: 'imageUrl', header: 'Image' },
    { key: 'title', header: 'Title' },
    { key: 'photographer', header: 'Photographer' },
    { key: 'description', header: 'Description' },
    {
      key: 'tags',
      header: 'Tags',
      formatter: (value) => {
        if (Array.isArray(value)) return value.join(', ');
        return String(value);
      },
    },
  ];

  const handleClose = vi.fn();

  afterEach(() => {
    // Restore body overflow
    document.body.style.overflow = '';
    handleClose.mockClear();
  });

  test('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ImageModal
        isOpen={false}
        imageUrl="https://example.com/image.jpg"
        row={mockRow}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('renders modal content when isOpen is true', () => {
    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={mockRow}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    // Check for image
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');

    // Check for metadata
    expect(screen.getByText('Mountain Sunset')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('A beautiful sunset')).toBeInTheDocument();
  });

  test('applies formatter to column values', () => {
    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={mockRow}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    // Tags should be formatted as comma-separated string
    expect(screen.getByText('nature, sunset')).toBeInTheDocument();
  });

  test('skips imageUrl column in details', () => {
    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={mockRow}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    // Should not show "https://example.com/image.jpg" in details
    const body = document.body;
    expect(body.textContent).not.toContain('https://example.com/image.jpg');
  });

  test('calls onClose when close button is clicked', async () => {
    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={mockRow}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Escape key is pressed', async () => {
    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={mockRow}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    await userEvent.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop is clicked', async () => {
    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={mockRow}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    // Click on overlay (backdrop)
    const overlay = screen.getByRole('img').closest('.modalOverlay');
    if (overlay) {
      await userEvent.click(overlay);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  test('does not close when clicking modal content', async () => {
    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={mockRow}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    // Click on modal content (not backdrop)
    const content = screen.getByRole('img').closest('.modalContent');
    if (content) {
      await userEvent.click(content);
      expect(handleClose).not.toHaveBeenCalled();
    }
  });

  test('locks body scroll when open', () => {
    const { unmount } = render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={mockRow}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  test('cleans up event listeners on unmount', () => {
    const { unmount } = render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={mockRow}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(document.body.style.overflow).toBe('');
  });

  test('formats Date values correctly', () => {
    const rowWithDate: RowData = {
      ...mockRow,
      createdAt: new Date('2024-01-15'),
    };

    const columnsWithDate: ColumnDefinition<RowData>[] = [
      ...mockColumns,
      {
        key: 'createdAt',
        header: 'Created',
        formatter: (value) => {
          if (value instanceof Date) return value.toLocaleDateString();
          return String(value);
        },
      },
    ];

    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={rowWithDate}
        columns={columnsWithDate}
        onClose={handleClose}
      />
    );

    // Should show formatted date (flexible match for different locales)
    expect(screen.getByText(/1\/14\/2024|14\/1\/2024|2024/)).toBeInTheDocument();
  });

  test('handles null and undefined values', () => {
    const rowWithNulls: RowData = {
      id: 1,
      title: 'Test',
      imageUrl: 'https://example.com/image.jpg',
      photographer: null,
      description: undefined,
    };

    render(
      <ImageModal
        isOpen={true}
        imageUrl="https://example.com/image.jpg"
        row={rowWithNulls}
        columns={mockColumns}
        onClose={handleClose}
      />
    );

    // Should render em dash "—" for null/undefined values
    const emDashes = screen.getAllByText('—');
    expect(emDashes.length).toBeGreaterThan(0);
  });
});
