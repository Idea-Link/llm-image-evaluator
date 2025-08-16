import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '../..');
const webDir = path.join(rootDir, 'apps/web');

describe('Next.js Application Setup', () => {
  it('should have Next.js configuration', () => {
    expect(fs.existsSync(path.join(webDir, 'next.config.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'tsconfig.json'))).toBe(true);
  });

  it('should have Tailwind CSS configuration', () => {
    expect(fs.existsSync(path.join(webDir, 'tailwind.config.ts'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'postcss.config.mjs'))).toBe(true);
  });

  it('should have App Router structure', () => {
    const appDir = path.join(webDir, 'src/app');
    expect(fs.existsSync(appDir)).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'layout.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'page.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(appDir, 'globals.css'))).toBe(true);
  });

  it('should have required directories', () => {
    expect(fs.existsSync(path.join(webDir, 'src/components/ui'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'src/components/features'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'src/services'))).toBe(true);
    expect(fs.existsSync(path.join(webDir, 'src/stores'))).toBe(true);
  });

  it('should have correct Next.js version', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(webDir, 'package.json'), 'utf-8')
    );
    expect(packageJson.dependencies.next).toMatch(/^15\./);
  });

  it('should have Tailwind CSS version 3.4+', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(webDir, 'package.json'), 'utf-8')
    );
    expect(packageJson.devDependencies.tailwindcss).toMatch(/^\^3\.4/);
  });
});