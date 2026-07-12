import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

vi.mock('axios');

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: [] });
  });

  it('renders without crashing and fetches todos on load', async () => {
    render(<App />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it('displays todos returned from the API', async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, title: 'Buy milk', completed: false }],
    });
    render(<App />);
    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
  });

  it('adds a new todo', async () => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({ data: { id: 1, title: 'New task', completed: false } });

    render(<App />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'New task');

    const button = screen.getByRole('button', { name: /add/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/todos'),
        { title: 'New task' }
      );
    });
  });
});