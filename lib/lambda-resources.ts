import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path'
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export const addAccessResourcesLambda = (stack: Construct, resourceBucket: cdk.aws_s3.Bucket) => (
    new NodejsFunction(stack, "AccessResourceLambda", {
        description: "Lambda that access salt resources",
        handler: "handler",
        entry: join(__dirname, "../lambda/accessResources/index.ts"),
        runtime: Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(30),
        environment: {
            RESOURCE_BUCKET_NAME: resourceBucket.bucketName,
        },
        initialPolicy: [
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:*"],
                resources: [`${resourceBucket.bucketArn}/*`, resourceBucket.bucketArn]
            }),
        ]
    }));