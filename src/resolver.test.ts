import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import {
  resolveProviderTarget,
  findProviderForClassName,
  findDeclarationLine,
  isDeclaredProviderIdentifier,
  toPascalCase,
  GDartCandidate,
} from './resolver';

// This suite exercises the PURE resolver module directly - no vscode
// import anywhere in this file or in ./resolver, so it runs with the
// plain Node.js test runner (`node --test`) and needs no editor, no
// Extension Development Host, no F5.
//
// Fixtures live in test/fixtures/lib and mirror a small real-world Flutter
// project: multiple .dart files, each with MULTIPLE @riverpod providers,
// mixing class-based and function-based styles, plus their generated
// .g.dart counterparts.

const FIXTURES_ROOT = path.resolve(__dirname, '..', 'test', 'fixtures', 'lib');

function loadCandidates(): GDartCandidate[] {
  return fs
    .readdirSync(FIXTURES_ROOT)
    .filter((f) => f.endsWith('.g.dart'))
    .map((f) => {
      const p = path.join(FIXTURES_ROOT, f);
      return { path: p, content: fs.readFileSync(p, 'utf8') };
    });
}

function lineAt(filePath: string, line: number): string {
  return fs.readFileSync(filePath, 'utf8').split('\n')[line];
}

test('resolves a class-based provider to its own class, not the first provider in the file', () => {
  const result = resolveProviderTarget('viewFreshnessProvider', loadCandidates());
  assert.ok(result);
  assert.equal(path.basename(result!.filePath), 'view_freshness.providers.dart');
  assert.match(lineAt(result!.filePath, result!.line), /class ViewFreshness\b/);
});

test('resolves a function-based provider declared after a class-based one in the same file', () => {
  const result = resolveProviderTarget('viewFreshnessScoreProvider', loadCandidates());
  assert.ok(result);
  const line = lineAt(result!.filePath, result!.line);
  assert.match(line, /viewFreshnessScore\(/);
  assert.doesNotMatch(line, /class /);
});

test('resolves the THIRD provider in a multi-provider file (not the first one found)', () => {
  const result = resolveProviderTarget('viewFreshnessHistoryProvider', loadCandidates());
  assert.ok(result);
  assert.match(lineAt(result!.filePath, result!.line), /class ViewFreshnessHistory\b/);
});

test('resolves a single-provider file whose name does not follow the *.providers.dart convention', () => {
  const result = resolveProviderTarget('counterProvider', loadCandidates());
  assert.ok(result);
  assert.equal(path.basename(result!.filePath), 'counter.dart');
  assert.match(lineAt(result!.filePath, result!.line), /\bcounter\(/);
});

test('resolves a provider whose generated identifier does NOT end in "Provider" (no naming convention required)', () => {
  // Some codebases suffix generated identifiers with "Controller" (or
  // anything else) instead of "Provider". Riverpod Wayfinder must not
  // hardcode a suffix - it should work anywhere @riverpod codegen works.
  const result = resolveProviderTarget('authController', loadCandidates());
  assert.ok(result);
  assert.equal(path.basename(result!.filePath), 'auth_controller.dart');
  assert.match(lineAt(result!.filePath, result!.line), /class AuthController\b/);
});

test('resolves a FUNCTION-based FAMILY (parameterized) provider - `const xProvider = XFamily();` wrapper', () => {
  // Family providers generate `const weatherProvider = WeatherFamily();`
  // (a `const`, not a `final`, pointing at a wrapper *Family class) instead
  // of the plain `final weatherProvider = ...Provider<...>.internal(...)`
  // shape non-family providers use. The resolver must not assume the
  // simple shape.
  const result = resolveProviderTarget('weatherProvider', loadCandidates());
  assert.ok(result);
  assert.equal(path.basename(result!.filePath), 'weather.dart');
  const line = lineAt(result!.filePath, result!.line);
  assert.match(line, /\bweather\(/);
  assert.doesNotMatch(line, /class /);
});

test('resolves a CLASS-based FAMILY (parameterized) provider - `const xProvider = XFamily();` wrapper', () => {
  const result = resolveProviderTarget('cityForecastProvider', loadCandidates());
  assert.ok(result);
  assert.equal(path.basename(result!.filePath), 'city_forecast.dart');
  assert.match(lineAt(result!.filePath, result!.line), /class CityForecast\b/);
});

test('family resolution is not fooled by the wrapper class sharing a similar name (WeatherFamily/WeatherProvider != weatherProvider)', () => {
  // "WeatherProvider" (the generated class) and "WeatherFamily" both appear
  // throughout weather.g.dart; only the lowercase "weatherProvider" constant
  // is the real target, and it's case-sensitive.
  const result = resolveProviderTarget('weatherProvider', loadCandidates());
  assert.ok(result);
  assert.equal(result!.symbolName, 'weather');
});

test('resolves a provider with a totally arbitrary made-up suffix ("Toto") - proves no suffix is hardcoded', () => {
  const result = resolveProviderTarget('widgetToto', loadCandidates());
  assert.ok(result);
  assert.equal(path.basename(result!.filePath), 'toto_thing.dart');
  assert.match(lineAt(result!.filePath, result!.line), /class WidgetToto\b/);
});

test('returns null for the bare class name, which is not itself a declared provider identifier', () => {
  // "viewFreshness" never appears as its own `word =` declaration in any
  // .g.dart - only "viewFreshnessProvider" does (word-boundary matching
  // must not treat "viewFreshness" as a substring match inside it).
  assert.equal(resolveProviderTarget('viewFreshness', loadCandidates()), null);
});

test('returns null when the .g.dart "part of" target file is missing', () => {
  assert.equal(resolveProviderTarget('orphanProvider', loadCandidates()), null);
});

test('returns null when no candidate declares the word at all', () => {
  assert.equal(resolveProviderTarget('totallyUnknownProvider', loadCandidates()), null);
  assert.equal(resolveProviderTarget('someRandomLocalVariable', loadCandidates()), null);
});

test('isDeclaredProviderIdentifier matches a real declaration regardless of suffix, not a substring occurrence', () => {
  const content = fs.readFileSync(
    path.join(FIXTURES_ROOT, 'view_freshness.providers.g.dart'),
    'utf8'
  );
  assert.equal(isDeclaredProviderIdentifier(content, 'viewFreshnessProvider'), true);
  // "viewFreshness" is a substring of "viewFreshnessProvider" but is never
  // itself declared with `=` at a word boundary.
  assert.equal(isDeclaredProviderIdentifier(content, 'viewFreshness'), false);

  const controllerContent = fs.readFileSync(
    path.join(FIXTURES_ROOT, 'auth_controller.g.dart'),
    'utf8'
  );
  assert.equal(isDeclaredProviderIdentifier(controllerContent, 'authController'), true);
});

test('findProviderForClassName picks the @ProviderFor nearest the clicked provider, not the first in the file', () => {
  const content = fs.readFileSync(
    path.join(FIXTURES_ROOT, 'view_freshness.providers.g.dart'),
    'utf8'
  );
  assert.equal(findProviderForClassName(content, 'viewFreshnessProvider'), 'ViewFreshness');
  assert.equal(
    findProviderForClassName(content, 'viewFreshnessScoreProvider'),
    'viewFreshnessScore'
  );
  assert.equal(
    findProviderForClassName(content, 'viewFreshnessHistoryProvider'),
    'ViewFreshnessHistory'
  );
});

test('findDeclarationLine scans past earlier @riverpod annotations to find the matching one', () => {
  const content = fs.readFileSync(
    path.join(FIXTURES_ROOT, 'view_freshness.providers.dart'),
    'utf8'
  );
  const classLine = findDeclarationLine(content, 'ViewFreshnessHistory');
  assert.ok(classLine !== null);
  assert.match(content.split('\n')[classLine!], /class ViewFreshnessHistory/);

  const funcLine = findDeclarationLine(content, 'viewFreshnessScore');
  assert.ok(funcLine !== null);
  assert.match(content.split('\n')[funcLine!], /viewFreshnessScore\(/);
});

test('findDeclarationLine returns null when the class/function is not present', () => {
  const content = fs.readFileSync(
    path.join(FIXTURES_ROOT, 'view_freshness.providers.dart'),
    'utf8'
  );
  assert.equal(findDeclarationLine(content, 'DoesNotExist'), null);
});

test('toPascalCase converts a lowerCamelCase provider base name to a class name', () => {
  assert.equal(toPascalCase('viewFreshness'), 'ViewFreshness');
  assert.equal(toPascalCase('view_freshness'), 'ViewFreshness');
});
