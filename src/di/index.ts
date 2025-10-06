import { DependencyContainer } from '@/di/container';
import { registerModules as registerAllModules } from '@/di/module';

export const dependencyContainer = new DependencyContainer();

registerAllModules(dependencyContainer);

export { tokens as dependencyTokens } from '@/di/tokens';
