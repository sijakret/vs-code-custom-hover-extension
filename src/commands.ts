import * as vscode from "vscode";

interface Parameters {
  command: string;
  terminalName: string;
}

export function registerCommands() {
  let disposables = [];
  disposables.push(
    vscode.commands.registerCommand(
      "vs-code-custom-hover-extension.runInTerminal",
      ({ command, terminalName }: Parameters) => {
        terminalName = terminalName || "Custom Hover - Terminal";
        let terminal =
          vscode.window.terminals.find((t) => t.name === terminalName) ||
          vscode.window.createTerminal(terminalName);
        terminal.sendText(command);
        terminal.show();
      }
    )
  );
  return disposables;
}
