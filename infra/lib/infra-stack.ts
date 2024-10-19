import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Stage } from "../bin/infra";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export interface TodoAPIStackProps extends cdk.StackProps {
  lambdaPath: string;
  lambdaHandler: string;
  stage: Stage;
}

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: TodoAPIStackProps) {
    super(scope, id, props);

    const { stage, lambdaHandler, lambdaPath } = props;

    // DynamoDB Table
    const todoTable = new dynamodb.Table(this, "todos", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userTable = new dynamodb.Table(this, "users", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Global Secondary Index for status filtering
    userTable.addGlobalSecondaryIndex({
      indexName: "UserIndex",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });
    todoTable.addGlobalSecondaryIndex({
      indexName: "StatusIndex",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    // Lambda Function
    const todoLambda = new lambda.Function(this, `todo-handler-${stage}`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(lambdaPath),
      logRetention: cdk.aws_logs.RetentionDays.ONE_DAY,
      handler: lambdaHandler,
      functionName: `todo-handler-${stage}`,
      timeout: cdk.Duration.seconds(20),
      environment: {
        NODE_ENV: "development",
        PORT: "5001",
        SERVICE_NAME: "Todo Service",
        JWT_SECRET: "secret-key",
        JWT_EXPIRES: "10h",
        LOG_SERVICE_NAME: "todo-service",
        LOG_INLINE: "false",
        TODO_TABLE_NAME: todoTable.tableName,
        USER_TABLE_NAME: userTable.tableName,
      },
    });

    // API Gateway
    const gateWay = new apigateway.LambdaRestApi(
      this,
      `todo-api-gateway-${stage}`,
      {
        handler: todoLambda,
        deploy: true,
        proxy: true,
        deployOptions: {
          stageName: "development",
        },
      }
    );

    // Grant permissions
    todoTable.grantReadWriteData(todoLambda);
    userTable.grantReadWriteData(todoLambda);
  }
}
