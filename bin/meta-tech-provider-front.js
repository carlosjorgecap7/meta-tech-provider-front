#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = __importStar(require("aws-cdk-lib"));
const frontend_stack_1 = require("../lib/frontend-stack");
const app = new cdk.App();
const entorno = app.node.tryGetContext("entorno") ?? "dev";
const rawCostCenter = app.node.tryGetContext("cost_center");
const costCenter = rawCostCenter && rawCostCenter !== "PENDING" ? rawCostCenter : "PENDING";
if (costCenter === "PENDING") {
    process.stderr.write("\nWARNING: 'cost_center' context value is missing or PENDING.\n" +
        "Pass it with: --context cost_center=<VALUE>\n\n");
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
const stack = new frontend_stack_1.MetaTechProviderFrontendStack(app, "MetaTechProviderFrontendStack", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION ?? "eu-west-1",
    },
    entorno,
    stackName: `meta-tech-provider-front-${entorno}`,
    description: "Meta Tech Provider Frontend - S3 + CloudFront",
    synthesizer,
    analyticsReporting: false,
});
const mandatoryTags = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS10ZWNoLXByb3ZpZGVyLWZyb250LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWV0YS10ZWNoLXByb3ZpZGVyLWZyb250LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsaURBQW1DO0FBQ25DLDBEQUFzRTtBQUV0RSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLE9BQU8sR0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLENBQUM7QUFDbkUsTUFBTSxhQUFhLEdBQXVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2hGLE1BQU0sVUFBVSxHQUNkLGFBQWEsSUFBSSxhQUFhLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUUzRSxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUUsQ0FBQztJQUM3QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDbEIsaUVBQWlFO1FBQy9ELGlEQUFpRCxDQUNwRCxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQztBQUU5QixNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztJQUNsRCxTQUFTO0lBQ1QsaUNBQWlDLEVBQUUsa0JBQWtCLFNBQVMsVUFBVTtJQUN4RSxvQkFBb0IsRUFDbEIsT0FBTyxTQUFTLDRDQUE0QztJQUM5RCx5QkFBeUIsRUFDdkIsT0FBTyxTQUFTLHNEQUFzRDtJQUN4RSxhQUFhLEVBQ1gsMkRBQTJELFNBQVMsaURBQWlEO0lBQ3ZILDJCQUEyQixFQUN6QiwyREFBMkQsU0FBUyxtREFBbUQ7SUFDekgsMEJBQTBCLEVBQ3hCLDJEQUEyRCxTQUFTLDBEQUEwRDtJQUNoSSwyQkFBMkIsRUFDekIsMkRBQTJELFNBQVMsMkRBQTJEO0lBQ2pJLGFBQWEsRUFDWCwyREFBMkQsU0FBUyxpREFBaUQ7SUFDdkgsWUFBWSxFQUFFLEVBQUU7SUFDaEIsNEJBQTRCLEVBQUUsS0FBSztDQUNwQyxDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLDhDQUE2QixDQUM3QyxHQUFHLEVBQ0gsK0JBQStCLEVBQy9CO0lBQ0UsR0FBRyxFQUFFO1FBQ0gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO1FBQ3hDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLFdBQVc7S0FDdEQ7SUFDRCxPQUFPO0lBQ1AsU0FBUyxFQUFFLDRCQUE0QixPQUFPLEVBQUU7SUFDaEQsV0FBVyxFQUFFLCtDQUErQztJQUM1RCxXQUFXO0lBQ1gsa0JBQWtCLEVBQUUsS0FBSztDQUMxQixDQUNGLENBQUM7QUFFRixNQUFNLGFBQWEsR0FBMkI7SUFDNUMsS0FBSyxFQUFFLGVBQWU7SUFDdEIsV0FBVyxFQUFFLHFCQUFxQjtJQUNsQyxRQUFRLEVBQUUsMEJBQTBCO0lBQ3BDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLFdBQVcsRUFBRSxVQUFVO0lBQ3ZCLE9BQU87SUFDUCxHQUFHLEVBQUUsUUFBUTtDQUNkLENBQUM7QUFFRixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO0lBQ3pELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUVELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xyXG5pbXBvcnQgeyBNZXRhVGVjaFByb3ZpZGVyRnJvbnRlbmRTdGFjayB9IGZyb20gXCIuLi9saWIvZnJvbnRlbmQtc3RhY2tcIjtcclxuXHJcbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XHJcblxyXG5jb25zdCBlbnRvcm5vOiBzdHJpbmcgPSBhcHAubm9kZS50cnlHZXRDb250ZXh0KFwiZW50b3Jub1wiKSA/PyBcImRldlwiO1xyXG5jb25zdCByYXdDb3N0Q2VudGVyOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBhcHAubm9kZS50cnlHZXRDb250ZXh0KFwiY29zdF9jZW50ZXJcIik7XHJcbmNvbnN0IGNvc3RDZW50ZXIgPVxyXG4gIHJhd0Nvc3RDZW50ZXIgJiYgcmF3Q29zdENlbnRlciAhPT0gXCJQRU5ESU5HXCIgPyByYXdDb3N0Q2VudGVyIDogXCJQRU5ESU5HXCI7XHJcblxyXG5pZiAoY29zdENlbnRlciA9PT0gXCJQRU5ESU5HXCIpIHtcclxuICBwcm9jZXNzLnN0ZGVyci53cml0ZShcclxuICAgIFwiXFxuV0FSTklORzogJ2Nvc3RfY2VudGVyJyBjb250ZXh0IHZhbHVlIGlzIG1pc3Npbmcgb3IgUEVORElORy5cXG5cIiArXHJcbiAgICAgIFwiUGFzcyBpdCB3aXRoOiAtLWNvbnRleHQgY29zdF9jZW50ZXI9PFZBTFVFPlxcblxcblwiLFxyXG4gICk7XHJcbn1cclxuXHJcbmNvbnN0IHF1YWxpZmllciA9IFwibXRwZGV2ZnJ0XCI7XHJcblxyXG5jb25zdCBzeW50aGVzaXplciA9IG5ldyBjZGsuRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xyXG4gIHF1YWxpZmllcixcclxuICBib290c3RyYXBTdGFja1ZlcnNpb25Tc21QYXJhbWV0ZXI6IGAvY2RrLWJvb3RzdHJhcC8ke3F1YWxpZmllcn0vdmVyc2lvbmAsXHJcbiAgZmlsZUFzc2V0c0J1Y2tldE5hbWU6XHJcbiAgICBgY2RrLSR7cXVhbGlmaWVyfS1hc3NldHMtXFwke0FXUzo6QWNjb3VudElkfS1cXCR7QVdTOjpSZWdpb259YCxcclxuICBpbWFnZUFzc2V0c1JlcG9zaXRvcnlOYW1lOlxyXG4gICAgYGNkay0ke3F1YWxpZmllcn0tY29udGFpbmVyLWFzc2V0cy1cXCR7QVdTOjpBY2NvdW50SWR9LVxcJHtBV1M6OlJlZ2lvbn1gLFxyXG4gIGRlcGxveVJvbGVBcm46XHJcbiAgICBgYXJuOlxcJHtBV1M6OlBhcnRpdGlvbn06aWFtOjpcXCR7QVdTOjpBY2NvdW50SWR9OnJvbGUvY2RrLSR7cXVhbGlmaWVyfS1kZXBsb3ktcm9sZS1cXCR7QVdTOjpBY2NvdW50SWR9LVxcJHtBV1M6OlJlZ2lvbn1gLFxyXG4gIGNsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZTpcclxuICAgIGBhcm46XFwke0FXUzo6UGFydGl0aW9ufTppYW06OlxcJHtBV1M6OkFjY291bnRJZH06cm9sZS9jZGstJHtxdWFsaWZpZXJ9LWNmbi1leGVjLXJvbGUtXFwke0FXUzo6QWNjb3VudElkfS1cXCR7QVdTOjpSZWdpb259YCxcclxuICBmaWxlQXNzZXRQdWJsaXNoaW5nUm9sZUFybjpcclxuICAgIGBhcm46XFwke0FXUzo6UGFydGl0aW9ufTppYW06OlxcJHtBV1M6OkFjY291bnRJZH06cm9sZS9jZGstJHtxdWFsaWZpZXJ9LWZpbGUtcHVibGlzaGluZy1yb2xlLVxcJHtBV1M6OkFjY291bnRJZH0tXFwke0FXUzo6UmVnaW9ufWAsXHJcbiAgaW1hZ2VBc3NldFB1Ymxpc2hpbmdSb2xlQXJuOlxyXG4gICAgYGFybjpcXCR7QVdTOjpQYXJ0aXRpb259OmlhbTo6XFwke0FXUzo6QWNjb3VudElkfTpyb2xlL2Nkay0ke3F1YWxpZmllcn0taW1hZ2UtcHVibGlzaGluZy1yb2xlLVxcJHtBV1M6OkFjY291bnRJZH0tXFwke0FXUzo6UmVnaW9ufWAsXHJcbiAgbG9va3VwUm9sZUFybjpcclxuICAgIGBhcm46XFwke0FXUzo6UGFydGl0aW9ufTppYW06OlxcJHtBV1M6OkFjY291bnRJZH06cm9sZS9jZGstJHtxdWFsaWZpZXJ9LWxvb2t1cC1yb2xlLVxcJHtBV1M6OkFjY291bnRJZH0tXFwke0FXUzo6UmVnaW9ufWAsXHJcbiAgYnVja2V0UHJlZml4OiBcIlwiLFxyXG4gIGdlbmVyYXRlQm9vdHN0cmFwVmVyc2lvblJ1bGU6IGZhbHNlLFxyXG59KTtcclxuXHJcbmNvbnN0IHN0YWNrID0gbmV3IE1ldGFUZWNoUHJvdmlkZXJGcm9udGVuZFN0YWNrKFxyXG4gIGFwcCxcclxuICBcIk1ldGFUZWNoUHJvdmlkZXJGcm9udGVuZFN0YWNrXCIsXHJcbiAge1xyXG4gICAgZW52OiB7XHJcbiAgICAgIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXHJcbiAgICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OID8/IFwiZXUtd2VzdC0xXCIsXHJcbiAgICB9LFxyXG4gICAgZW50b3JubyxcclxuICAgIHN0YWNrTmFtZTogYG1ldGEtdGVjaC1wcm92aWRlci1mcm9udC0ke2VudG9ybm99YCxcclxuICAgIGRlc2NyaXB0aW9uOiBcIk1ldGEgVGVjaCBQcm92aWRlciBGcm9udGVuZCAtIFMzICsgQ2xvdWRGcm9udFwiLFxyXG4gICAgc3ludGhlc2l6ZXIsXHJcbiAgICBhbmFseXRpY3NSZXBvcnRpbmc6IGZhbHNlLFxyXG4gIH0sXHJcbik7XHJcblxyXG5jb25zdCBtYW5kYXRvcnlUYWdzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xyXG4gIG93bmVyOiBcImNhcGdlbWluaS1kY3hcIixcclxuICBhdXRvcl9pbmZyYTogXCJpZ25hY2lvLmZlcnJlci1zYW56XCIsXHJcbiAgcHJveWVjdG86IFwibWV0YS10ZWNoLXByb3ZpZGVyLWZyb250XCIsXHJcbiAgY2xpZW50ZTogXCJtYXBmcmVcIixcclxuICBjb3N0X2NlbnRlcjogY29zdENlbnRlcixcclxuICBlbnRvcm5vLFxyXG4gIGVjcjogXCJzaGFyZWRcIixcclxufTtcclxuXHJcbmZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG1hbmRhdG9yeVRhZ3MpKSB7XHJcbiAgY2RrLlRhZ3Mub2Yoc3RhY2spLmFkZChrZXksIHZhbHVlKTtcclxufVxyXG5cclxuYXBwLnN5bnRoKCk7XHJcbiJdfQ==