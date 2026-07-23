#!/usr/bin/env bash
set -euo pipefail

ENV="${1:-dev}"
PROJECT_ID="meta-tech-provider-front"
QUALIFIER="mtpdevfrt"
TOOLKIT_STACK_NAME="meta-tech-provider-front-cdk-toolkit"
BASE_PROFILE="dgtcarlosj"
REGION="eu-west-1"
ACCOUNT_ID="887977137036"

echo "========================================"
echo " Deploy Front : $PROJECT_ID"
echo " Env          : $ENV"
echo " Profile      : $BASE_PROFILE"
echo " Region       : $REGION"
echo " Qualifier    : $QUALIFIER"
echo "========================================"

if ! wsl aws sts get-caller-identity --profile "$BASE_PROFILE" >/dev/null 2>&1; then
  echo "[ERROR] No se puede autenticar con el perfil $BASE_PROFILE"
  echo "        Comprueba ~/.aws/credentials o ~/.aws/config"
  exit 1
fi
echo "[OK] Credenciales base validas"

echo "[INFO] Build Angular app..."
npm --prefix frontend/app run build

echo "[INFO] Build CDK TypeScript..."
npm run build

export AWS_PROFILE="$BASE_PROFILE"
export AWS_REGION="$REGION"
export AWS_SDK_LOAD_CONFIG=1
export CDK_DEFAULT_ACCOUNT="$ACCOUNT_ID"
export CDK_DEFAULT_REGION="$REGION"

echo "[INFO] CDK deploy..."
npx cdk deploy MetaTechProviderFrontendStack \
  --profile "$BASE_PROFILE" \
  --region "$REGION" \
  --toolkit-stack-name "$TOOLKIT_STACK_NAME" \
  --context entorno="$ENV" \
  --context cost_center="${cost_center:-TEST}" \
  --require-approval never

echo "========================================"
echo " Front deploy completado"
echo "========================================"
