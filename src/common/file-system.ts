import * as fs from 'node:fs';
import * as path from 'node:path';

export abstract class FileSystem {
  static copyFile(src: string, dest: string) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      FileSystem.copyDirectory(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  static copyDirectory(srcDir: string, destDir: string) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
      const srcFile = path.resolve(srcDir, file);
      const destFile = path.resolve(destDir, file);
      FileSystem.copyFile(srcFile, destFile);
    }
  }

  static isEmptyDir(path: string, options?: { ignorePaths?: string[] }) {
    const files = fs.readdirSync(path);

    const ignorePaths = options?.ignorePaths || [];

    const filteredFiles = files.filter((file) => !ignorePaths.includes(file));

    return filteredFiles.length === 0;
  }

  static clearDir(dir: string, options?: { ignorePaths?: string[] }) {
    if (!fs.existsSync(dir)) {
      return;
    }

    const ignorePaths = options?.ignorePaths || [];

    for (const file of fs.readdirSync(dir)) {
      if (ignorePaths.includes(file)) {
        continue;
      }

      fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
    }
  }
}
