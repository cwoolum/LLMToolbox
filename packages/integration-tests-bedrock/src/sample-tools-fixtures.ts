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
