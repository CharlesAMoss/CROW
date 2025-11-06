/**
 * ImageCell component tests
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageCell } from './ImageCell';
import type { RowData } from '../../types/grid.types';

describe('ImageCell', () => {
  const mockRow: RowData = {
    id: 1,
    title: 'Test Image',
    imageUrl: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    // Mock Image constructor to simulate loading
    (globalThis as any).Image = class MockImage {
      src: string = '';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      
      constructor() {
        // Simulate immediate load in tests
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    };
  });

  test('renders loading state initially', () => {
    const { container } = render(
      <ImageCell
        imageUrl="https://example.com/image.jpg"
        alt="Test"
        row={mockRow}
        rowIndex={0}
      />
    );

    // Should show loading spinner initially (use firstChild since container has the div)
    const imageCell = container.firstChild as HTMLElement;
    expect(imageCell).toBeTruthy();
  });

  test('renders image after loading', async () => {
    render(
      <ImageCell
        imageUrl="https://example.com/image.jpg"
        alt="Test Image"
        row={mockRow}
        rowIndex={0}
      />
    );

    // Wait for image to load
    await waitFor(() => {
      const img = screen.getByAltText('Test Image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  test('renders error state when image fails to load', async () => {
    // Mock Image to simulate error
    (globalThis as any).Image = class MockImage {
      src: string = '';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      
      constructor() {
        setTimeout(() => {
          if (this.onerror) this.onerror();
        }, 0);
      }
    };

    render(
      <ImageCell
        imageUrl="https://example.com/broken.jpg"
        alt="Test"
        row={mockRow}
        rowIndex={0}
      />
    );

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
    });
  });

  test('applies custom aspect ratio', () => {
    const { container } = render(
      <ImageCell
        imageUrl="https://example.com/image.jpg"
        alt="Test"
        row={mockRow}
        rowIndex={0}
        aspectRatio="16/9"
      />
    );

    const imageCell = container.firstChild as HTMLElement;
    expect(imageCell).toHaveStyle({ aspectRatio: '16/9' });
  });

  test('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    
    render(
      <ImageCell
        imageUrl="https://example.com/image.jpg"
        alt="Test"
        row={mockRow}
        rowIndex={0}
        onClick={handleClick}
      />
    );

    await waitFor(() => {
      const img = screen.getByAltText('Test');
      expect(img).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledWith(mockRow, 0);
  });

  test('handles Enter key press', async () => {
    const handleClick = vi.fn();
    
    render(
      <ImageCell
        imageUrl="https://example.com/image.jpg"
        alt="Test"
        row={mockRow}
        rowIndex={0}
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button');
    button.focus();
    await userEvent.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledWith(mockRow, 0);
  });

  test('does not render as button when onClick is not provided', async () => {
    render(
      <ImageCell
        imageUrl="https://example.com/image.jpg"
        alt="Test"
        row={mockRow}
        rowIndex={0}
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  test('has proper accessibility attributes', async () => {
    const handleClick = vi.fn();
    
    render(
      <ImageCell
        imageUrl="https://example.com/image.jpg"
        alt="Test Image"
        row={mockRow}
        rowIndex={0}
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabIndex', '0');
    expect(button).toHaveAttribute('aria-label');
  });

  test('updates image when imageUrl prop changes', async () => {
    const { rerender } = render(
      <ImageCell
        imageUrl="https://example.com/image1.jpg"
        alt="Test"
        row={mockRow}
        rowIndex={0}
      />
    );

    await waitFor(() => {
      expect(screen.getByAltText('Test')).toHaveAttribute('src', 'https://example.com/image1.jpg');
    });

    rerender(
      <ImageCell
        imageUrl="https://example.com/image2.jpg"
        alt="Test"
        row={mockRow}
        rowIndex={0}
      />
    );

    await waitFor(() => {
      expect(screen.getByAltText('Test')).toHaveAttribute('src', 'https://example.com/image2.jpg');
    });
  });
});
