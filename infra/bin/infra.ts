#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";
import path = require("path");

export type Stage = "development" | "production" | "staging";

const app = new cdk.App();
const stage = (process.env.STAGE || "development") as Stage;
const accounts: Record<Stage, string> = {
  development: "",
  staging: "",
  production: "",
};

const env: cdk.Environment = {
  account: accounts[stage],
  region: "ap-southeast-1",
};

new InfraStack(app, `infra-stack-${stage}`, {
  env,
  stage,
  stackName: `todo-api-${stage}`,
  lambdaPath: path.resolve(__dirname, "..", "todo-api.zip"),
  lambdaHandler: "dist/lambda.handler",
});
