import { render, screen, waitFor } from '@testing-library/react';
import GlobalRegisCounter from '@/components/GlobalRegisCounter';

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ total: 1234 }),
    })
);

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        span: ({ children, className }) => <span className={className}>{children}</span>,
    },
    useSpring: () => ({ set: jest.fn() }),
    useTransform: () => "1,234",
}));

describe('GlobalRegisCounter', () => {
    it('renders the registration count', async () => {
        render(<GlobalRegisCounter />);

        expect(screen.getByText('ชาวเมืองที่ลงทะเบียนแล้ว:')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('1,234')).toBeInTheDocument();
        });
    });
});
