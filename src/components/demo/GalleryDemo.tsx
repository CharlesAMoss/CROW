/**
 * Gallery Mode Demo Page
 * Showcases fullbleed image gallery with modal viewer
 */

import { useState } from 'react';
import { GridContainer } from '../DataGrid/GridContainer';
import { mockImages, type ImageData } from '../../data/mockImages';
import type { GridConfig } from '../../types/config.types';
import type { RowData } from '../../types/grid.types';
import type { DataProvider, QueryParams, DataResponse } from '../../types/data.types';
import styles from './GalleryDemo.module.css';

export interface GalleryDemoProps {
  onNavigate?: (mode: 'nested' | 'virtual') => void;
}

/**
 * In-memory data provider for gallery images
 * Repeats images to fill screen (minimum 100 images)
 * Injects navigation cell at position 0 (first cell)
 */
class GalleryDataProvider implements DataProvider<RowData> {
  private data: ImageData[];

  constructor(data: ImageData[], _onNavigate?: (mode: 'nested' | 'virtual') => void) {
    
    // Repeat images to ensure screen is filled (aim for ~100 images)
    const repeatCount = Math.ceil(100 / data.length);
    const repeatedData: ImageData[] = [];
    
    for (let i = 0; i < repeatCount; i++) {
      data.forEach((img, idx) => {
        repeatedData.push({
          ...img,
          id: i * data.length + idx + 1, // Unique IDs
        });
      });
    }
    
    // Insert navigation cell as the first item
    this.data = [
      {
        id: 0,
        title: 'Navigation',
        imageUrl: '__NAVIGATION__', // Special marker
        thumbnailUrl: '__NAVIGATION__',
        photographer: 'CROW',
        description: 'Navigate to other demo modes',
        tags: ['navigation'],
        width: 800,
        height: 800,
        likes: 0,
        downloads: 0,
        createdAt: new Date(),
      } as ImageData,
      ...repeatedData,
    ];
  }

  async fetch(params?: QueryParams): Promise<DataResponse<RowData>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? this.data.length;
    
    return {
      data: this.data as unknown as RowData[],
      total: this.data.length,
      page,
      pageSize,
    };
  }

  async create(): Promise<RowData> {
    throw new Error('Create not supported in gallery demo');
  }

  async update(): Promise<RowData> {
    throw new Error('Update not supported in gallery demo');
  }

  async delete(): Promise<void> {
    throw new Error('Delete not supported in gallery demo');
  }
}

export function GalleryDemo({ onNavigate }: GalleryDemoProps) {
  const [dataProvider] = useState(() => new GalleryDataProvider(mockImages, onNavigate));

  const config: GridConfig<RowData> = {
    displayMode: 'fullbleed',
    rowKey: 'id',
    columns: [
      {
        key: 'imageUrl',
        header: 'Image',
        sortable: false,
        filterable: false,
      },
      {
        key: 'title',
        header: 'Title',
        sortable: true,
        filterable: true,
      },
      {
        key: 'photographer',
        header: 'Photographer',
        sortable: true,
        filterable: true,
      },
      {
        key: 'description',
        header: 'Description',
        sortable: false,
        filterable: false,
      },
      {
        key: 'tags',
        header: 'Tags',
        sortable: false,
        filterable: true,
        formatter: (value) => {
          if (Array.isArray(value)) {
            return value.join(', ');
          }
          return String(value);
        },
      },
      {
        key: 'likes',
        header: 'Likes',
        sortable: true,
        filterable: false,
        formatter: (value) => {
          const num = Number(value);
          return num.toLocaleString();
        },
      },
      {
        key: 'downloads',
        header: 'Downloads',
        sortable: true,
        filterable: false,
        formatter: (value) => {
          const num = Number(value);
          return num.toLocaleString();
        },
      },
      {
        key: 'createdAt',
        header: 'Created',
        sortable: true,
        filterable: false,
        formatter: (value) => {
          if (value instanceof Date) {
            return value.toLocaleDateString();
          }
          return String(value);
        },
      },
    ],
    features: {
      sorting: {
        enabled: true,
      },
      filtering: {
        enabled: true,
      },
      selection: {
        enabled: true,
        mode: 'multiple',
      },
    },
  };

  return (
    <div className={styles.fullbleedContainer}>
      <GridContainer<RowData>
        config={config}
        dataProvider={dataProvider}
      />
    </div>
  );
}
