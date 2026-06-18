interface MathBlock {
    type: string;
    tex: string;
}
export class MarkdownService {
    static parse(src: string): string {
        if (!src)
            return '';
        let s = src;
        // Stash math blocks
        const mathStash: MathBlock[] = [];
        s = s.replace(/\$\$([\s\S]+?)\$\$/g, (m: string, tex: string): string => {
            mathStash.push({ type: 'display', tex: tex });
            return `\x00MATH${mathStash.length - 1}\x00`;
        });
        s = s.replace(/\$([^\n$]+?)\$/g, (m: string, tex: string): string => {
            mathStash.push({ type: 'inline', tex: tex });
            return `\x00MATH${mathStash.length - 1}\x00`;
        });
        // Standard Markdown
        s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^---+$/gm, '<hr>')
            .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
            .replace(/^[*\-] (.+)$/gm, '<li>$1</li>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
        // Paragraphs
        const paragraphs = s.split(/\n\n+/);
        const result: string[] = [];
        for (let idx = 0; idx < paragraphs.length; idx++) {
            const trimmed = paragraphs[idx].trim();
            if (/^<(h[1-6]|ul|ol|li|blockquote|hr)/.test(trimmed)) {
                result.push(trimmed);
            }
            else {
                result.push(`<p>${trimmed.replace(/\n/g, '<br>')}</p>`);
            }
        }
        s = result.join('\n');
        // Restore math
        s = s.replace(/\x00MATH(\d+)\x00/g, (m: string, i: string): string => {
            const block = mathStash[Number(i)];
            const type = block.type;
            const tex = block.tex;
            return type === 'display'
                ? `<div style="text-align:center;margin:1em 0;font-style:italic">$$${tex}$$</div>`
                : `<span style="font-style:italic">$${tex}$</span>`;
        });
        return s;
    }
    static extractTitle(content: string, mode: string): string {
        if (!content)
            return 'Untitled Note';
        let text = content;
        if (mode === 'rich') {
            text = content.replace(/<[^>]+>/g, ' ');
        }
        const firstLine = text.split('\n')[0].replace(/^#+\s*/, '');
        return firstLine.slice(0, 40) || 'Untitled Note';
    }
}
