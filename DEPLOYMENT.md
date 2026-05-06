# Deployment Summary

Your app has a CodePipeline pipeline. Changes pushed to GitHub branch **deploy-to-aws-20260506_150212-kamielw** will be deployed automatically once the CodeConnection is authorized. This is managed by CloudFormation stack **CodeGptPipelineStack**.

**Pipeline Console:** https://eu-central-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/CodeGptPipeline/view

**Current Status:** Pipeline deployed successfully. ⚠️ **Action Required:** Authorize CodeConnection before first execution (see below).

Services used: CodePipeline, CodeBuild, CodeConnections, CloudFormation, IAM

Questions? Ask your Coding Agent:
 - How can I change the source branch?
 - What's the difference between preview and prod URLs?

## Quick Commands

```bash
# View pipeline status
aws codepipeline get-pipeline-state --name "CodeGptPipeline" --region eu-central-1 --query 'stageStates[*].[stageName,latestExecution.status]' --output table

# View build logs
aws logs tail "/aws/codebuild/CodeGptPipelineStack-Synth" --region eu-central-1 --follow

# Trigger pipeline manually
aws codepipeline start-pipeline-execution --name "CodeGptPipeline" --region eu-central-1

# Deploy to preview environment (manual)
./scripts/deploy.sh
```

## ⚠️ Required: Authorize CodeConnection

Before the pipeline can execute, you must authorize the CodeConnection with GitHub:

**Authorization URL:**
```
https://eu-central-1.console.aws.amazon.com/codesuite/settings/connections
```

**Steps:**
1. Find connection: **CodeGpt-pipeline**
2. Status should show: **PENDING**
3. Click "**Update pending connection**"
4. Click "**Install a new app**" → Select your GitHub account
5. Authorize AWS Connector for GitHub
6. Grant access to repository: **PawRush/code-gpt-docs**
7. Verify status changes to: **AVAILABLE**

**Verify authorization:**
```bash
aws codeconnections get-connection --connection-arn "arn:aws:codeconnections:eu-central-1:189681391221:connection/d9ee5315-7c13-49bf-b739-8e2900df6fe9" --region eu-central-1 --query 'Connection.ConnectionStatus' --output text
```

Expected output: `AVAILABLE`

**After authorization:** Push a commit to trigger the pipeline:
```bash
git push origin deploy-to-aws-20260506_150212-kamielw
```

---

# Pipeline Deployment Details

## Configuration

**CodeConnection ARN**: arn:aws:codeconnections:eu-central-1:189681391221:connection/d9ee5315-7c13-49bf-b739-8e2900df6fe9  
**Branch**: deploy-to-aws-20260506_150212-kamielw  
**Repository**: PawRush/code-gpt-docs  
**Region**: eu-central-1  
**Account**: 189681391221  
**Package Manager**: npm  
**App Name**: CodeGpt  
**Pipeline Name**: CodeGptPipeline  
**Stack Name**: CodeGptPipelineStack

## Pipeline Stages

1. **Source**: Pull from GitHub via CodeConnection (triggers on push)
2. **Build (Synth)**: 
   - Install dependencies (npm install)
   - Run secret scanning (@secretlint/quick-start)
   - Build frontend (npm run build)
   - Synthesize CDK (cdk synth)
3. **UpdatePipeline**: Self-mutation (updates pipeline if infrastructure changes)
4. **Assets**: Publish CDK assets to S3
5. **Deploy**: Deploy CodeGPTFrontend-prod stack
   - CloudFront distribution
   - S3 bucket with content
   - Security policies and logging

## Deployment History

### 2026-05-06 - Pipeline Setup Completed

**Phase 1: Gather Context and Configure** ✅

- Detected infrastructure: FrontendStack (Docusaurus v2.4.0)
- No backend/Lambda functions
- No lint/test scripts configured
- Package manager: npm
- Created new CodeConnection (old one in ERROR state)

**Phase 2: Build and Deploy Pipeline** ✅

- Created CDK Pipeline Stack
- Bootstrapped CDK environment
- Deployed CodeGptPipelineStack successfully
- Pipeline triggered automatically (failed at Source - authorization pending)

**Phase 3: Documentation** ✅

- Created DEPLOYMENT.md
- Updated README.md with pipeline section

## Production Deployment

The pipeline deploys to **prod** environment when changes are pushed to the configured branch.

**Production Stack**: CodeGPTFrontend-prod  
**CloudFront Distribution**: (will be created on first successful pipeline run)  
**S3 Bucket**: (will be created on first successful pipeline run)

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| Pipeline failed at Source | CodeConnection not authorized | Visit https://eu-central-1.console.aws.amazon.com/codesuite/settings/connections and authorize CodeGpt-pipeline |
| Pipeline failed at Build/Synth | Build errors, CDK synth errors | View logs: `aws logs tail "/aws/codebuild/CodeGptPipelineStack-Synth" --region eu-central-1 --follow` |
| Stack deployment failed | IAM permissions, resource conflicts | View events: `aws cloudformation describe-stack-events --stack-name "CodeGPTFrontend-prod" --region eu-central-1` |
| Self-mutation loop | Non-deterministic synth output | Ensure CDK synth produces identical output each run |
| Stale content after deploy | CloudFront cache | Get distribution ID from stack outputs, then invalidate: `aws cloudfront create-invalidation --distribution-id "<ID>" --paths "/*"` |

## Manual Deployment

For testing or emergency deployments, you can still deploy manually:

```bash
# Preview environment (your personal stack)
./scripts/deploy.sh

# Production environment (via pipeline only - don't deploy manually)
```

## Pipeline Management

**View pipeline:**
```bash
aws codepipeline get-pipeline --name "CodeGptPipeline" --region eu-central-1
```

**Stop execution:**
```bash
aws codepipeline stop-pipeline-execution --pipeline-name "CodeGptPipeline" --pipeline-execution-id "<execution-id>" --region eu-central-1 --abandon
```

**Delete pipeline:**
```bash
cd infra
npm run destroy:pipeline
```

---

Created with the [setup-pipeline] Agent Standard Operation Procedure from the [AWS MCP](https://docs.aws.amazon.com/aws-mcp/latest/userguide/what-is-mcp-server.html).
