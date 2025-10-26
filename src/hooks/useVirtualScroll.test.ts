/**
 * Tests for useVirtualScroll hook
 */

import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVirtualScroll } from './useVirtualScroll';

describe('useVirtualScroll', () => {
  test('calculates correct initial state', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalItems: 100,
        itemHeight: 40,
        containerHeight: 400,
        overscan: 5,
      })
    );

    expect(result.current.startIndex).toBe(0);
    expect(result.current.totalHeight).toBe(4000); // 100 * 40
    expect(result.current.offsetY).toBe(0);
    expect(result.current.scrollTop).toBe(0);
  });

  test('calculates visible items correctly', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalItems: 100,
        itemHeight: 40,
        containerHeight: 400, // Can fit 10 items
        overscan: 5,
      })
    );

    // Should render 10 visible + 5 overscan above + 5 overscan below = 20 items
    // But since we start at 0, only 5 overscan below
    expect(result.current.visibleItems.length).toBeGreaterThanOrEqual(10);
    expect(result.current.visibleItems.length).toBeLessThanOrEqual(20);
  });

  test('updates visible range on scroll', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalItems: 100,
        itemHeight: 40,
        containerHeight: 400,
        overscan: 5,
      })
    );

    const initialStart = result.current.startIndex;

    // Simulate scroll event
    act(() => {
      const mockEvent = {
        currentTarget: {
          scrollTop: 400, // Scroll down by container height
        },
      } as React.UIEvent<HTMLDivElement>;

      result.current.onScroll(mockEvent);
    });

    // After scrolling, start index should have changed
    expect(result.current.startIndex).toBeGreaterThan(initialStart);
    expect(result.current.offsetY).toBeGreaterThan(0);
  });

  test('handles total items change', () => {
    const { result, rerender } = renderHook(
      ({ totalItems }) =>
        useVirtualScroll({
          totalItems,
          itemHeight: 40,
          containerHeight: 400,
          overscan: 5,
        }),
      { initialProps: { totalItems: 100 } }
    );

    const initialHeight = result.current.totalHeight;
    expect(initialHeight).toBe(4000);

    // Change total items
    rerender({ totalItems: 200 });

    expect(result.current.totalHeight).toBe(8000); // 200 * 40
    expect(result.current.scrollTop).toBe(0); // Should reset scroll
  });

  test('respects overscan buffer', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalItems: 100,
        itemHeight: 40,
        containerHeight: 400,
        overscan: 10,
      })
    );

    // With larger overscan, should render more items
    expect(result.current.visibleItems.length).toBeGreaterThanOrEqual(15);
  });

  test('handles scrolling to bottom', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalItems: 100,
        itemHeight: 40,
        containerHeight: 400,
        overscan: 5,
      })
    );

    // Scroll to bottom
    act(() => {
      const mockEvent = {
        currentTarget: {
          scrollTop: 3600, // Near bottom (4000 - 400)
        },
      } as React.UIEvent<HTMLDivElement>;

      result.current.onScroll(mockEvent);
    });

    // Should be near the end
    expect(result.current.startIndex).toBeGreaterThan(80);
    expect(result.current.endIndex).toBe(99);
  });

  test('handles empty dataset', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalItems: 0,
        itemHeight: 40,
        containerHeight: 400,
        overscan: 5,
      })
    );

    expect(result.current.totalHeight).toBe(0);
    expect(result.current.visibleItems).toHaveLength(0);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(-1);
  });

  test('throttles scroll updates', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalItems: 100,
        itemHeight: 40,
        containerHeight: 400,
        overscan: 5,
      })
    );

    const initialScrollTop = result.current.scrollTop;

    // Scroll by a small amount (less than itemHeight / 4)
    act(() => {
      const mockEvent = {
        currentTarget: {
          scrollTop: 5, // Small scroll
        },
      } as React.UIEvent<HTMLDivElement>;

      result.current.onScroll(mockEvent);
    });

    // Should not update due to throttling
    expect(result.current.scrollTop).toBe(initialScrollTop);
  });

  test('calculates offset correctly for middle position', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        totalItems: 100,
        itemHeight: 40,
        containerHeight: 400,
        overscan: 0, // No overscan for easier calculation
      })
    );

    // Scroll to middle
    act(() => {
      const mockEvent = {
        currentTarget: {
          scrollTop: 2000, // Middle of 4000 total height
        },
      } as React.UIEvent<HTMLDivElement>;

      result.current.onScroll(mockEvent);
    });

    // Start index should be around item 50 (2000 / 40)
    expect(result.current.startIndex).toBeGreaterThanOrEqual(45);
    expect(result.current.startIndex).toBeLessThanOrEqual(55);

    // Offset should match startIndex * itemHeight
    expect(result.current.offsetY).toBe(result.current.startIndex * 40);
  });
});
