#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MetaTechProviderFrontendStack } from "../lib/frontend-stack";

const app = new cdk.App();

const entorno: string = app.node.tryGetContext("entorno") ?? "dev";
const rawCostCenter: string | undefined = app.node.tryGetContext("cost_center");
const costCenter =
  rawCostCenter && rawCostCenter !== "PENDING" ? rawCostCenter : "PENDING";

if (costCenter === "PENDING") {
  process.stderr.write(
    "\nWARNING: 'cost_center' context value is missing or PENDING.\n" +
      "Pass it with: --context cost_center=<VALUE>\n\n",
  );
}

const qualifier = "mtpdevfrt";

const synthesizer = new cdk.DefaultStackSynthesizer({
  qualifier,
  bootstrapStackVersionSsmParameter: `/cdk-bootstrap/${qualifier}/version`,
  fileAssetsBucketName: `cdk-${qualifier}-assets-\${AWS::AccountId}-\${AWS::Region}`,
  imageAssetsRepositoryName: `cdk-${qualifier}-container-assets-\${AWS::AccountId}-\${AWS::Region}`,
  deployRoleArn: `arn:\${AWS::Partition}:iam::\${AWS::AccountId}:role/cdk-${qualifier}-deploy-role-\${AWS::AccountId}-\${AWS::Region}`,
  cloudFormationExecutionRole: `arn:\${AWS::Partition}:iam::\${AWS::AccountId}:role/cdk-${qualifier}-cfn-exec-role-\${AWS::AccountId}-\${AWS::Region}`,
  fileAssetPublishingRoleArn: `arn:\${AWS::Partition}:iam::\${AWS::AccountId}:role/cdk-${qualifier}-file-publishing-role-\${AWS::AccountId}-\${AWS::Region}`,
  imageAssetPublishingRoleArn: `arn:\${AWS::Partition}:iam::\${AWS::AccountId}:role/cdk-${qualifier}-image-publishing-role-\${AWS::AccountId}-\${AWS::Region}`,
  lookupRoleArn: `arn:\${AWS::Partition}:iam::\${AWS::AccountId}:role/cdk-${qualifier}-lookup-role-\${AWS::AccountId}-\${AWS::Region}`,
  bucketPrefix: "",
  generateBootstrapVersionRule: false,
});

const stack = new MetaTechProviderFrontendStack(
  app,
  "MetaTechProviderFrontendStack",
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION ?? "eu-west-1",
    },
    entorno,
    stackName: `meta-tech-provider-front-${entorno}`,
    description: "Meta Tech Provider Frontend - S3 + CloudFront",
    synthesizer,
    analyticsReporting: false,
  },
);

const mandatoryTags: Record<string, string> = {
  owner: "capgemini-dcx",
  autor_infra: "ignacio.ferrer-sanz",
  proyecto: "meta-tech-provider-front",
  cliente: "mapfre",
  cost_center: costCenter,
  entorno,
  ecr: "shared",
};

for (const [key, value] of Object.entries(mandatoryTags)) {
  cdk.Tags.of(stack).add(key, value);
}

app.synth();
