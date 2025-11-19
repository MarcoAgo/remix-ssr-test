# AWS Deployment Guide

This guide covers deploying the React Router SSR application to AWS using multiple deployment options.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured (`aws configure`)
- Docker installed (for container-based deployments)
- Node.js 24+ installed locally (for building)

## Environment Variables

Before deploying, ensure you have the following environment variables configured (if needed):

```bash
# Example environment variables
NODE_ENV=production
# Add any API keys or configuration here
```

## Option 1: AWS Lambda + API Gateway (Serverless - Recommended)

This option provides a cost-effective, auto-scaling solution with pay-per-request pricing.

**Note**: Ensure that AWS Lambda supports Node.js 24 runtime (`nodejs24.x`) in your target region. If not available, you may need to use a container image deployment or wait for AWS to add support. As of this writing, check [AWS Lambda Runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) for the latest supported versions.

### Prerequisites

- AWS SAM CLI installed (`brew install aws-sam-cli` or `pip install aws-sam-cli`)
- Or use AWS CDK/Serverless Framework

### Steps

#### 1. Create Lambda Handler

Create a Lambda handler wrapper for React Router SSR:

```typescript
// lambda-handler.ts
import { createRequestHandler } from "@react-router/node";

export const handler = createRequestHandler({
  build: require("./build/server/index.js"),
  mode: process.env.NODE_ENV || "production",
});
```

#### 2. Build for Lambda

```bash
npm run build
```

#### 3. Package for Lambda

Create a deployment package:

```bash
# Create deployment directory
mkdir -p lambda-deploy
cp -r build lambda-deploy/
cp package.json package-lock.json lambda-deploy/
cd lambda-deploy
npm ci --omit=dev
zip -r ../lambda-deployment.zip .
```

#### 4. Deploy via AWS CLI

```bash
# Create Lambda function
aws lambda create-function \
  --function-name jobs-board-ssr \
  --runtime nodejs24.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://lambda-deployment.zip \
  --timeout 30 \
  --memory-size 512

# Create Function URL (simpler than API Gateway)
aws lambda create-function-url-config \
  --function-name jobs-board-ssr \
  --auth-type NONE \
  --cors '{"AllowOrigins": ["*"], "AllowMethods": ["*"], "AllowHeaders": ["*"]}'
```

#### 5. Alternative: Use AWS SAM

Create `template.yaml`:

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  JobsBoardFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: build/
      Handler: index.handler
      Runtime: nodejs24.x
      Timeout: 30
      MemorySize: 512
      Events:
        Api:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY
```

Deploy:

```bash
sam build
sam deploy --guided
```

### Benefits

- Pay only for requests
- Auto-scaling
- No server management
- Cost-effective for low to medium traffic

### Limitations

- Cold starts (mitigated with provisioned concurrency)
- 15-minute maximum execution time
- Memory and package size limits

---

## Option 2: AWS ECS/Fargate (Container-based)

Best for production workloads requiring predictable performance and full control.

### Prerequisites

- Docker installed
- AWS ECR repository created
- ECS cluster created

### Steps

#### 1. Build Docker Image

```bash
docker build -t jobs-board-ssr .
```

#### 2. Tag and Push to ECR

```bash
# Get ECR login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repository (if not exists)
aws ecr create-repository --repository-name jobs-board-ssr --region us-east-1

# Tag image
docker tag jobs-board-ssr:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/jobs-board-ssr:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/jobs-board-ssr:latest
```

#### 3. Create ECS Task Definition

Create `ecs-task-definition.json`:

```json
{
  "family": "jobs-board-ssr",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "jobs-board-ssr",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/jobs-board-ssr:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/jobs-board-ssr",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### 4. Register Task Definition

```bash
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json
```

#### 5. Create ECS Service

```bash
aws ecs create-service \
  --cluster your-cluster-name \
  --service-name jobs-board-ssr \
  --task-definition jobs-board-ssr \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/jobs-board/xxx,containerName=jobs-board-ssr,containerPort=3000"
```

#### 6. Set Up Application Load Balancer

1. Create Target Group pointing to port 3000
2. Create Application Load Balancer
3. Add listener on port 80/443
4. Configure health check: `GET /` (or create a health check endpoint)

### Benefits

- Full control over infrastructure
- Predictable performance
- No cold starts
- Suitable for high-traffic applications

### Cost Considerations

- Pay for running tasks 24/7
- Consider using Auto Scaling to adjust based on demand

---

## Option 3: AWS App Runner

Simplified container deployment with automatic scaling and load balancing.

### Prerequisites

- Docker image in ECR (follow steps 1-2 from ECS section)

### Steps

#### 1. Create App Runner Service via Console

1. Go to AWS App Runner console
2. Click "Create service"
3. Choose "Source code repository" or "Container image"
4. If using container image:
   - Select your ECR image
   - Choose "Deploy now"
5. Configure:
   - Service name: `jobs-board-ssr`
   - CPU: 1 vCPU
   - Memory: 2 GB
   - Port: 3000
   - Health check: `/`
6. Create service

#### 2. Deploy via AWS CLI

```bash
aws apprunner create-service \
  --service-name jobs-board-ssr \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/jobs-board-ssr:latest",
      "ImageConfiguration": {
        "Port": "3000"
      },
      "ImageRepositoryType": "ECR"
    },
    "AutoDeploymentsEnabled": true
  }' \
  --instance-configuration '{
    "Cpu": "1 vCPU",
    "Memory": "2 GB"
  }' \
  --health-check-configuration '{
    "Protocol": "HTTP",
    "Path": "/",
    "Interval": 10,
    "Timeout": 5,
    "HealthyThreshold": 1,
    "UnhealthyThreshold": 5
  }'
```

### Benefits

- Easy setup
- Automatic scaling
- Built-in load balancing
- Managed service

### Limitations

- Less control than ECS
- Slightly higher cost than Lambda for low traffic

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Build application
        run: npm ci && npm run build

      - name: Build Docker image
        run: docker build -t jobs-board-ssr .

      - name: Login to ECR
        run: |
          aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com

      - name: Push to ECR
        run: |
          docker tag jobs-board-ssr:latest ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/jobs-board-ssr:latest
          docker push ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/jobs-board-ssr:latest

      - name: Update ECS service
        run: |
          aws ecs update-service --cluster your-cluster --service jobs-board-ssr --force-new-deployment
```

---

## Health Check Endpoint

Add a health check route for load balancers:

```typescript
// app/routes/health.tsx
export async function loader() {
  return new Response("OK", { status: 200 });
}
```

Update routes:

```typescript
route("health", "routes/health.tsx");
```

---

## Monitoring and Logging

### CloudWatch Logs

All deployment options support CloudWatch Logs:

- **Lambda**: Automatic log group creation
- **ECS**: Configured via task definition
- **App Runner**: Automatic logging

### CloudWatch Metrics

Monitor:

- Request count
- Error rate
- Response time
- Memory usage (Lambda/ECS)

### Set Up Alarms

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name jobs-board-high-error-rate \
  --alarm-description "Alert when error rate exceeds 5%" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

---

## Security Best Practices

### IAM Roles

1. **Lambda**: Create execution role with minimal permissions
2. **ECS**: Use task execution role with ECR read permissions
3. **App Runner**: Automatic IAM role creation

### VPC Configuration

- For ECS: Place tasks in private subnets
- Use NAT Gateway for outbound internet access
- Configure security groups to allow only necessary traffic

### Environment Variables

- Use AWS Secrets Manager or Parameter Store for sensitive data
- Never commit secrets to version control

### HTTPS

- Use AWS Certificate Manager (ACM) for SSL certificates
- Configure Application Load Balancer with HTTPS listener
- Redirect HTTP to HTTPS

---

## Cost Optimization Tips

### Lambda

- Use provisioned concurrency only if needed (reduces cold starts but increases cost)
- Right-size memory allocation (affects CPU and cost)
- Consider Lambda@Edge for global distribution

### ECS/Fargate

- Use Auto Scaling to scale down during low-traffic periods
- Consider Spot instances for non-critical workloads
- Right-size CPU and memory allocation

### App Runner

- Monitor usage and adjust instance size
- Use auto-scaling to scale down when not needed

---

## Troubleshooting

### Common Issues

#### Lambda Cold Starts

**Problem**: First request is slow  
**Solution**: Use provisioned concurrency or Lambda@Edge

#### ECS Tasks Not Starting

**Problem**: Tasks fail to start  
**Solution**:

- Check CloudWatch Logs
- Verify IAM permissions
- Check security group rules
- Verify ECR image accessibility

#### App Runner Health Check Failures

**Problem**: Service shows as unhealthy  
**Solution**:

- Verify health check path exists
- Check container logs
- Ensure port configuration matches application

### Debug Commands

```bash
# View Lambda logs
aws logs tail /aws/lambda/jobs-board-ssr --follow

# View ECS task logs
aws logs tail /ecs/jobs-board-ssr --follow

# Check ECS service status
aws ecs describe-services --cluster your-cluster --services jobs-board-ssr

# View App Runner logs
aws apprunner list-operations --service-arn YOUR_SERVICE_ARN
```

---

## Recommended Architecture

For production, consider:

```
Internet
  ↓
CloudFront (CDN) ← Optional but recommended
  ↓
Application Load Balancer (HTTPS)
  ↓
ECS Fargate Tasks (Auto-scaling)
  ↓
RDS/ElastiCache (if needed for data)
```

---

## Next Steps

1. Choose deployment option based on your requirements
2. Set up CI/CD pipeline
3. Configure monitoring and alerts
4. Set up backup and disaster recovery procedures
5. Implement security best practices
6. Load test your deployment

---

## Additional Resources

- [React Router Deployment Guide](https://reactrouter.com/docs/guides/deployment)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html)
- [App Runner Documentation](https://docs.aws.amazon.com/apprunner/)
