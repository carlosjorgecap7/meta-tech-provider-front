import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
export interface MetaTechProviderFrontendStackProps extends cdk.StackProps {
    entorno: string;
}
export declare class MetaTechProviderFrontendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: MetaTechProviderFrontendStackProps);
}
