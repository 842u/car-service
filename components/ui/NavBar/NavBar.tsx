import { LinkButton } from '../LinkButton/LinkButton';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

export function NavBar() {
  return (
    <header className="border-border-default fixed flex h-16 w-full items-center justify-center border-b">
      <nav className="flex items-center">
        <LinkButton href="/login">Login</LinkButton>
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
