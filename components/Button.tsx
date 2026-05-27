import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500';

const variants: Record<Variant, string> = {
  primary:
    'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-[0_4px_20px_rgba(255,107,0,0.35)] hover:shadow-[0_8px_28px_rgba(255,107,0,0.45)] hover:-translate-y-px rounded-sm',
  ghost:
    'bg-transparent text-orange-500 hover:text-orange-600 underline-offset-4 hover:underline rounded-sm',
  outline:
    'bg-transparent border-2 border-current text-orange-500 hover:bg-orange-500 hover:text-white rounded-sm',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-4 py-2 gap-1.5',
  md: 'text-sm px-6 py-3 gap-2',
  lg: 'text-base px-10 py-4 gap-2',
};

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
}

// Anchor (link) variant
interface LinkButtonProps
  extends ButtonBaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> {
  as: 'a';
}

// Button element variant
interface ButtonElementProps
  extends ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  as?: 'button';
}

type ButtonProps = LinkButtonProps | ButtonElementProps;

export default function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const className = [base, variants[variant], sizes[size], (props as { className?: string }).className]
    .filter(Boolean)
    .join(' ');

  if (props.as === 'a') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as: _as, ...rest } = props as LinkButtonProps;
    return <a {...rest} className={className} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as: _as, ...rest } = props as ButtonElementProps;
  return <button {...rest} className={className} />;
}
