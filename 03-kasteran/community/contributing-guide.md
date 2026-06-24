<!--
KASTERAN* — The Last Programming Language
© Lois-Kleinner & 0-1.gg 2026. All rights reserved.

 ▄▄   ▄▄▄                                           ▄     
 ██  ██▀                         ██              ▄▄ █ ▄▄  
 ██▄██      ▄█████▄  ▄▄█████▄  ███████    ▄████▄    ██▄████   ▄█████▄  ██▄████▄   █████   
 █████      ▀ ▄▄▄██  ██▄▄▄▄ ▀    ██      ██▄▄▄▄██   ██▀       ▀ ▄▄▄██  ██▀   ██  ▀▀ █ ▀▀  
 ██  ██▄   ▄██▀▀▀██   ▀▀▀▀██▄    ██      ██▀▀▀▀▀▀   ██       ▄██▀▀▀██  ██    ██     ▀     
 ██   ██▄  ██▄▄▄███  █▄▄▄▄▄██    ██▄▄▄   ▀██▄▄▄▄█   ██       ██▄▄▄███  ██    ██           
 ▀▀    ▀▀   ▀▀▀▀ ▀▀   ▀▀▀▀▀▀      ▀▀▀▀     ▀▀▀▀▀    ▀▀        ▀▀▀▀ ▀▀  ▀▀    ▀▀           
-->

# Kasteran* — Contributing Guide
© Lois-Kleinner & 0-1.gg 2026

## Overview

Thank you for your interest in contributing to Kasteran*! This guide explains how to contribute to the project, including the PR process, coding standards, and testing requirements. All contributions are welcome, whether it is code, documentation, bug reports, or feature suggestions.

## Ways to Contribute

- **Code**: Compiler, standard library, runtime, tooling
- **Documentation**: API docs, tutorials, guides, translations
- **Bug reports**: Submitting detailed bug reports
- **Feature requests**: Suggesting and discussing improvements
- **Community support**: Helping others on forums and chat
- **Testing**: Running test suites, reporting issues
- **Reviews**: Reviewing pull requests and RFCs

## Getting Started

### Prerequisites
- Rust toolchain (for compiler bootstrapping)
- Git
- Basic understanding of the Kasteran* language

### Setup
```
git clone https://github.com/kasteran/kasteran.git
cd kasteran
cargo build --release
cargo test
```

## Contribution Workflow

### 1. Find an Issue
- Browse [GitHub Issues](https://github.com/kasteran/kasteran/issues)
- Look for `good first issue` or `help wanted` labels
- Comment on the issue to express interest

### 2. Fork and Branch
```
git checkout -b my-feature-branch
```

### 3. Make Changes
- Follow coding standards
- Write tests for new functionality
- Update documentation as needed

### 4. Test
```
cargo test              # Run all tests
cargo clippy            # Lint checks
cargo fmt              # Format check
kasteran test examples  # Example tests
```

### 5. Commit
```
git commit -m "feat: add new feature"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring
- `perf:` Performance improvements

### 6. Push and Create PR
```
git push origin my-feature-branch
```

Then create a pull request on GitHub.

## Pull Request Process

### PR Template
```markdown
## Description
Brief description of the changes

## Related Issue
Closes #1234

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring
- [ ] Performance

## Testing
- [ ] Unit tests added/passed
- [ ] Integration tests added/passed
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] Changelog entry added
- [ ] No breaking changes (or documented)
```

### Review Process
1. PR is created with template completed
2. CI checks run automatically
3. At least one reviewer is assigned
4. Reviewer provides feedback
5. Author addresses feedback
6. PR is approved and merged

## Coding Standards

### Style
- Follow Rust style guide (for compiler code)
- Follow Kasteran* style guide (for .krn examples)
- Use 4-space indentation
- Maximum line length: 100 characters
- Meaningful variable and function names

### Testing
- Unit tests for all new functionality
- Integration tests for feature workflows
- At least 80% code coverage for new code
- Edge cases and error conditions tested

### Documentation
- All public APIs must be documented
- Include examples in documentation
- Update changelog for notable changes
- Document breaking changes

## Communication

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Discord**: For real-time chat and community interaction
- **Forum**: For longer-form discussions

## Conclusion

We appreciate all contributions to Kasteran*. By following this guide, you help maintain a high-quality, consistent, and welcoming project. Thank you for contributing!
