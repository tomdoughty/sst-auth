import { MyStack } from "./MyStack";
import { RemovalPolicy } from "aws-cdk-lib";
import { App } from "@serverless-stack/resources";

export default function(app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });
  app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
  app.stack(MyStack);
}
