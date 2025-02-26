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
];
