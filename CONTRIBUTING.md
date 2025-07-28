# Contributing to EventChain 🎫⛓️

We love your input! We want to make contributing to EventChain as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. **Fork the repo** and create your branch from `main`.
2. **Install dependencies** with `yarn install`.
3. **Make your changes** following our coding standards.
4. **Add tests** if you've added code that should be tested.
5. **Update documentation** if you've changed APIs.
6. **Ensure the test suite passes** with `yarn test`.
7. **Make sure your code lints** with `yarn lint`.
8. **Issue that pull request**!

## Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Yarn** (v3+)
- **Git**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/eventchain.git
cd eventchain

# Install dependencies
yarn install

# Start local blockchain
yarn chain

# Deploy contracts (in another terminal)
yarn deploy

# Start frontend
yarn dev
```

### Project Structure

```
eventchain/
├── packages/
│   ├── client/          # Next.js frontend
│   │   ├── app/         # App router pages
│   │   ├── components/  # React components
│   │   └── hooks/       # Custom hooks
│   └── contracts/       # Smart contracts
│       ├── contracts/   # Solidity files
│       ├── scripts/     # Deployment scripts
│       └── test/        # Contract tests
├── docs/               # Documentation
└── tools/              # Build tools
```

## Coding Standards

### TypeScript

- Use **TypeScript** for all new code
- Follow the existing **ESLint** configuration
- Use **interfaces** over types when possible
- Include proper **JSDoc** comments for public APIs

### React/Next.js

- Use **functional components** with hooks
- Follow the **app router** patterns
- Use **Tailwind CSS** for styling
- Implement proper **error boundaries**
- Follow **accessibility** best practices

### Smart Contracts

- Follow **Solidity style guide**
- Include comprehensive **NatSpec** documentation
- Write thorough **unit tests**
- Use **OpenZeppelin** contracts when possible
- Follow **security best practices**

### Git Workflow

- Use **conventional commits**: `type(scope): description`
- Keep commits **atomic** and focused
- Write **clear commit messages**
- **Rebase** instead of merge when possible

#### Commit Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

## Testing

### Smart Contracts

```bash
# Run contract tests
yarn workspace @eventchain/contracts test

# Run with coverage
yarn workspace @eventchain/contracts coverage
```

### Frontend

```bash
# Run frontend tests
yarn workspace @eventchain/client test

# Run with watch mode
yarn workspace @eventchain/client test:watch
```

## Reporting Bugs

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/your-org/eventchain/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please provide:

- **Clear description** of the feature
- **Use case** and motivation
- **Acceptance criteria**
- **Implementation considerations** (if any)

## Code of Conduct

### Our Pledge

We are committed to making participation in EventChain a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**

- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask questions in our [GitHub Discussions](https://github.com/your-org/eventchain/discussions) or reach out to the maintainers!

---

**Thank you for contributing to EventChain!** 🎉
