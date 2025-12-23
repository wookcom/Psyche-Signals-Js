import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  className?: string;
  textClassName?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, className = '', textClassName = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <div className={`overflow-x-auto font-mono ${textClassName}`}>
        <pre className="m-0 font-inherit bg-transparent p-0 border-0">
          {code}
        </pre>
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 backdrop-blur-sm border border-white/5"
        title="Copiar código"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default CodeBlock;