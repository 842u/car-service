import { render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { DropdownContent } from '@/ui/dropdown/compounds/content/content';
import { useDropdownContent } from '@/ui/dropdown/compounds/content/use-content';
import { NavBar } from '@/ui/nav-bar/nav-bar';
import { Toaster } from '@/ui/toaster/toaster';

jest.mock('@/ui/dropdown/compounds/content/use-content', () => ({
  useDropdownContent: jest.fn(),
}));

// These three elements are fixed, siblings in the root stacking context, and
// each owns its z-index in its own file. Nothing in any one file states the
// order they have to keep, so this reads the values back and asserts it.
function stackingOrder(element: HTMLElement) {
  const utility = element.className
    .split(/\s+/)
    .find((className) => /^z-\d+$/.test(className));

  if (!utility) throw new Error(`no z utility found on <${element.tagName}>`);

  return Number(utility.replace('z-', ''));
}

async function renderFixedElements() {
  (useDropdownContent as jest.Mock).mockReturnValue({
    isOpen: true,
    position: { top: 0, left: 0 },
    contentRef: createRef(),
  });

  render(
    <>
      <NavBar>nav</NavBar>
      <DropdownContent>menu items</DropdownContent>
      <Toaster />
    </>,
  );

  return {
    navBar: screen.getByRole('banner'),
    panel: screen.getByText('menu items'),
    toaster: await screen.findByRole('region', { name: /notifications/i }),
  };
}

describe('stacking order', () => {
  it('should paint a dropdown panel above the nav bar', async () => {
    const { navBar, panel } = await renderFixedElements();

    expect(stackingOrder(panel)).toBeGreaterThan(stackingOrder(navBar));
  });

  it('should paint a toast above an open dropdown panel', async () => {
    const { panel, toaster } = await renderFixedElements();

    expect(stackingOrder(toaster)).toBeGreaterThan(stackingOrder(panel));
  });
});
