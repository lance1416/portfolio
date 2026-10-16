import { describe, expect, it } from 'vitest';
import { profile } from '@/data/profile';
import { projectsData } from '@/data/projects';
import { pathForRoute, resolve } from './fs';
import { complete, run } from './shell';

const firstProject = `${projectsData[0].id}.json`;

describe('resolve', () => {
  it.each([
    [[], 'projects', ['projects']],
    [[], 'projects/', ['projects']],
    [['projects'], '..', []],
    [['projects'], '../research', ['research']],
    [['projects'], '~', []],
    [['projects'], '/experience', ['experience']],
    [['projects'], `./${firstProject}`, ['projects', firstProject]],
  ])('%j + %s → %j', (cwd, arg, path) => {
    expect(resolve(cwd, arg)?.path).toEqual(path);
  });

  it('returns null for missing paths', () => {
    expect(resolve([], 'nope')).toBeNull();
    expect(resolve([], 'whoami.json/x')).toBeNull();
  });
});

describe('pathForRoute', () => {
  it.each([
    ['/', []],
    ['/projects', ['projects']],
    ['/projects/', ['projects']],
    ['/unknown', []],
  ])('%s → %j', (route, path) => {
    expect(pathForRoute(route)).toEqual(path);
  });
});

describe('run', () => {
  it('lists a directory, marking subdirectories', () => {
    const [out] = run('ls', []).output;
    expect(out.type === 'ls' && out.entries.map((e) => e.name)).toEqual(
      expect.arrayContaining(['projects/', 'whoami.json', 'resume.pdf']),
    );
  });

  it('cats JSON relative to the current directory', () => {
    const [out] = run(`cat ${firstProject}`, ['projects']).output;
    expect(out).toMatchObject({
      type: 'json',
      value: { title: projectsData[0].title },
    });
  });

  it('cd navigates to the directory’s page', () => {
    expect(run('cd ../research', ['projects']).effect).toEqual({
      type: 'cd',
      path: ['research'],
      route: '/research',
    });
    expect(run('cd', ['projects']).effect).toEqual({
      type: 'cd',
      path: [],
      route: '/',
    });
  });

  it.each([
    ['cd whoami.json', 'not a directory'],
    ['cat projects', 'is a directory'],
    ['cat resume.pdf', 'binary file'],
    ['cat nope', 'no such file'],
    ['theme pink', 'usage: theme'],
    ['rm -rf /', 'command not found'],
    ['constructor', 'command not found'],
  ])('%s → error', (line, message) => {
    const [out] = run(line, []).output;
    expect(out.type).toBe('error');
    expect(out.type === 'error' && out.text).toContain(message);
  });

  it('opens the résumé and profile links', () => {
    expect(run('open resume.pdf', []).effect).toEqual({
      type: 'open',
      url: profile.resumeUrl,
    });
    expect(run('open github', ['research']).effect).toEqual({
      type: 'open',
      url: profile.links.github,
    });
  });

  it.each([
    ['theme dark', { type: 'theme', theme: 'dark' }],
    ['clear', { type: 'clear' }],
    ['exit', { type: 'exit' }],
  ])('%s has its effect', (line, effect) => {
    expect(run(line, []).effect).toEqual(effect);
  });
});

describe('complete', () => {
  it.each([
    ['cle', [], 'clear '],
    ['cd pro', [], 'cd projects/'],
    ['cat who', [], 'cat whoami.json'],
    ['cat ../who', ['projects'], 'cat ../whoami.json'],
    // Ambiguous: 'clear' and 'cd' and 'cat' share only 'c'.
    ['c', [], 'c'],
    ['cat zzz', [], 'cat zzz'],
  ])('%s in %j → %s', (line, cwd, expected) => {
    expect(complete(line, cwd)).toBe(expected);
  });

  it('only completes directories after cd', () => {
    expect(complete('cd w', [])).toBe('cd w');
  });
});
