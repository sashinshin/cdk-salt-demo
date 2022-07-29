import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { addResourceBucket, addStaticPageBucket } from './s3-resources';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { addAccessResourcesLambda } from './lambda-resources';


export class CdkSaltDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // dockerEnabledForSynth is neccessary when deploying lambda functions, and needs to be enabled before the lambda resources are deployed
    new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      dockerEnabledForSynth: true,
      selfMutation: true,
      dockerEnabledForSelfMutation: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sashinshin/cdk-salt-demo', 'main'), // Remember to change the name of this
        commands: ['npm ci',
          'npm run build',
          'npx cdk synth'],
      }),
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