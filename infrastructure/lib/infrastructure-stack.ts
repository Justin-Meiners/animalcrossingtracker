import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const critterTable = new dynamodb.Table(this, 'CritterTable', {
      tableName: 'Critters',
      partitionKey: { name: 'critter_type', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const catchTable = new dynamodb.Table(this, 'CatchTable', {
      tableName: 'Catches',
      partitionKey: { name: 'user_id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'critter_key', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const userPool = new cognito.UserPool(this, 'CritterUserPool', {
      selfSignUpEnabled: true,
      signInAliases: { username: true, email: true },
      autoVerify: { email: true },
      passwordPolicy: { minLength: 8 },
    });

    const userPoolClient = userPool.addClient('CritterWebClient', {
      authFlows: { userSrp: true },
    });

    const getCrittersFn = new lambda.Function(this, 'GetCrittersFn', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../backend/lambdas/getCritters')
      ),
      environment: {
        CRITTER_TABLE: critterTable.tableName,
      },
    });

    const catchesFn = new lambda.Function(this, 'CatchesFn', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../backend/lambdas/Catches')
      ),
      environment: {
        CATCH_TABLE: catchTable.tableName,
      },
    });

    critterTable.grantReadData(getCrittersFn);
    catchTable.grantReadWriteData(catchesFn);

    const httpApi = new apigwv2.HttpApi(this, 'CritterApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.PUT, apigwv2.CorsHttpMethod.DELETE],
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    const cognitoAuthorizer = new HttpJwtAuthorizer(
      'CognitoAuthorizer',
      `https://cognito-idp.us-east-1.amazonaws.com/${userPool.userPoolId}`,
      { jwtAudience: [userPoolClient.userPoolClientId] },
    );

    httpApi.addRoutes({
      path: '/critters/{type}',
      methods: [apigwv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetCrittersIntegration', getCrittersFn),
    });

    httpApi.addRoutes({
      path: '/catches',
      methods: [apigwv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetCatchesIntegration', catchesFn),
      authorizer: cognitoAuthorizer,
    });

    httpApi.addRoutes({
      path: '/catches/{critterKey}',
      methods: [apigwv2.HttpMethod.PUT, apigwv2.HttpMethod.DELETE],
      integration: new HttpLambdaIntegration('MutateCatchesIntegration', catchesFn),
      authorizer: cognitoAuthorizer,
    });

    new cdk.CfnOutput(this, 'ApiUrl', { value: httpApi.apiEndpoint });
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'CritterTableName', { value: critterTable.tableName });
    new cdk.CfnOutput(this, 'CatchTableName', { value: catchTable.tableName });
  }
}
