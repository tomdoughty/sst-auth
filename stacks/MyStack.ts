import {
  Api,
  Cognito,
  ReactStaticSite,
  StackContext,
  Table,
  Function,
} from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  const users = new Table(stack, "Users", {
    fields: {
      sub: "string",
    },
    primaryIndex: { partitionKey: "sub" },
  });

  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
    triggers: {
      postConfirmation: {
        handler: "functions/postConfirmation.handler",
        bind: [users],
      },
      preTokenGeneration: {
        handler: "functions/preTokenGeneration.handler",
        bind: [users],
      },
    },
    cdk: {
      userPoolClient: {
        oAuth: {
          callbackUrls: ["http://localhost:3000/"],
          logoutUrls: ["http://localhost:3000/"],
        },
      },
    },
  });

  const hostedCognitoDomain = auth.cdk.userPool.addDomain("AuthDomain", {
    cognitoDomain: {
      domainPrefix: `thomashdoughty-auth-playground`,
    },
  });

  const api = new Api(stack, "Api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
      adminAuthorizer: {
        type: "lambda",
        function: new Function(stack, "Authorizer", {
          handler: "functions/adminAuthorizer.handler",
          bind: [users],
        }),
        responseTypes: ["simple"],
        resultsCacheTtl: "30 seconds",
      },
    },
    defaults: {
      authorizer: "jwt",
      function: {
        bind: [users],
      },
    },
    routes: {
      "GET /count": "functions/getCount.handler",
      "PUT /count": "functions/putCount.handler",
      "GET /users": {
        authorizer: "adminAuthorizer",
        function: "functions/getUsers.handler",
      },
    },
  });

  const site = new ReactStaticSite(stack, "ReactSite", {
    path: "frontend",
    environment: {
      REACT_APP_API_URL: api.url,
      REACT_APP_USER_POOL_ID: auth.userPoolId,
      REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      REACT_APP_HOSTED_COGNITO_URL: hostedCognitoDomain.domainName,
    },
  });

  auth.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    HostedCognito: `${hostedCognitoDomain.domainName}.auth.us-east-1.amazoncognito.com`,
  });
}
