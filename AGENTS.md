# Agents Guide

## Deployment

See `./DEPLOYMENT.md` for deployment status, logs, troubleshooting, pipeline setup, and next steps.

## Overview

This file provides guidance for AI coding agents working on this project.

## Project Structure

- **Framework**: Docusaurus (static site generator)
- **Build Output**: `build/` directory
- **Infrastructure**: AWS CDK in `infra/` directory
- **Deployment**: CloudFront + S3 via `scripts/deploy.sh`

## Common Tasks

### Build the Site
```bash
npm run build
```

### Deploy to AWS
```bash
./scripts/deploy.sh
```

### Test Locally
```bash
npm run serve
```

## AWS Resources

All AWS resources are managed via CDK infrastructure in the `infra/` directory. See `DEPLOYMENT.md` for resource details and management commands.
