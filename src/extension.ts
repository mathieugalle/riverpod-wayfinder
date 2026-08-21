import * as vscode from 'vscode';
import * as fs from 'fs';
import {
  resolveProviderTarget,
  resolveGeneratedProviderReference,
  findWordOccurrences,
  isGeneratedDartFile,
  GDartCandidate,
} from './resolver';

// A LogOutputChannel (not console.log) so output reliably shows up in the
// Output panel - under its own "Riverpod Wayfinder" channel - regardless of
// whether the window is running under a debugger. Verbosity is controlled by
// the channel's own log level (gear icon in the Output panel, or "Developer:
// Set Log Level..." -> Riverpod Wayfinder), which is the standard VSCode
// mechanism for this - no custom "enableLogging" setting needed.
const outputChannel = vscode.window.createOutputChannel('Riverpod Wayfinder', { log: true });

/** Step-by-step resolution tracing. Hidden unless the channel's level is Debug/Trace. */
function log(message: string): void {
  outputChannel.debug(message);
}

/** A caught exception or unexpected failure. Shown at the channel's default level. */
function logError(message: string, err: unknown): void {
  outputChannel.error(`${message}: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`);
}

/**
 * Reads each URI's content, skipping (and logging) any file that can't be
 * read instead of throwing - a file can vanish between `findFiles` and here
 * (deleted, renamed, a stale watcher event), and one bad file shouldn't sink
 * the whole resolution.
 */
function readFilesSafely(uris: vscode.Uri[]): GDartCandidate[] {
  const files: GDartCandidate[] = [];
  for (const uri of uris) {
    try {
      files.push({ path: uri.fsPath, content: fs.readFileSync(uri.fsPath, 'utf8') });
    } catch (err) {
      logError(`Failed to read ${uri.fsPath}`, err);
    }
  }
  return files;
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

  const candidates = readFilesSafely(gDartUris);

  const result = resolveProviderTarget(word, candidates, { log });
  if (!result) {
    log(`Could not resolve a jump target for "${word}".`);
    return null;
  }

  const uri = vscode.Uri.file(result.filePath);
  return new vscode.Location(uri, new vscode.Position(result.line, 0));
}

/**
 * Reverse of `jumpToRiverpodOrigin`: cursor on the hand-written `@riverpod`
 * declaration (e.g. `weather`, `class PackageMetrics`) -> every usage of the
 * GENERATED provider identifier it produces (e.g. `weatherProvider`) across
 * the workspace. Powers "Find All References" (Shift+F12) on that
 * declaration, which the Dart analyzer alone can't answer - it doesn't know
 * the hand-written symbol and the generated provider are "the same thing".
 *
 * Prefers the Dart analyzer's own references (scope-aware, no false
 * positives from comments/strings) when available, and falls back to a
 * plain text scan across the workspace otherwise - see
 * `resolveGeneratedProviderReference` / `findWordOccurrences` in ./resolver.
 */
async function findRiverpodUsages(
  document: vscode.TextDocument,
  position: vscode.Position
): Promise<vscode.Location[] | null> {
  const range = document.getWordRangeAtPosition(position);
  if (!range) {
    return null;
  }
  const word = document.getText(range);

  const reference = resolveGeneratedProviderReference(document.getText(), document.uri.fsPath, word, {
    log,
  });
  if (!reference) {
    return null;
  }

  const gDartUri = vscode.Uri.file(reference.gDartPath);
  const gDartPosition = new vscode.Position(reference.line, reference.character);

  // Never surface *.g.dart in results, including the generated declaration
  // itself we just pointed executeReferenceProvider at - riverpod-wayfinder's
  // whole point is hiding generated code, in both directions.
  try {
    const analyzerLocations = await vscode.commands.executeCommand<vscode.Location[]>(
      'vscode.executeReferenceProvider',
      gDartUri,
      gDartPosition
    );
    const filtered = (analyzerLocations ?? []).filter((loc) => !isGeneratedDartFile(loc.uri.fsPath));
    if (filtered.length > 0) {
      log(`Found ${filtered.length} reference(s) to "${reference.name}" via the Dart analyzer.`);
      return filtered;
    }
    log(`Dart analyzer found no non-generated references to "${reference.name}"; falling back to a text scan.`);
  } catch (err) {
    logError(`vscode.executeReferenceProvider failed for "${reference.name}", falling back to a text scan`, err);
  }

  const dartUris = (await vscode.workspace.findFiles('**/*.dart', null)).filter(
    (uri) => !isGeneratedDartFile(uri.fsPath)
  );
  const files = readFilesSafely(dartUris);
  const textRefs = findWordOccurrences(reference.name, files);
  if (textRefs.length === 0) {
    return null;
  }
  return textRefs.map(
    (ref) => new vscode.Location(vscode.Uri.file(ref.filePath), new vscode.Position(ref.line, ref.character))
  );
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

  // "Who uses this?" (Shift+F12 / Find All References) from the hand-written
  // declaration side - see findRiverpodUsages above.
  const referenceProvider = vscode.languages.registerReferenceProvider(
    { language: 'dart' },
    {
      async provideReferences(document, position) {
        log('provideReferences called (Shift+F12 / Find All References channel).');
        return await findRiverpodUsages(document, position);
      },
    }
  );

  context.subscriptions.push(
    outputChannel,
    jumpCommand,
    implementationProvider,
    definitionProvider,
    referenceProvider
  );
}

export function deactivate() {}
