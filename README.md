# Meta Tech Provider Front

Repositorio frontend con arquitectura separada:

- Infraestructura AWS con CDK en raiz.
- Aplicacion Angular en `frontend/app`.

## Estructura

- `bin/`: entrada CDK.
- `lib/`: stacks CDK.
- `scripts/deploy.sh`: despliegue de front en AWS.
- `frontend/app`: app Angular 21.

## Frontend local

```bash
npm --prefix frontend/app install
npm --prefix frontend/app start
```

La app queda en:

- `http://localhost:4200`
- callback para Embedded Signup: `http://localhost:4200/callback.html`

## CDK local

```bash
npm install
npm run build
npx cdk synth --context entorno=dev --context cost_center=TEST
```

## Deploy AWS

```bash
./scripts/deploy.sh dev
```

El script:

1. Compila Angular (`frontend/app`).
2. Compila CDK TypeScript.
3. Despliega stack `MetaTechProviderFrontendStack`.

## Notas

- Para Embedded Signup con SDK JS, usar dominio HTTPS en Meta para pruebas reales.
- En AWS, objetivo de hosting: S3 + CloudFront.
