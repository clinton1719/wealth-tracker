import { scan } from '@sonar/scan';

scan({
  serverUrl: 'http://localhost:9000',
  options: {
    'sonar.projectKey': 'desi-wealth-tracker-frontend',
    'sonar.projectName': 'desi-wealth-tracker-frontend',
    'sonar.login': 'sqa_977f1710949bf159edfd575b202f4327ee2e6e2b',
    'sonar.sources': 'src',
    'sonar.typescript.tsconfigPath': 'tsconfig.sonar.json',
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    'sonar.sourceEncoding': 'UTF-8',
  },
}).then(() => {
  console.log('Scan complete');
  process.exit(0);
});