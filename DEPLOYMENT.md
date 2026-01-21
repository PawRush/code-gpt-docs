---
sop_name: deploy-frontend-app
repo_name: code-gpt-docs
app_name: CodeGPT
app_type: Frontend Application (Docusaurus)
branch: main
created: 2026-01-21T21:53:00Z
last_updated: 2026-01-21T22:07:00Z
---

# Deployment Summary

Your app has a CodePipeline pipeline. Changes on GitHub branch deploy-to-aws will be deployed automatically to production. This is managed by CloudFormation stack CodeGPTPipelineStack.

**Production URL**: Will be available after pipeline completes first deployment
**Preview URL**: https://d38dlm653qket6.cloudfront.net (manual deployment)

Pipeline console: https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/CodeGPTPipeline/view

Services used: CodePipeline, CodeBuild, CodeConnections, CloudFront, S3, CloudFormation, IAM

Questions? Ask your Coding Agent:
 - What resources were deployed to AWS?
 - How do I update my deployment?

## Quick Commands

```bash
# View pipeline status
aws codepipeline get-pipeline-state --name "CodeGPTPipeline" --query 'stageStates[*].[stageName,latestExecution.status]' --output table

# View build logs
aws logs tail "/aws/codebuild/CodeGPTPipelineStack-Synth" --follow

# Trigger pipeline manually
aws codepipeline start-pipeline-execution --name "CodeGPTPipeline"

# View production deployment status
aws cloudformation describe-stacks --stack-name "CodeGPTFrontend-prod" --query 'Stacks[0].StackStatus' --output text

# View preview deployment status
aws cloudformation describe-stacks --stack-name "CodeGPTFrontend-preview-sergeyka" --query 'Stacks[0].StackStatus' --output text

# Manual redeploy (preview environment)
./scripts/deploy.sh
```

## Production Readiness

For production deployments, consider:
- WAF Protection: Add AWS WAF with managed rules (Core Rule Set, Known Bad Inputs) and rate limiting
- CSP Headers: Configure Content Security Policy in CloudFront response headers (`script-src 'self'`, `frame-ancestors 'none'`)
- Custom Domain: Set up Route 53 and ACM certificate
- Monitoring: CloudWatch alarms for 4xx/5xx errors and CloudFront metrics
- Auth Redirect URLs: If using an auth provider (Auth0, Supabase, Firebase, Lovable, etc.), add your CloudFront URL to allowed redirect URLs

---

# Deployment Plan: CodeGPT Docs

Coding Agents should follow this Deployment Plan, and validate previous progress if picking up the Deployment in a new coding session.

**IMPORTANT**: Update this plan after EACH step completes. Mark the step `[x]` and update `last_updated` timestamp.

## Phase 1: Gather Context and Configure
- [x] Step 0: Inform User of Execution Flow
- [x] Step 1: Create Deployment Plan
- [x] Step 2: Create Deploy Branch
- [x] Step 3: Detect Build Configuration
- [x] Step 4: Validate Prerequisites
- [x] Step 5: Revisit Deployment Plan

## Phase 2: Build CDK Infrastructure
- [x] Step 6: Initialize CDK Foundation
- [x] Step 7: Generate CDK Stack
- [x] Step 8: Create Deployment Script
- [x] Step 9: Validate CDK Synth

## Phase 3: Deploy and Validate
- [x] Step 10: Execute CDK Deployment
- [x] Step 11: Validate CloudFormation Stack

## Phase 4: Update Documentation
- [x] Step 12: Finalize Deployment Plan
- [x] Step 13: Update README.md

## Deployment Info

- Deployment URL: https://d38dlm653qket6.cloudfront.net
- Stack name: CodeGPTFrontend-preview-sergeyka
- CloudFront Distribution ID: E194PNVP6BQW5W
- S3 Bucket Name: codegptfrontend-preview-ser-cftos3s3bucketcae9f2be-6iht8ctnqdwc
- S3 Log Bucket: codegptfrontend-preview-s-cftos3s3loggingbucket64b-3plxvpl0crxg
- CloudFront Log Bucket: codegptfrontend-preview-s-cftos3cloudfrontloggingb-szibgeowe5em
- Deployment Timestamp: 2026-01-21T22:06:45Z

## Build Configuration

- Framework: Docusaurus
- Package Manager: npm
- Build Command: `npm run build`
- Output Directory: `build/`
- Base Path: `/`
- Entry Point: `index.html`

## Recovery Guide

```bash
# Rollback
cd infra && cdk destroy "CodeGPTFrontend-preview-sergeyka"

# Redeploy
./scripts/deploy.sh
```

## Issues Encountered

None.

## Session Log

### Session 1 - 2026-01-21T21:53:00Z
Agent: Claude Sonnet 4.5
Progress: Completed all phases - deployment successful
Next: Documentation updates and finalization

---

# Pipeline Deployment Plan: CodeGPT

## Phase 1: Gather Context and Configure
- [x] Step 0: Inform User of Execution Flow
- [x] Step 1: Create Deployment Plan
- [x] Step 2: Detect Existing Infrastructure
  - [x] 2.1: Detect stacks and frontend
  - [x] 2.2: Detect app name and git repository
  - [x] 2.3: Determine quality checks
  - [x] 2.4: User confirmation
  - [x] 2.5: Create CodeConnection (using existing)

## Phase 2: Build and Deploy Pipeline
- [x] Step 3: Create CDK Pipeline Stack
- [x] Step 4: CDK Bootstrap
- [x] Step 5: Deploy Pipeline
  - [x] 5.1: Push to remote
  - [x] 5.2: Authorize CodeConnection
  - [x] 5.3: Deploy pipeline stack
  - [x] 5.4: Trigger pipeline
- [x] Step 6: Monitor Pipeline

## Phase 3: Documentation
- [x] Step 7: Finalize Deployment Plan
- [x] Step 8: Update README.md

## Pipeline Info

- CodeConnection ARN: arn:aws:codeconnections:us-east-1:126593893432:connection/c140aa0c-7407-42c9-aa4b-7c81f5faf40b (AVAILABLE)
- Repository: PawRush/code-gpt-docs
- Branch: deploy-to-aws
- Pipeline Name: CodeGPTPipeline
- Pipeline ARN: arn:aws:codepipeline:us-east-1:126593893432:CodeGPTPipeline
- Pipeline URL: https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/CodeGPTPipeline/view
- Quality Checks: None (no lint/unit tests available)

## Pipeline Recovery Guide

```bash
# Rollback
cd infra && cdk destroy CodeGPTPipelineStack --context codeConnectionArn=arn:aws:codeconnections:us-east-1:126593893432:connection/c140aa0c-7407-42c9-aa4b-7c81f5faf40b

# Redeploy pipeline
cd infra && npm run deploy:pipeline
```

## Pipeline Session Log

### Session 1 - 2026-01-21T22:10:00Z
Agent: Claude Sonnet 4.5
Progress: Completed all phases - pipeline setup successful
Next: Pipeline will automatically deploy on push to deploy-to-aws branch
