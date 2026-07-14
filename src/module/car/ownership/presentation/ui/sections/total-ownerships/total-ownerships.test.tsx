import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildOwnershipDto } from '@/car/ownership/application/dto/ownership.builder';
import { ownershipDataSource } from '@/car/ownership/dependency/data-source';
import { Result } from '@/common/application/result';
import { createMockUserDto } from '@/lib/jest/mock/src/module/user/application/dto/user';
import { SPINNER_TEST_ID } from '@/ui/decorative/spinner/spinner';
import { userDataSource } from '@/user/dependency/data-source';

import { TotalOwnershipsSection } from './total-ownerships';

jest.mock('@/user/dependency/data-source');
jest.mock('@/car/ownership/dependency/data-source');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const mockUserDataSource = userDataSource as jest.Mocked<typeof userDataSource>;
const mockOwnershipDataSource = ownershipDataSource as jest.Mocked<
  typeof ownershipDataSource
>;

const MOCK_USER = createMockUserDto();
const MOCK_OWNERSHIPS = [buildOwnershipDto(), buildOwnershipDto()];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUserDataSource.getSessionUser.mockResolvedValue({
    success: true,
    data: MOCK_USER,
  });
});

describe('TotalOwnershipsSection', () => {
  it('should render spinner while user is pending', () => {
    mockUserDataSource.getSessionUser.mockReturnValue(new Promise(() => {}));

    render(<TotalOwnershipsSection />, { wrapper: createWrapper() });

    expect(screen.getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
  });

  it('should render spinner while ownerships are pending', () => {
    mockOwnershipDataSource.getByOwnerId.mockReturnValue(new Promise(() => {}));

    render(<TotalOwnershipsSection />, { wrapper: createWrapper() });

    expect(screen.getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
  });

  it('should render ownership count when data is loaded', async () => {
    mockOwnershipDataSource.getByOwnerId.mockResolvedValue(
      Result.ok(MOCK_OWNERSHIPS),
    );

    render(<TotalOwnershipsSection />, { wrapper: createWrapper() });

    expect(
      await screen.findByText(String(MOCK_OWNERSHIPS.length)),
    ).toBeInTheDocument();
  });

  it('should render 0 when user has no ownerships', async () => {
    mockOwnershipDataSource.getByOwnerId.mockResolvedValue(Result.ok([]));

    render(<TotalOwnershipsSection />, { wrapper: createWrapper() });

    expect(await screen.findByText('0')).toBeInTheDocument();
  });

  it('should not render spinner after data is loaded', async () => {
    mockOwnershipDataSource.getByOwnerId.mockResolvedValue(
      Result.ok(MOCK_OWNERSHIPS),
    );

    render(<TotalOwnershipsSection />, { wrapper: createWrapper() });

    await waitFor(() =>
      expect(screen.queryByTestId(SPINNER_TEST_ID)).not.toBeInTheDocument(),
    );
  });
});
