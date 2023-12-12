import { LinkButton } from '../LinkButton/LinkButton';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

export function NavBar() {
  return (
    <header className="fixed flex h-16 w-full items-center justify-center border-b border-border-default">
      <nav className="flex items-center">
        <LinkButton href="/login">Login</LinkButton>
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
