// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { resolve } from "path";
import * as vscode from "vscode";
import { registerCommands } from "./commands";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposables = [];
  disposables.push(...registerCommands());

  const workbenchConfig = vscode.workspace.getConfiguration("customhover");
  const provideHoverFileName = workbenchConfig.get<string>("provideHoverFile")!;

  disposables.push(
    vscode.languages.registerHoverProvider("*", {
      async provideHover(document, position, token) {
        let provideHoverFilePath: string = "";
        try {
          let workspaceFolder: string = "";
          let folders = vscode.workspace.workspaceFolders || [];
          if (folders?.length > 0) {
            workspaceFolder = folders[0].uri.fsPath as string;
          }
          provideHoverFilePath = resolve(workspaceFolder, provideHoverFileName);
        } catch (e) {
          throw new Error("no workspace loaded");
        }
        try {
          const { provideHover } = await eval(
            `import('${provideHoverFilePath}')`
          );
          const i = await provideHover(vscode, document, position, token);
          return i;
        } catch (e) {
          return console.error(e);
        }

        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        return new vscode.Hover({
          language: "Hello language",
          value: "Hello Value",
        });
      },
    })
  );

  disposables.forEach((d) => context.subscriptions.push(d));
}

// This method is called when your extension is deactivated
export function deactivate() {}
