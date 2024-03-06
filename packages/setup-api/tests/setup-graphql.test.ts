import { createFiles, installPackages, updatePackageJsonScripts } from '../lib/index'; // Adjust the import path as necessary
import * as shell from 'shelljs';
import * as fs from 'fs';

jest.mock('shelljs', () => ({
  exec: jest.fn().mockReturnValue({ code: 0 }),
  exit: jest.fn(),
  mkdir: jest.fn(),
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true),
  readFileSync: jest.fn().mockReturnValue(JSON.stringify({})),
}));

describe('setupGraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute npm install commands', () => {
    installPackages();
    expect(shell.exec).toHaveBeenCalledWith(expect.stringContaining('npm install graphql-request'));
    expect(shell.exec).toHaveBeenCalledWith(
      expect.stringContaining(
        'npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations',
      ),
    );
  });

  it('should create necessary files', () => {
    createFiles();
    expect(fs.writeFileSync).toHaveBeenCalledWith('codegen.yml', expect.any(String));
    expect(fs.writeFileSync).toHaveBeenCalledWith('graphql.config.yml', expect.any(String));
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('src/queries.graphql.ts'),
      expect.any(String),
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith('fetch-schema.sh', expect.any(String), {
      mode: 0o755,
    });
  });

  it('should add correct scripts to package.json', () => {
    updatePackageJsonScripts();
    const writtenContent = JSON.parse(
      (fs.writeFileSync as jest.Mock).mock.calls.find((call) => call[0] === './package.json')[1],
    );
    expect(writtenContent.scripts['fetch:schema']).toEqual('bash fetch-schema.sh');
    expect(writtenContent.scripts['codegen']).toEqual('graphql-codegen');
    expect(writtenContent.scripts['fetch:generate']).toEqual('npm run fetch:schema && npm run codegen');
  });
});
