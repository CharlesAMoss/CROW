import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * Configuration for virtual scrolling
 */
export interface VirtualScrollConfig {
  /** Total number of items in the list */
  totalItems: number;
  /** Height of each item in pixels */
  itemHeight: number;
  /** Height of the visible container in pixels */
  containerHeight: number;
  /** Number of extra items to render above and below visible area (buffer) */
  overscan?: number;
}

/**
 * Virtual scroll state and calculations
 */
export interface VirtualScrollResult {
  /** Index of the first visible item */
  startIndex: number;
  /** Index of the last visible item */
  endIndex: number;
  /** Total height of all items (for scrollbar) */
  totalHeight: number;
  /** Offset for positioning visible items */
  offsetY: number;
  /** Items to render (indices) */
  visibleItems: number[];
  /** Scroll event handler */
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  /** Current scroll position */
  scrollTop: number;
}

/**
 * Custom hook for virtual scrolling
 * Calculates which items should be visible based on scroll position
 * 
 * @param config - Virtual scroll configuration
 * @returns Virtual scroll state and handlers
 */
export function useVirtualScroll(config: VirtualScrollConfig): VirtualScrollResult {
  const { totalItems, itemHeight, containerHeight, overscan = 5 } = config;
  
  const [scrollTop, setScrollTop] = useState(0);
  const scrollTopRef = useRef(0);

  // Calculate visible range
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    // Calculate how many items fit in the visible area
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    
    // Calculate which item is at the top of the viewport
    const scrolledItems = Math.floor(scrollTop / itemHeight);
    
    // Add overscan buffer
    const start = Math.max(0, scrolledItems - overscan);
    const end = Math.min(totalItems - 1, scrolledItems + visibleCount + overscan);
    
    // Generate array of visible item indices
    const items: number[] = [];
    for (let i = start; i <= end; i++) {
      items.push(i);
    }
    
    return {
      startIndex: start,
      endIndex: end,
      visibleItems: items,
    };
  }, [scrollTop, totalItems, itemHeight, containerHeight, overscan]);

  // Calculate total height for scrollbar
  const totalHeight = useMemo(() => {
    return totalItems * itemHeight;
  }, [totalItems, itemHeight]);

  // Calculate offset for positioning
  const offsetY = useMemo(() => {
    return startIndex * itemHeight;
  }, [startIndex, itemHeight]);

  // Scroll event handler
  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const newScrollTop = target.scrollTop;
    
    // Only update if scroll position changed significantly
    // This reduces unnecessary re-renders
    if (Math.abs(newScrollTop - scrollTopRef.current) > itemHeight / 4) {
      scrollTopRef.current = newScrollTop;
      setScrollTop(newScrollTop);
    }
  }, [itemHeight]);

  // Reset scroll position when totalItems changes
  useEffect(() => {
    setScrollTop(0);
    scrollTopRef.current = 0;
  }, [totalItems]);

  return {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    visibleItems,
    onScroll,
    scrollTop,
  };
}

/**
 * Helper hook for variable height items
 * More complex but supports dynamic row heights
 */
export interface VariableHeightConfig {
  /** Total number of items */
  totalItems: number;
  /** Function to get height for each item */
  getItemHeight: (index: number) => number;
  /** Height of the visible container */
  containerHeight: number;
  /** Overscan buffer */
  overscan?: number;
}

export interface VariableHeightResult {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  visibleItems: Array<{ index: number; offset: number }>;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  scrollTop: number;
}

/**
 * Virtual scroll for variable height items
 * More expensive to calculate but supports different row heights
 */
export function useVariableHeightVirtualScroll(
  config: VariableHeightConfig
): VariableHeightResult {
  const { totalItems, getItemHeight, containerHeight, overscan = 5 } = config;
  
  const [scrollTop, setScrollTop] = useState(0);
  const scrollTopRef = useRef(0);

  // Pre-calculate all item positions (memoized)
  const itemPositions = useMemo(() => {
    const positions: Array<{ offset: number; height: number }> = [];
    let currentOffset = 0;
    
    for (let i = 0; i < totalItems; i++) {
      const height = getItemHeight(i);
      positions.push({ offset: currentOffset, height });
      currentOffset += height;
    }
    
    return positions;
  }, [totalItems, getItemHeight]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    if (itemPositions.length === 0) return 0;
    const lastItem = itemPositions[itemPositions.length - 1];
    return lastItem.offset + lastItem.height;
  }, [itemPositions]);

  // Binary search to find first visible item
  const findStartIndex = useCallback(
    (scrollTop: number): number => {
      let left = 0;
      let right = itemPositions.length - 1;
      
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const item = itemPositions[mid];
        
        if (item.offset <= scrollTop && item.offset + item.height > scrollTop) {
          return mid;
        } else if (item.offset > scrollTop) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }
      
      return Math.max(0, left);
    },
    [itemPositions]
  );

  // Calculate visible range
  const { startIndex, endIndex, visibleItems, offsetY } = useMemo(() => {
    if (itemPositions.length === 0) {
      return { startIndex: 0, endIndex: 0, visibleItems: [], offsetY: 0 };
    }
    
    const start = Math.max(0, findStartIndex(scrollTop) - overscan);
    const viewportBottom = scrollTop + containerHeight;
    
    let end = start;
    while (
      end < itemPositions.length - 1 &&
      itemPositions[end].offset < viewportBottom + (itemPositions[end].height * overscan)
    ) {
      end++;
    }
    
    const items = [];
    for (let i = start; i <= end; i++) {
      items.push({
        index: i,
        offset: itemPositions[i].offset,
      });
    }
    
    return {
      startIndex: start,
      endIndex: end,
      visibleItems: items,
      offsetY: itemPositions[start]?.offset || 0,
    };
  }, [scrollTop, containerHeight, overscan, itemPositions, findStartIndex]);

  // Scroll event handler
  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const newScrollTop = target.scrollTop;
    
    // Throttle updates
    if (Math.abs(newScrollTop - scrollTopRef.current) > 10) {
      scrollTopRef.current = newScrollTop;
      setScrollTop(newScrollTop);
    }
  }, []);

  // Reset on totalItems change
  useEffect(() => {
    setScrollTop(0);
    scrollTopRef.current = 0;
  }, [totalItems]);

  return {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    visibleItems,
    onScroll,
    scrollTop,
  };
}
