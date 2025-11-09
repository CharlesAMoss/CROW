/**
 * Tree data utilities
 * Functions for working with hierarchical/nested data structures
 */

import type { TreeNode } from '../types/grid.types';

/**
 * Flatten a tree structure into a linear array while preserving hierarchy info
 * @param nodes - Root level tree nodes
 * @param level - Current nesting level (0 for root)
 * @returns Flattened array with level information
 */
export function flattenTree(nodes: TreeNode[], level = 0): TreeNode[] {
  const result: TreeNode[] = [];

  for (const node of nodes) {
    // Add the node with its level
    result.push({
      ...node,
      level,
      hasChildren: Boolean(node.children && node.children.length > 0),
    });

    // Recursively flatten children
    if (node.children && node.children.length > 0) {
      result.push(...flattenTree(node.children, level + 1));
    }
  }

  return result;
}

/**
 * Filter tree nodes to only show expanded branches
 * @param nodes - Flattened tree nodes
 * @param expandedIds - Set of expanded node IDs
 * @returns Filtered array showing only visible nodes
 */
export function filterExpandedNodes(
  nodes: TreeNode[],
  expandedIds: Set<string | number>
): TreeNode[] {
  const result: TreeNode[] = [];
  const parentStack: (string | number)[] = [];

  for (const node of nodes) {
    const currentLevel = node.level ?? 0;

    // Adjust parent stack to current level
    while (parentStack.length > currentLevel) {
      parentStack.pop();
    }

    // Check if this node should be visible
    const isVisible =
      currentLevel === 0 || // Root nodes always visible
      (parentStack.length > 0 && expandedIds.has(parentStack[parentStack.length - 1]));

    if (isVisible) {
      result.push(node);

      // Add to parent stack if it has children
      if (node.hasChildren && node.id !== undefined) {
        parentStack.push(node.id);
      }
    }
  }

  return result;
}

/**
 * Get all node IDs from a tree (for expand/collapse all)
 * @param nodes - Tree nodes
 * @returns Array of all node IDs
 */
export function getAllNodeIds(nodes: TreeNode[]): (string | number)[] {
  const ids: (string | number)[] = [];

  function traverse(nodeList: TreeNode[]) {
    for (const node of nodeList) {
      if (node.id !== undefined) {
        ids.push(node.id);
      }
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(nodes);
  return ids;
}

/**
 * Get IDs of nodes that have children (for selective expand all)
 * @param nodes - Tree nodes
 * @returns Array of parent node IDs
 */
export function getParentNodeIds(nodes: TreeNode[]): (string | number)[] {
  const ids: (string | number)[] = [];

  function traverse(nodeList: TreeNode[]) {
    for (const node of nodeList) {
      if (node.children && node.children.length > 0 && node.id !== undefined) {
        ids.push(node.id);
        traverse(node.children);
      }
    }
  }

  traverse(nodes);
  return ids;
}
