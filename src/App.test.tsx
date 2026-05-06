import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';
import { initI18n } from './i18n';

beforeAll(() => {
  initI18n();
});

describe('App Component', () => {
  it('renders correctly with default English', () => {
    render(<App />);
    expect(screen.getByText('Hello World!')).toBeInTheDocument();
  });

  it('contains English and Chinese buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '中文' })).toBeInTheDocument();
  });

  it('switches to Chinese when clicking Chinese button', () => {
    render(<App />);
    const chineseButton = screen.getByRole('button', { name: '中文' });
    fireEvent.click(chineseButton);
    expect(screen.getByText('你好世界！')).toBeInTheDocument();
  });

  it('switches back to English when clicking English button', () => {
    render(<App />);
    const chineseButton = screen.queryAllByRole(
      'button',
    )[1] as HTMLButtonElement;
    console.log('1111111', chineseButton);
    fireEvent.click(chineseButton);
    expect(screen.getByText('你好世界！')).toBeInTheDocument();

    const englishButton = screen.queryAllByRole(
      'button',
    )[0] as HTMLButtonElement;
    fireEvent.click(englishButton);
    expect(screen.getByText('Hello World!')).toBeInTheDocument();
  });
});
