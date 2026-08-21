import * as vscode from 'vscode';
import * as fs from 'fs';
import { resolveProviderTarget, GDartCandidate } from './resolver';

const CONFIG_SECTION = 'riverpod-wayfinder';

function isLoggingEnabled(): boolean {
  return vscode.workspace.getConfiguration(CONFIG_SECTION).get<boolean>('enableLogging', false);
}

function log(message: string): void {
  if (isLoggingEnabled()) {
    console.log(`[riverpod-wayfinder] ${message}`);
  }
}

/**
 * Thin VSCode-facing wrapper: gathers .g.dart candidates from the workspace
 * and the clicked word, then delegates all actual resolution logic to the
 * pure `resolveProviderTarget` function in ./resolver (no vscode imports,
 * fully unit-testable without launching the editor).
 */
async function jumpToRiverpodOrigin(
  document: vscode.TextDocument,
  position: vscode.Position
): Promise<vscode.Location | null> {
  const range = document.getWordRangeAtPosition(position);
  if (!range) {
    log('No word found at the cursor position.');
    return null;
  }

  const word = document.getText(range);
  log(`Cursor word: "${word}"`);

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    log('No workspace folder is open; cannot search for .g.dart files.');
    return null;
  }

  // Explicit `null` disables default excludes (files.exclude), which many Dart/Riverpod
  // workspaces use to hide generated .g.dart files - without it, findFiles silently finds none.
  const gDartUris = await vscode.workspace.findFiles('**/*.g.dart', null);
  log(`Found ${gDartUris.length} .g.dart file(s) in the workspace.`);

  const candidates: GDartCandidate[] = gDartUris.map((uri) => ({
    path: uri.fsPath,
    content: fs.readFileSync(uri.fsPath, 'utf8'),
  }));

  const result = resolveProviderTarget(word, candidates, { log });
  if (!result) {
    log(`Could not resolve a jump target for "${word}".`);
    return null;
  }

  const uri = vscode.Uri.file(result.filePath);
  return new vscode.Location(uri, new vscode.Position(result.line, 0));
}

export function activate(context: vscode.ExtensionContext) {
  // Manual fallback: command + keybinding (Ctrl+Alt+D / Cmd+Alt+D). Useful
  // when the cursor isn't exactly on the provider word, or as a
  // muscle-memory-free alternative to Go to Implementation.
  const jumpCommand = vscode.commands.registerCommand(
    'riverpod-wayfinder.goToDefinition',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const document = editor.document;
      const position = editor.selection.active;

      const location = await jumpToRiverpodOrigin(document, position);
      if (location) {
        await vscode.window.showTextDocument(location.uri, {
          selection: new vscode.Range(location.range.start, location.range.start),
          viewColumn: vscode.ViewColumn.Active,
          preserveFocus: false,
        });
      } else {
        log('goToDefinition command: no target resolved.');
      }
    }
  );

  // Primary gesture: "Go to Implementation" (Ctrl+F12 / Cmd+F12).
  //
  // "Go to Implementation" is a distinct VSCode command/gesture that the
  // Dart extension does not contribute a provider for, so registering an
  // ImplementationProvider gives us a clean, uncontested gesture that
  // reliably lands on the hand-written source every time.
  const implementationProvider = vscode.languages.registerImplementationProvider(
    { language: 'dart' },
    {
      async provideImplementation(document, position) {
        log('provideImplementation called (Ctrl+F12 / Cmd+F12 channel).');
        return await jumpToRiverpodOrigin(document, position);
      },
    }
  );

  // Also register on Go to Definition (Ctrl+Click / Cmd+Click / F12).
  //
  // We do NOT try to override or out-race the Dart extension's own
  // DefinitionProvider here - that's not possible: VSCode *aggregates*
  // every registered DefinitionProvider for a language and merges their
  // results, it does not let one provider "win" by priority or speed, and
  // there is no supported way to suppress another extension's contribution.
  //
  // What aggregation actually does when more than one location comes back
  // is offer a picker/peek list of candidates instead of navigating
  // straight to one of them. So registering here doesn't override Dart's
  // answer (the generated .g.dart location) - it just adds ours as an
  // additional candidate in that list, alongside Dart's. Ctrl+F12 above
  // remains the only gesture that jumps straight to the source with no
  // picker involved.
  const definitionProvider = vscode.languages.registerDefinitionProvider(
    { language: 'dart' },
    {
      async provideDefinition(document, position) {
        log('provideDefinition called (Ctrl+Click / Cmd+Click / F12 channel).');
        return await jumpToRiverpodOrigin(document, position);
      },
    }
  );

  context.subscriptions.push(jumpCommand, implementationProvider, definitionProvider);
}

export function deactivate() {}
