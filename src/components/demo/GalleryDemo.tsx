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

/**
 * In-memory data provider for gallery images
 */
class GalleryDataProvider implements DataProvider<RowData> {
  private data: ImageData[];

  constructor(data: ImageData[]) {
    this.data = data;
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

export function GalleryDemo() {
  const [dataProvider] = useState(() => new GalleryDataProvider(mockImages));

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
    <div className={styles.demoPage}>
      <div className={styles.header}>
        <h1>Gallery Mode Demo</h1>
        <p className={styles.description}>
          Fullbleed image gallery with modal viewer. Click any image to view details.
          Supports filtering by title, photographer, or tags.
        </p>
      </div>

      <div className={styles.gridWrapper}>
        <GridContainer<RowData>
          config={config}
          dataProvider={dataProvider}
        />
      </div>

      <div className={styles.features}>
        <h2>Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <strong>Fullbleed Layout</strong>
            <span>CSS Grid with no gaps</span>
          </div>
          <div className={styles.featureItem}>
            <strong>Modal Viewer</strong>
            <span>Full-screen view + metadata</span>
          </div>
          <div className={styles.featureItem}>
            <strong>Responsive</strong>
            <span>Adapts to screen size</span>
          </div>
          <div className={styles.featureItem}>
            <strong>Lazy Loading</strong>
            <span>On-demand performance</span>
          </div>
          <div className={styles.featureItem}>
            <strong>Loading States</strong>
            <span>Spinner while loading</span>
          </div>
          <div className={styles.featureItem}>
            <strong>Error Handling</strong>
            <span>Graceful fallbacks</span>
          </div>
          <div className={styles.featureItem}>
            <strong>Filtering</strong>
            <span>Search & filter images</span>
          </div>
          <div className={styles.featureItem}>
            <strong>Sorting</strong>
            <span>Multi-column sorting</span>
          </div>
          <div className={styles.featureItem}>
            <strong>Selection</strong>
            <span>Multi-select support</span>
          </div>
          <div className={styles.featureItem}>
            <strong>Keyboard Nav</strong>
            <span>Tab, Enter, Escape</span>
          </div>
        </div>
      </div>

      <div className={styles.usage}>
        <h2>Quick Start</h2>
        <div className={styles.usageGrid}>
          <div className={styles.codeSection}>
            <pre><code dangerouslySetInnerHTML={{ __html: `<span class="keyword">const</span> config = {
  <span class="property">displayMode</span>: <span class="string">'fullbleed'</span>,
  <span class="property">columns</span>: [
    { <span class="property">key</span>: <span class="string">'imageUrl'</span>, <span class="property">header</span>: <span class="string">'Image'</span> },
    { <span class="property">key</span>: <span class="string">'title'</span>, <span class="property">header</span>: <span class="string">'Title'</span> }
  ]
};

&lt;<span class="component">GridContainer</span> 
  <span class="property">config</span>={config} 
  <span class="property">dataProvider</span>={provider} 
/&gt;` }} /></pre>
          </div>
          <div className={styles.explanationSection}>
            <h3>Configuration</h3>
            <p>Set <code>displayMode: 'fullbleed'</code> to enable gallery layout.</p>
            
            <h3>Image Column</h3>
            <p>Include a column with image URLs. The grid auto-detects columns with keys containing "image" or "photo".</p>
            
            <h3>Data Provider</h3>
            <p>Supply your data through a <code>DataProvider</code> with standard CRUD methods.</p>
            
            <h3>Features</h3>
            <p>Enable sorting, filtering, and selection in the <code>features</code> config object.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
