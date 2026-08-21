import * as fs from 'fs';
import * as path from 'path';

/**
 * A candidate `.g.dart` file: its absolute path and its full text content.
 * The caller (the VSCode-facing wrapper) is responsible for discovering
 * these - this module has no knowledge of the workspace or VSCode APIs.
 */
export interface GDartCandidate {
  path: string;
  content: string;
}

export interface ResolveOptions {
  /** Injectable for testing; defaults to fs.existsSync. */
  fileExists?: (absolutePath: string) => boolean;
  /** Injectable for testing; defaults to fs.readFileSync. */
  readFile?: (absolutePath: string) => string;
  /** Injectable logger; defaults to a no-op. Gated by enableLogging by the caller. */
  log?: (message: string) => void;
}

export interface ResolvedTarget {
  /** Absolute path of the hand-written .dart file to jump to. */
  filePath: string;
  /** Zero-based line number of the target declaration. */
  line: number;
  /** The class or function name we matched against, for diagnostics. */
  symbolName: string;
  /** Which .g.dart candidate produced this result. */
  sourceGDartPath: string;
}

function noop(): void {
  /* no-op default logger */
}

function defaultOptions(overrides: ResolveOptions): Required<ResolveOptions> {
  return {
    fileExists: overrides.fileExists ?? ((p: string) => fs.existsSync(p)),
    readFile: overrides.readFile ?? ((p: string) => fs.readFileSync(p, 'utf8')),
    log: overrides.log ?? noop,
  };
}

/** True for any `*.g.dart` path - riverpod-wayfinder never surfaces generated code to the user. */
export function isGeneratedDartFile(filePath: string): boolean {
  return /\.g\.dart$/.test(filePath);
}

export function toPascalCase(input: string): string {
  return input.replace(/(^|_)(\w)/g, (_match, _sep, c: string) => c.toUpperCase());
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Does `word` look like it's actually DECLARED as a top-level provider
 * identifier in this `.g.dart` content (e.g. `final authControllerProvider =
 * ...` or, just as validly, `final authController = ...` if that's what your
 * codebase's naming convention produces)?
 *
 * Deliberately does NOT assume any naming suffix (like a hardcoded
 * `"Provider"` string). riverpod_generator always emits a `final <name> =
 * ...` declaration for whatever the generated identifier is named - matching
 * on that declaration, rather than on a suffix convention, means this works
 * for any naming scheme (`fooProvider`, `fooController`, `fooVm`, ...)
 * without configuration.
 */
export function isDeclaredProviderIdentifier(gDartContent: string, word: string): boolean {
  return new RegExp(`\\b${escapeRegExp(word)}\\b\\s*=(?!=)`).test(gDartContent);
}

/**
 * Within a single `.g.dart` file's content, find the `@ProviderFor(X)`
 * annotation that corresponds to the SPECIFIC provider identifier that was
 * clicked - not just the first `@ProviderFor` in the file (bug: a file with
 * multiple providers would always resolve to the first one).
 *
 * Generated output looks like:
 *
 *   /// See also [viewFreshnessScore].
 *   @ProviderFor(viewFreshnessScore)
 *   final viewFreshnessScoreProvider = AutoDisposeProvider<int>.internal(
 *
 * so we locate the `<word> =` declaration first, then walk *backwards* from
 * there for the nearest preceding `@ProviderFor(X)` - that `X` is the
 * class/function we want. This works regardless of how many other
 * providers are declared earlier or later in the same file.
 */
export function findProviderForClassName(gDartContent: string, word: string): string | null {
  const declRegex = new RegExp(`\\b${escapeRegExp(word)}\\b\\s*=`);
  const declMatch = declRegex.exec(gDartContent);
  const searchUpTo = declMatch ? declMatch.index : gDartContent.length;
  const before = gDartContent.slice(0, searchUpTo);

  const providerForRegex = /@ProviderFor\((\w+)\)/g;
  let lastMatch: RegExpExecArray | null = null;
  let match: RegExpExecArray | null = providerForRegex.exec(before);
  while (match !== null) {
    lastMatch = match;
    match = providerForRegex.exec(before);
  }

  if (lastMatch) {
    return lastMatch[1];
  }

  // Fallback for unusual/hand-edited generated code where the `word =`
  // declaration couldn't be located directly: scan the whole file for the
  // @ProviderFor whose argument matches the inferred base name.
  const providerName = word.replace(/Provider$/, '');
  const wholeFileRegex = /@ProviderFor\((\w+)\)/g;
  let fallbackMatch: RegExpExecArray | null = wholeFileRegex.exec(gDartContent);
  while (fallbackMatch !== null) {
    if (fallbackMatch[1].toLowerCase() === providerName.toLowerCase()) {
      return fallbackMatch[1];
    }
    fallbackMatch = wholeFileRegex.exec(gDartContent);
  }

  return null;
}

/**
 * In the hand-written source `.dart` file, find the line of the declaration
 * (class or function) that corresponds to `className`. Scans EVERY
 * `@riverpod` annotation in the file rather than stopping at the first one
 * (bug: a file with multiple providers would always jump to whichever
 * declaration followed the first `@riverpod` annotation).
 *
 * Supports both provider styles:
 *   - class-based:    @riverpod class ViewFreshness extends _$ViewFreshness
 *   - function-based:  @riverpod int viewFreshnessScore(Ref ref)
 */
export function findDeclarationLine(sourceContent: string, className: string): number | null {
  const lines = sourceContent.split('\n');
  const isClassStyle = /^[A-Z]/.test(className);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/@riverpod\b/i.test(line) && !/@Riverpod\b/.test(line)) {
      continue;
    }

    // Walk forward past any other annotations/blank/comment lines to reach
    // the actual declaration that THIS @riverpod annotation is attached to.
    let j = i + 1;
    while (
      j < lines.length &&
      (/^\s*$/.test(lines[j]) || /^\s*@/.test(lines[j]) || /^\s*\/\//.test(lines[j]))
    ) {
      j++;
    }
    if (j >= lines.length) {
      continue;
    }

    const declLine = lines[j];

    if (isClassStyle) {
      if (new RegExp(`\\bclass\\s+${escapeRegExp(className)}\\b`).test(declLine)) {
        return j;
      }
    } else if (
      new RegExp(`\\b${escapeRegExp(className)}\\s*\\(`).test(declLine) &&
      !/\bclass\b/.test(declLine)
    ) {
      return j;
    }
  }

  return null;
}

/**
 * Resolve a clicked Riverpod provider usage (e.g. `viewFreshnessProvider`,
 * or `authController` if that's your team's naming convention) to its
 * hand-written source declaration.
 *
 * No naming convention is assumed or required - a word is only treated as a
 * candidate provider if it's actually declared as such in a `.g.dart` file
 * (see `isDeclaredProviderIdentifier`), so this works for any suffix your
 * codebase uses, wherever `@riverpod` codegen itself works.
 *
 * Pure function: no vscode imports. `candidates` must be supplied by the
 * caller (typically gathered via `vscode.workspace.findFiles('**\/*.g.dart')`).
 */
export function resolveProviderTarget(
  word: string,
  candidates: GDartCandidate[],
  options: ResolveOptions = {}
): ResolvedTarget | null {
  const { fileExists, readFile, log } = defaultOptions(options);

  if (!word) {
    log('Empty word at cursor position; nothing to resolve.');
    return null;
  }

  for (const candidate of candidates) {
    if (!isDeclaredProviderIdentifier(candidate.content, word)) {
      continue;
    }
    log(`"${word}" is declared as a provider identifier in candidate .g.dart file: ${candidate.path}`);

    const partOfMatch = candidate.content.match(/part of ['"](.+)['"]/);
    if (!partOfMatch) {
      log(`No "part of" directive in ${candidate.path}; skipping this candidate.`);
      continue;
    }

    const relativePath = partOfMatch[1];
    const absoluteTargetPath = path.resolve(path.dirname(candidate.path), relativePath);

    if (!fileExists(absoluteTargetPath)) {
      log(`Target source file does not exist: ${absoluteTargetPath}; skipping this candidate.`);
      continue;
    }

    const providerName = word.replace(/Provider$/, '');
    const className = findProviderForClassName(candidate.content, word) ?? toPascalCase(providerName);
    log(`Inferred symbol "${className}" for "${word}" from ${candidate.path}`);

    const targetContent = readFile(absoluteTargetPath);
    const line = findDeclarationLine(targetContent, className);

    if (line === null) {
      log(
        `Could not locate a declaration for "${className}" in ${absoluteTargetPath}; trying next candidate.`
      );
      continue;
    }

    log(`Resolved "${word}" -> ${absoluteTargetPath}:${line + 1}`);
    return {
      filePath: absoluteTargetPath,
      line,
      symbolName: className,
      sourceGDartPath: candidate.path,
    };
  }

  log(`"${word}" was not found in any .g.dart candidate.`);
  return null;
}

export interface GeneratedProviderReference {
  /** The generated provider identifier (e.g. "weatherProvider"). */
  name: string;
  /** Absolute path of the .g.dart file containing the generated declaration. */
  gDartPath: string;
  /** Zero-based line of the generated declaration within that file. */
  line: number;
  /** Zero-based character offset of the identifier's start on that line. */
  character: number;
}

/**
 * Given a hand-written source file, find the `.g.dart` file it declares via
 * `part '<name>.g.dart';` - the counterpart to the `part of '<source>'`
 * directive `resolveProviderTarget` reads in the other direction.
 */
export function findPairedGDartPath(sourceContent: string, sourceFilePath: string): string | null {
  const partMatch = sourceContent.match(/^part\s+['"](.+\.g\.dart)['"]\s*;/m);
  if (!partMatch) {
    return null;
  }
  return path.resolve(path.dirname(sourceFilePath), partMatch[1]);
}

/**
 * Reverse of `findProviderForClassName`: given the hand-written class/function
 * name, find the GENERATED provider identifier riverpod_generator produced
 * for it (e.g. "weather" -> "weatherProvider"), plus its character offset in
 * the `.g.dart` content so a caller can build a `Position` pointing at it.
 *
 * Handles both declaration shapes generator output uses:
 *   `final xProvider = ...`                (plain provider)
 *   `const xProvider = XFamily();`         (family/parameterized provider)
 */
export function findGeneratedProviderName(
  gDartContent: string,
  className: string
): { name: string; offset: number } | null {
  const providerForRegex = new RegExp(`@ProviderFor\\(${escapeRegExp(className)}\\)`, 'g');
  const declRegex = /\b(?:final|const)\s+(\w+)\s*=/;

  let match: RegExpExecArray | null = providerForRegex.exec(gDartContent);
  while (match !== null) {
    const searchFrom = match.index + match[0].length;
    const declMatch = declRegex.exec(gDartContent.slice(searchFrom));
    if (declMatch) {
      return {
        name: declMatch[1],
        offset: searchFrom + declMatch.index + declMatch[0].indexOf(declMatch[1]),
      };
    }
    match = providerForRegex.exec(gDartContent);
  }

  return null;
}

function offsetToLineAndCharacter(content: string, offset: number): { line: number; character: number } {
  const before = content.slice(0, offset).split('\n');
  return { line: before.length - 1, character: before[before.length - 1].length };
}

/**
 * Reverse of `resolveProviderTarget`: given the hand-written declaration
 * clicked in a source `.dart` file (e.g. "weather", "PackageMetrics"), find
 * where its GENERATED provider identifier (e.g. "weatherProvider") is
 * declared in the paired `.g.dart` file - so a caller can search for usages
 * of *that* identifier across the workspace ("who uses this provider?").
 */
export function resolveGeneratedProviderReference(
  sourceContent: string,
  sourceFilePath: string,
  className: string,
  options: ResolveOptions = {}
): GeneratedProviderReference | null {
  const { fileExists, readFile, log } = defaultOptions(options);

  if (!className) {
    return null;
  }

  if (findDeclarationLine(sourceContent, className) === null) {
    log(`"${className}" is not an @riverpod-annotated declaration in this file; nothing to reverse.`);
    return null;
  }

  const gDartPath = findPairedGDartPath(sourceContent, sourceFilePath);
  if (!gDartPath) {
    log('No "part \'*.g.dart\';" directive found in this file.');
    return null;
  }

  if (!fileExists(gDartPath)) {
    log(`Paired .g.dart file does not exist: ${gDartPath}`);
    return null;
  }

  const gDartContent = readFile(gDartPath);
  const found = findGeneratedProviderName(gDartContent, className);
  if (!found) {
    log(`No generated provider identifier found for "${className}" in ${gDartPath}`);
    return null;
  }

  const { line, character } = offsetToLineAndCharacter(gDartContent, found.offset);
  log(`"${className}" generates "${found.name}" at ${gDartPath}:${line + 1}`);

  return { name: found.name, gDartPath, line, character };
}

export interface TextReference {
  filePath: string;
  line: number;
  character: number;
}

/**
 * Plain word-boundary text scan for every occurrence of `word` across a set
 * of already-read files. Used as a fallback for "who uses this provider?"
 * when the Dart analyzer isn't available to answer precisely (see
 * `resolveGeneratedProviderReference`) - trades precision (this can match
 * inside comments or string literals) for having no dependency on the Dart
 * extension being installed and active.
 */
export function findWordOccurrences(
  word: string,
  files: { path: string; content: string }[]
): TextReference[] {
  const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'g');
  const results: TextReference[] = [];

  for (const file of files) {
    const lines = file.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      regex.lastIndex = 0;
      let match: RegExpExecArray | null = regex.exec(lines[i]);
      while (match !== null) {
        results.push({ filePath: file.path, line: i, character: match.index });
        match = regex.exec(lines[i]);
      }
    }
  }

  return results;
}
