import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path'
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export const addAccessResourceLambda = (stack: Construct, weatherBucket: cdk.aws_s3.Bucket) => (
    new NodejsFunction(stack, "AccessResourceLambda", {
        description: "Lambda that access salt resources",
        handler: "handler",
        entry: join(__dirname, "../lambda/accessResource/index.ts"),
        runtime: Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(30),
        environment: {
            WEATHER_BUCKET_NAME: weatherBucket.bucketName,
        },
        initialPolicy: [
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:*"],
                resources: [`${weatherBucket.bucketArn}/*`, weatherBucket.bucketArn]
            }),
        ]
    }));