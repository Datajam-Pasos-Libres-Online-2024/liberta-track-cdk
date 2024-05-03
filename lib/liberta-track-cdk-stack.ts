import * as cdk from 'aws-cdk-lib';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { UserPool, AccountRecovery, VerificationEmailStyle, UserPoolClient, OAuthScope } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class LibertaTrackCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cognito = new UserPool(this, "LibertaTrackUserPool", {
      signInAliases: {
        email: true,
        username: false
      },
      selfSignUpEnabled: true,
      standardAttributes: {
        email: {
          required: true
        },
        givenName: {
          required: true,
          mutable: true
        },
        familyName: {
          required: true,
          mutable: true
        }
      },
      autoVerify: { email: true },
      userVerification: {
        emailSubject: 'You need to verify your email for the playground',
        emailBody: 'Thanks for signing up Your verification code is {####}',
        emailStyle: VerificationEmailStyle.CODE,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const userPoolClient = new UserPoolClient(this, "LibertaTrackClient", {
      userPool: cognito,
      authFlows: {
        userPassword: true,
        userSrp: true
      },
      generateSecret: false,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
        callbackUrls: ["http://localhost:3000"]
      },
    });

    new CfnOutput(this, 'UserPoolId', {
      value: cognito.userPoolId || "",
    });

    new CfnOutput(this, 'userPoolClientId', {
      value: userPoolClient.userPoolClientId ||"",
    })

  }
}
