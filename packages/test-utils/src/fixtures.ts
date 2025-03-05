/**
 * Shared test fixtures for all frameworks
 */

export interface TestVariant {
  name: string;
  content: string;
}

/**
 * Basic test fixtures shared by all frameworks
 */
export const baseTestVariants: TestVariant[] = [
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
    name: "destructuredParam",
    content: `
/**
 * Reads a file from the given path.
 * @param filePath - Path to the file to read.
 * @returns {Promise<string | undefined>} The file contents or undefined if there was an error.
 */
export async function getFile({
  filePath
}: {
  filePath: string;
}): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    console.error(\`Error reading file \${filePath}:\`, error);
    return undefined;
  }
}
`,
  },
];

/**
 * Complex test fixtures for Anthropic and Bedrock frameworks
 */
export const anthropicComplexVariants: TestVariant[] = [
  {
    name: "complex1",
    content: `
/**
 * User roles in the system
 */
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest"
}

/**
 * User account information
 */
export interface UserAccount {
  /** Unique user identifier */
  id: string;
  /** User's display name */
  name: string;
  /** User's email address */
  email: string;
  /** User's assigned role */
  role: UserRole;
  /** Account creation date */
  createdAt: Date;
  /** Optional account settings */
  settings?: {
    /** Email notification preferences */
    notifications: boolean;
    /** Dark mode preference */
    darkMode?: boolean;
    /** Language preference */
    language: string;
  };
}

/**
 * Create a new user account
 * @param name - User's display name
 * @param email - User's email address
 * @param role - User's role in the system
 * @param settings - Optional account settings
 * @returns The newly created user account
 */
export function createUserAccount(
  name: string,
  email: string,
  role: UserRole = UserRole.USER,
  settings?: {
    notifications?: boolean;
    darkMode?: boolean;
    language?: string;
  }
): UserAccount {
  return {
    id: \`user-\${Date.now()}\`,
    name,
    email,
    role,
    createdAt: new Date(),
    settings: {
      notifications: settings?.notifications ?? true,
      darkMode: settings?.darkMode,
      language: settings?.language ?? 'en-US'
    }
  };
}
`,
  },
  {
    name: "complex2",
    content: `
/**
 * Search query parameters
 */
export type SearchParams = {
  /** Search query string */
  query: string;
  /** Maximum results to return */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Filter by specific categories */
  categories?: string[];
  /** Sort direction */
  sortDirection?: "asc" | "desc";
  /** Advanced filter options */
  filters?: Record<string, string | number | boolean | null>;
};

/**
 * Search result item
 */
export type SearchResult = {
  /** Item identifier */
  id: string;
  /** Item title */
  title: string;
  /** Relevance score */
  score: number;
  /** Item metadata */
  metadata: Record<string, unknown>;
};

/**
 * Search for items matching query parameters
 * @param params - Search parameters and filters
 * @returns Search results with pagination info
 */
export function search(params: SearchParams): {
  results: SearchResult[];
  totalResults: number;
  page: number;
  totalPages: number;
} {
  return {
    results: [
      {
        id: "item1",
        title: "Sample Item",
        score: 0.95,
        metadata: { type: "example" }
      }
    ],
    totalResults: 1,
    page: params.page ?? 1,
    totalPages: 1
  };
}
`,
  },
];

/**
 * Complex test fixtures specific to OpenAI framework
 */
export const openaiComplexVariants: TestVariant[] = [
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
  
  const mappedResult: R[] = options.mapFn 
    ? result.map(item => options.mapFn!(item)) 
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

/**
 * Expected function names for various test variants
 */
export const expectedFunctionNames: Record<string, string> = {
  variant1: "testFunc",
  variant2: "add",
  variant3: "helloWorld",
  destructuredParam: "getFile",
  complex1: "createUserAccount", // Anthropic & Bedrock
  complex2: "search", // Anthropic & Bedrock
};

/**
 * Expected function names for OpenAI test variants
 */
export const openaiExpectedFunctionNames: Record<string, string> = {
  variant1: "testFunc",
  variant2: "add",
  variant3: "helloWorld",
  destructuredParam: "getFile",
  complex1: "findProducts",
  complex2: "processData",
  complex3: "executeQuery",
};

/**
 * Get all test variants for a specific framework
 * @param framework Framework name (openai, anthropic, bedrock, langchain)
 * @returns Array of test variants for the specified framework
 */
export function getTestVariantsForFramework(framework: string): TestVariant[] {
  // Base variants for all frameworks
  const variants = [...baseTestVariants];
  
  if (framework === "openai") {
    return [...variants, ...openaiComplexVariants];
  } else if (framework === "anthropic" || framework === "bedrock") {
    return [...variants, ...anthropicComplexVariants];
  }
  
  // Default to base variants for langchain
  return variants;
}

/**
 * Get expected function names for a specific framework
 * @param framework Framework name
 * @returns Record of expected function names for each variant
 */
export function getExpectedFunctionNames(framework: string): Record<string, string> {
  if (framework === "openai") {
    return openaiExpectedFunctionNames;
  }
  
  return expectedFunctionNames;
}