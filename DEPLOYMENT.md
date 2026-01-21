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

Your app is deployed to AWS! Preview URL: https://d38dlm653qket6.cloudfront.net

**Next Step: Automate Deployments**

You're currently using manual deployment. To automate deployments from GitHub, ask your coding agent to set up AWS CodePipeline using an agent SOP for pipeline creation. Try: "create a pipeline using AWS SOPs"

Services used: CloudFront, S3, CloudFormation, IAM

Questions? Ask your Coding Agent:
 - What resources were deployed to AWS?
 - How do I update my deployment?

## Quick Commands

```bash
# View deployment status
aws cloudformation describe-stacks --stack-name "CodeGPTFrontend-preview-sergeyka" --query 'Stacks[0].StackStatus' --output text

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id "E194PNVP6BQW5W" --paths "/*"

# View CloudFront access logs (last hour)
aws s3 ls "s3://codegptfrontend-preview-s-cftos3cloudfrontloggingb-szibgeowe5em/" --recursive | tail -20

# Redeploy
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
