import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { addResourceBucket, addStaticPageBucket } from './s3-resources';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { addAccessResourcesLambda } from './lambda-resources';


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
      dockerEnabledForSynth: true,
    });


    const resourceBucket = addResourceBucket(this);
    addStaticPageBucket(this);

    const accessResourceLambda = addAccessResourcesLambda(this, resourceBucket);

    const api = new RestApi(this, "salt-api");
    api.root
      .resourceForPath("resource")
      .addMethod("GET", new LambdaIntegration(accessResourceLambda))



  }
}