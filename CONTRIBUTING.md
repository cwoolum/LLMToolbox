# Contributing to LLMToolbox

We welcome contributions to the LLMToolbox project! By contributing, you help make this project better for everyone. Please take a moment to review this document to make the contribution process easy and effective for everyone involved.

## How to Contribute

1. **Fork the repository**: Click the "Fork" button at the top right corner of the repository page.
2. **Clone your fork**: Clone your forked repository to your local machine using `git clone <your-fork-url>`.
3. **Create a branch**: Create a new branch for your feature or bugfix using `git checkout -b <branch-name>`.
4. **Make your changes**: Make your changes to the codebase.
5. **Add a changeset**: Document your changes with a changeset (see [Using Changesets](#using-changesets) section below).
6. **Commit your changes**: Commit your changes with a clear and descriptive commit message using `git commit -m "<commit-message>"`.
7. **Push to your fork**: Push your changes to your forked repository using `git push origin <branch-name>`.
8. **Create a pull request**: Open a pull request to the main repository. Provide a clear description of your changes and any related issues.

## Code Style

Please follow the existing code style and conventions used in the project. This helps maintain consistency and readability throughout the codebase.

## Reporting Issues

If you find any bugs or have feature requests, please open an issue on the [GitHub Issues](https://github.com/cwoolum/LLMToolbox/issues) page. Provide as much detail as possible to help us understand and address the issue.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## Using Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versions, create changelogs, and publish to npm. When you make changes that should be released, follow these steps:

1. **Install changesets** (if not already installed):
   ```sh
   npm install -g @changesets/cli
   ```

2. **Generate a changeset**:
   ```sh
   npx changeset
   ```

3. **Answer the prompts**:
   - Select the packages you've modified (use spacebar to select)
   - Choose the semver bump type (patch, minor, major)
   - Provide a summary of your changes when prompted

4. **Commit the changeset file**:
   The command will generate a Markdown file in the `.changeset` directory that should be committed with your changes.
   ```sh
   git add .changeset/*.md
   git commit -m "Add changeset for [your change description]"
   ```

5. **Include in your PR**:
   When you create your pull request, include the changeset file. This will be used to automatically update versions and generate changelog entries when your PR is merged.

### When to Create a Changeset

Create a changeset for changes that users of the library would want to know about:
- New features
- Bug fixes
- Breaking changes
- Performance improvements
- Documentation changes (only if they affect the npm package)

You don't need to create changesets for:
- Internal refactoring that doesn't affect the public API
- Changes to CI configuration
- Updates to tests that don't affect functionality

## Thank You!

Thank you for considering contributing to LLMToolbox! Your contributions are greatly appreciated.
