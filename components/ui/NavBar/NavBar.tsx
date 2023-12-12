import { LinkButton } from '../LinkButton/LinkButton';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

export function NavBar() {
  return (
    <header className="fixed flex h-16 w-full items-center justify-center border-b border-border-default">
      <nav>
        <div className="flex items-center justify-center">
          <LinkButton href="/login">Login</LinkButton>
          <div className="h-6 w-6">
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
}
