import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '../..');

describe('Monorepo Structure', () => {
  it('should have the correct root structure', () => {
    expect(fs.existsSync(path.join(rootDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(rootDir, 'pnpm-workspace.yaml'))).toBe(true);
    expect(fs.existsSync(path.join(rootDir, 'turbo.json'))).toBe(true);
  });

  it('should have apps directory with required packages', () => {
    const appsDir = path.join(rootDir, 'apps');
    expect(fs.existsSync(appsDir)).toBe(true);
    expect(fs.existsSync(path.join(appsDir, 'web'))).toBe(true);
    expect(fs.existsSync(path.join(appsDir, 'api-lambda'))).toBe(true);
  });

  it('should have packages directory with required packages', () => {
    const packagesDir = path.join(rootDir, 'packages');
    expect(fs.existsSync(packagesDir)).toBe(true);
    expect(fs.existsSync(path.join(packagesDir, 'config'))).toBe(true);
    expect(fs.existsSync(path.join(packagesDir, 'shared'))).toBe(true);
    expect(fs.existsSync(path.join(packagesDir, 'supabase'))).toBe(true);
    expect(fs.existsSync(path.join(packagesDir, 'infra'))).toBe(true);
  });

  it('should have package.json files in all workspace packages', () => {
    const workspaces = [
      'apps/web',
      'apps/api-lambda',
      'packages/config',
      'packages/shared',
      'packages/supabase',
    ];

    workspaces.forEach((workspace) => {
      const packageJsonPath = path.join(rootDir, workspace, 'package.json');
      expect(fs.existsSync(packageJsonPath)).toBe(true);
    });
  });

  it('should have Supabase migrations directory', () => {
    const migrationsDir = path.join(rootDir, 'packages/supabase/migrations');
    expect(fs.existsSync(migrationsDir)).toBe(true);
  });
});