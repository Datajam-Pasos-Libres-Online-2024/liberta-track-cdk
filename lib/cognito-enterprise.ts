import { Construct } from 'constructs';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { UserPool, AccountRecovery, VerificationEmailStyle, UserPoolClient, OAuthScope } from 'aws-cdk-lib/aws-cognito';

export function buildCognitoEnterpriseAuth (scope: Construct) {
    
    const cognito = new UserPool(scope, "liberta-track-enterprise-pool", {
        userPoolName: 'liberta-track-enterprise-pool',
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
          emailSubject: 'You need to verify your email to access LibertaTrack.',
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
  
      const userPoolClient = new UserPoolClient(scope, "liberta-track-enterprise-client", {
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
  
      new CfnOutput(scope, 'enterprise-pool-id', {
        value: cognito.userPoolId || "",
      });
  
      new CfnOutput(scope, 'enterprise-client-id', {
        value: userPoolClient.userPoolClientId ||"",
      })

    return cognito
}