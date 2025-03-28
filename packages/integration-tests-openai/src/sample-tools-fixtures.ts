export const sampleToolsVariants = [
  {
    name: "variant1",
    content: `
/**
 * A test function with a return type.
 * @returns {number} The result.
 */
export function testFunc(): number {
  return 42;
}
`,
  },
  {
    name: "variant2",
    content: `
/**
 * Adds two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns {number} The sum.
 */
export function add(a: number, b: number): number {
  return a + b;
}
`,
  },
  {
    name: "variant3",
    content: `
/**
 * Returns a greeting.
 * @returns {string} A greeting message.
 */
export function helloWorld(): string {
  return "Hello, world!";
}
`,
  },
  {
    name: "complex1",
    content: `
/**
 * Product category types
 */
export enum Category {
  ELECTRONICS = "electronics",
  CLOTHING = "clothing",
  BOOKS = "books",
  HOME = "home",
  TOYS = "toys"
}

/**
 * Product price range
 */
export type PriceRange = {
  /** Minimum price */
  min: number;
  /** Maximum price */
  max: number;
  /** Currency code */
  currency: string;
};

/**
 * Product inventory information
 */
export interface InventoryInfo {
  /** Quantity in stock */
  quantity: number;
  /** Warehouse location code */
  location: string;
  /** Is item on backorder */
  backorder?: boolean;
  /** Expected restock date if out of stock */
  restockDate?: Date;
}

/**
 * Find products by various criteria
 * @param categoryFilter - Product categories to include
 * @param priceRange - Price range constraints
 * @param options - Additional search options
 * @returns Matching products
 */
export function findProducts(
  categoryFilter: Category[],
  priceRange?: PriceRange,
  options?: {
    /** Text to search in product name or description */
    searchText?: string;
    /** Limit number of results */
    limit?: number;
    /** Include out of stock items */
    includeOutOfStock?: boolean;
    /** Sort products by field */
    sortBy?: "price" | "name" | "popularity";
    /** Sort order */
    sortOrder?: "asc" | "desc";
  }
): Array<{
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  inventory: InventoryInfo;
}> {
  return [{
    id: "prod123",
    name: "Sample Product",
    category: Category.ELECTRONICS,
    price: 99.99,
    description: "A sample product",
    inventory: {
      quantity: 10,
      location: "WAREHOUSE-A",
      backorder: false
    }
  }];
}
`,
  },
  {
    name: "complex2",
    content: `
/**
 * Data filtering and transformation utilities
 */
export type FilterFn<T> = (item: T) => boolean;
export type MapFn<T, R> = (item: T) => R;
export type ReduceFn<T, R> = (acc: R, item: T) => R;

/**
 * Process data through filter, map, and reduce operations
 * @param data - Input data array
 * @param options - Processing options
 * @returns Processed results
 */
export function processData<T, R = T, S = R[]>(
  data: T[],
  options: {
    /** Filter function to apply */
    filterFn?: FilterFn<T>;
    /** Map function to apply after filtering */
    mapFn?: MapFn<T, R>;
    /** Reduce function to apply after mapping */
    reduceFn?: ReduceFn<R, S>;
    /** Initial value for reduce operation */
    initialValue?: S;
  }
): S | R[] {
  let result = data;
  
  if (options.filterFn) {
    result = result.filter(options.filterFn);
  }
  
  let mappedResult: R[] = options.mapFn 
    ? result.map(options.mapFn) 
    : result as unknown as R[];
  
  if (options.reduceFn && options.initialValue !== undefined) {
    return mappedResult.reduce(options.reduceFn, options.initialValue);
  }
  
  return mappedResult;
}

/**
 * Schedule a task with configuration options
 * @param taskFn - Function to execute
 * @param schedule - Schedule configuration
 * @returns Task controller
 */
export function scheduleTask(
  taskFn: () => Promise<unknown>,
  schedule: {
    /** Task execution frequency in minutes */
    intervalMinutes: number;
    /** Maximum retries on failure */
    maxRetries?: number;
    /** Start delay in seconds */
    delaySeconds?: number;
    /** Task priority (higher runs first) */
    priority?: number;
    /** Task expiry date */
    expireAt?: Date | null;
  }
): { 
  taskId: string; 
  cancel: () => void; 
  status: () => "pending" | "running" | "completed" | "failed" | "cancelled";
} {
  return { 
    taskId: \`task-\${Date.now()}\`, 
    cancel: () => {}, 
    status: () => "pending" 
  };
}
`,
  },
  {
    name: "complex3",
    content: `
/**
 * Configuration for database operations
 */
export interface DatabaseConfig {
  /** Connection string */
  connectionString: string;
  /** Connection timeout in seconds */
  timeout?: number;
  /** Maximum connection pool size */
  maxConnections?: number;
  /** SSL connection settings */
  ssl?: {
    /** Require SSL for all connections */
    enabled: boolean;
    /** Verify server certificate */
    verifyServerCert?: boolean;
    /** Path to CA certificate */
    caPath?: string;
  };
}

/**
 * Database query options
 */
export type QueryOptions = {
  /** Transaction isolation level */
  isolationLevel?: "read_uncommitted" | "read_committed" | "repeatable_read" | "serializable";
  /** Query timeout in seconds */
  timeout?: number;
  /** Maximum rows to return */
  maxRows?: number;
  /** Include query metrics */
  includeMetrics?: boolean;
};

/**
 * Query result with metrics
 */
export type QueryResult<T = Record<string, unknown>> = {
  /** Result rows */
  rows: T[];
  /** Affected row count */
  affectedRows?: number;
  /** Query execution time in ms */
  executionTime?: number;
  /** Query execution metrics */
  metrics?: {
    /** CPU time used */
    cpuTime?: number;
    /** Memory used */
    memoryUsed?: number;
    /** Index usage information */
    indexUsage?: string[];
  };
};

/**
 * Execute a database query with parameters
 * @param query - SQL query string
 * @param params - Query parameters
 * @param config - Database configuration
 * @param options - Query options
 * @returns Query results
 */
export function executeQuery<T = Record<string, unknown>>(
  query: string,
  params: Record<string, unknown> | Array<unknown>,
  config: DatabaseConfig,
  options?: QueryOptions
): Promise<QueryResult<T>> {
  return Promise.resolve({
    rows: [] as T[],
    affectedRows: 0,
    executionTime: 0
  });
}
`,
  },
];
