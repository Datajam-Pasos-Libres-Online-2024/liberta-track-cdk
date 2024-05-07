import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { buildCognitoEnterpriseAuth } from './cognito-enterprise';
import { buildCognitoConsumerAuth } from './cognito-consumer';

export class LibertaTrackCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cognitoEnterprise = buildCognitoEnterpriseAuth(this)
    const cognitoEConsumer = buildCognitoConsumerAuth(this)

  }
}