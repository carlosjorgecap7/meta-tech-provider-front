import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export interface MetaTechProviderFrontendStackProps extends cdk.StackProps {
  entorno: string;
}

export class MetaTechProviderFrontendStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: MetaTechProviderFrontendStackProps,
  ) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, "FrontendSiteBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    const distribution = new cloudfront.Distribution(
      this,
      "FrontendDistribution",
      {
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
      },
    );

    new s3deploy.BucketDeployment(this, "DeployFrontendAssets", {
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
      sources: [
        s3deploy.Source.asset(
          "frontend/app/dist/meta-tech-provider-front/browser",
        ),
      ],
    });

    new cdk.CfnOutput(this, "FrontendDistributionDomain", {
      value: distribution.distributionDomainName,
      description: "CloudFront distribution domain name",
    });

    new cdk.CfnOutput(this, "FrontendBucketName", {
      value: siteBucket.bucketName,
      description: "S3 bucket hosting frontend assets",
    });
  }
}
