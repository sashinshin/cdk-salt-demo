import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment"
import { Construct } from 'constructs';
import { join } from 'path';

export const addResourceBucket = (stack: Construct): s3.Bucket => {
    const resourcesS3 = new s3.Bucket(stack, 'ResourceS3', {
        bucketName: "resource-s3-salt-demo-sdk", // All bucket names are unique
    })

    new s3Deploy.BucketDeployment(stack, "ResourceS3Deploy", {
        sources: [s3Deploy.Source.asset(join(__dirname, "../resource-dist"))],
        destinationBucket: resourcesS3,
    });

    return resourcesS3
};

export const addStaticPageBucket = (stack: Construct): s3.Bucket => {
    const staticPageS3 = new s3.Bucket(stack, 'StaticPageS3', {
        bucketName: "salt-demo-cdk-static-page-213412",
        publicReadAccess: true,
        websiteIndexDocument: "index.html",
        cors: [
            {
                allowedMethods: [
                    s3.HttpMethods.GET,
                ],
                allowedOrigins: ['*'],
                allowedHeaders: ['*'],
            },
        ]
    });
    new s3Deploy.BucketDeployment(stack, "StaticPageS3Deploy", {
        sources: [s3Deploy.Source.asset(join(__dirname, "../website-dist"))],
        destinationBucket: staticPageS3,
    });

    return staticPageS3;
};
