import * as cdk from 'aws-cdk-lib';
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment"
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { join } from 'path';


export class CdkSaltDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sashinshin/cdk-salt-demo', 'main'),
        commands: ['npm ci',
          'npm run build',
          'npx cdk synth'],
      }),
    });

    // const bucket = new s3.Bucket(this, 'cdk-salt-demo-bucket', {
    //   bucketName: "cdk-salt-demo-static-site",
    //   publicReadAccess: true,
    //   websiteIndexDocument: "index.html",
    // });
    
    // new s3Deploy.BucketDeployment(this, "BucketDeploy", {
    //   sources: [s3Deploy.Source.asset(join(__dirname, "../dist"))],
    //   destinationBucket: bucket,
    // })

  }
}