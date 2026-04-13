
import React, { useState, useRef, useEffect } from 'react';
import { JournalEntry, Blessing } from '../types';
import { BookOpenIcon, BoldIcon, ItalicIcon, ListBulletIcon, FaceSmileIcon, PhotoIcon, XIcon } from '../components/icons';

interface JournalPageProps {
    entries: JournalEntry[];
    onSaveEntry: (content: string) => void;
    blessings: Blessing[];
}

const COMMON_EMOJIS = ['✨', '🙏', '❤️', '🌟', '🍀', '🏠', '🍎', '🌈', '💡', '🌻', '🧘', '🕊️'];

const renderInline = (text: string) => {
    // Basic bold/italic parsing without regex for speed and safety
    // Also handle Markdown images: ![alt](url)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|!\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('![') && part.includes('](')) {
            const altStart = 2;
            const altEnd = part.indexOf(']');
            const urlStart = part.indexOf('(') + 1;
            const urlEnd = part.lastIndexOf(')');
            const alt = part.substring(altStart, altEnd);
            const url = part.substring(urlStart, urlEnd);
            return (
                <div key={i} className="my-4 rounded-xl overflow-hidden shadow-md max-w-sm border border-gray-100 dark:border-gray-800">
                    <img src={url} alt={alt} className="w-full h-auto object-cover" />
                    {alt && <p className="bg-gray-50 dark:bg-gray-900/50 p-2 text-[10px] text-gray-500 italic text-center">{alt}</p>}
                </div>
            );
        }
        return part;
    });
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: React.ReactNode[] = [];

    const flushList = () => {
        if (listBuffer.length > 0) {
            elements.push(
                <ul key={`list-${elements.length}`} className="list-disc ml-6 mb-3 space-y-1 text-gray-700 dark:text-gray-300">
                    {[...listBuffer]}
                </ul>
            );
            listBuffer = [];
        }
    };

    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            listBuffer.push(
                <li key={idx} className="pl-1 leading-relaxed">
                    {renderInline(trimmed.substring(2))}
                </li>
            );
        } else {
            flushList();
            elements.push(
                <p key={idx} className="mb-2 last:mb-0 min-h-[1.5rem] leading-relaxed text-gray-700 dark:text-gray-300">
                    {renderInline(line)}
                </p>
            );
        }
    });
    flushList();

    return <div className="markdown-journal-entry">{elements}</div>;
};

const JournalPage: React.FC<JournalPageProps> = ({ entries, onSaveEntry, blessings }) => {
    const [newEntry, setNewEntry] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const imagePickerRef = useRef<HTMLDivElement>(null);

    // Close popovers on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
            if (imagePickerRef.current && !imagePickerRef.current.contains(event.target as Node)) {
                setShowImagePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEntry.trim()) return;
        onSaveEntry(newEntry);
        setNewEntry('');
    };

    const applyFormat = (prefix: string, suffix: string = prefix) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = newEntry.substring(start, end);
        const before = newEntry.substring(0, start);
        const after = newEntry.substring(end);

        const newContent = before + prefix + selectedText + suffix + after;
        setNewEntry(newContent);
        
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const insertTextAtCursor = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const before = newEntry.substring(0, start);
        const after = newEntry.substring(start);
        setNewEntry(before + text + after);
        setTimeout(() => {
            textarea.focus();
            const pos = start + text.length;
            textarea.setSelectionRange(pos, pos);
        }, 0);
    };

    const addListItem = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const before = newEntry.substring(0, start);
        const after = newEntry.substring(start);
        const needsNewline = before.length > 0 && !before.endsWith('\n');
        const insert = (needsNewline ? '\n' : '') + '- ';
        setNewEntry(before + insert + after);
        setTimeout(() => {
            textarea.focus();
            const pos = start + insert.length;
            textarea.setSelectionRange(pos, pos);
        }, 0);
    };

    const handlePickImage = (blessing: Blessing) => {
        if (!blessing.imageUrl) return;
        const mdImage = `\n![${blessing.text}](${blessing.imageUrl})\n`;
        insertTextAtCursor(mdImage);
        setShowImagePicker(false);
    };

    return (
        <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 md:p-10">
            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 font-serif">Gratitude Journal</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Enrich your reflections with visuals and emojis.
                </p>
            </header>

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="mb-10 bg-white/40 dark:bg-gray-900/20 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm">
                    {/* Markdown Toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 relative">
                        <button 
                            type="button" 
                            onClick={() => applyFormat('**')} 
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400"
                            title="Bold"
                        >
                            <BoldIcon className="w-5 h-5" />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => applyFormat('*')} 
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400"
                            title="Italic"
                        >
                            <ItalicIcon className="w-5 h-5" />
                        </button>
                        <button 
                            type="button" 
                            onClick={addListItem} 
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400"
                            title="List"
                        >
                            <ListBulletIcon className="w-5 h-5" />
                        </button>
                        
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

                        {/* Emoji Trigger */}
                        <div className="relative" ref={emojiPickerRef}>
                            <button 
                                type="button" 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                                className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors ${showEmojiPicker ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                                title="Emoji"
                            >
                                <FaceSmileIcon className="w-5 h-5" />
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 grid grid-cols-4 gap-1 animate-fade-in">
                                    {COMMON_EMOJIS.map(emoji => (
                                        <button 
                                            key={emoji}
                                            type="button"
                                            onClick={() => { insertTextAtCursor(emoji); setShowEmojiPicker(false); }}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xl"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Image/Postcard Trigger */}
                        <div className="relative" ref={imagePickerRef}>
                            <button 
                                type="button" 
                                onClick={() => setShowImagePicker(!showImagePicker)} 
                                className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors ${showImagePicker ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
                                title="Insert AI Postcard"
                            >
                                <PhotoIcon className="w-5 h-5" />
                            </button>
                            {showImagePicker && (
                                <div className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 min-w-[280px] max-h-64 overflow-y-auto animate-fade-in">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your AI Postcards</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {blessings.filter(b => b.imageUrl).length > 0 ? (
                                            blessings.filter(b => b.imageUrl).map(b => (
                                                <button 
                                                    key={b.id}
                                                    type="button"
                                                    onClick={() => handlePickImage(b)}
                                                    className="group relative rounded-lg overflow-hidden border border-transparent hover:border-blue-500 transition-all"
                                                >
                                                    <img src={b.imageUrl} alt={b.text} className="w-full h-16 object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-bold p-1 text-center leading-tight">
                                                        Insert
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="col-span-2 text-xs text-gray-500 italic py-2">Generate Postcards in the 'Counter' tab first.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        placeholder="What are you grateful for today? Add emojis or insert your AI postcards..."
                        rows={6}
                        className="w-full p-4 bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow resize-none"
                    />
                    <div className="flex justify-between items-center px-4 py-3 bg-gray-50/30 dark:bg-gray-900/30">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Postcards & Markdown</span>
                        <button
                            type="submit"
                            disabled={!newEntry.trim()}
                            className="inline-flex items-center justify-center px-6 py-2 font-bold text-sm text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all transform active:scale-95"
                        >
                            Save Entry
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    {entries.length > 0 ? (
                        entries.map(entry => (
                            <div key={entry.id} className="bg-white/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm transition-all hover:shadow-md animate-fade-in-up">
                                <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 mb-4 uppercase tracking-[0.2em]">
                                    {new Date(entry.date).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                                <MarkdownRenderer content={entry.content} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                            <BookOpenIcon className="mx-auto w-12 h-12 text-gray-300 dark:text-gray-600" />
                            <p className="mt-4 text-gray-400 dark:text-gray-500 font-medium">Your journal is waiting for your story.</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2 uppercase tracking-[0.2em]">Write your first entry above.</p>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
                .markdown-journal-entry ul {
                    list-style-type: disc;
                }
            `}</style>
        </div>
    );
};

export default JournalPage;
