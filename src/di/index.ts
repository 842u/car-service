import { DependencyContainer } from '@/di/container';
import { registerModules as registerAllModules } from '@/di/modules';

export const dependencyContainer = new DependencyContainer();

registerAllModules(dependencyContainer);

export { tokens as dependencyTokens } from '@/di/tokens';
