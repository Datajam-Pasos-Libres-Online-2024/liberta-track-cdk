import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, } from "aws-cdk-lib/aws-s3";
import { CfnIdentityPool } from 'aws-cdk-lib/aws-cognito';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export function S3EnterpriseBucket(scope: Construct) {
    const bucket = new Bucket(scope, "Uploads", {
        bucketName: "enterprises-bucket",
        cors: [
            {
                maxAge: 3000,
                allowedOrigins: ["*"],
                allowedHeaders: ["*"],
                allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.DELETE],
            },
        ],
    });

    // Export values
    new cdk.CfnOutput(scope, "AttachmentsBucketName", {
        value: bucket.bucketName,
    });

    return bucket
}