
import React, { useState, useRef } from 'react';
import { SpeakerWaveIcon, StopIcon, LoaderIcon } from './icons';
import { generateSpeech } from '../services/geminiService';

interface SpeechButtonProps {
    text: string;
    className?: string;
    size?: 'sm' | 'md';
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({ text, className = "", size = "md" }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

    const stopSpeaking = () => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current = null;
        }
        setIsSpeaking(false);
    };

    const handleSpeak = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSpeaking) {
            stopSpeaking();
            return;
        }

        if (!text) return;

        setIsLoading(true);
        try {
            const base64Audio = await generateSpeech(text);

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }

            const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                audioContextRef.current,
                24000,
                1
            );

            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.onended = () => {
                setIsSpeaking(false);
                sourceNodeRef.current = null;
            };

            sourceNodeRef.current = source;
            setIsSpeaking(true);
            source.start();
        } catch (error) {
            console.error("Speech Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    const buttonSize = size === 'sm' ? 'p-1.5' : 'p-2';

    return (
        <button
            onClick={handleSpeak}
            disabled={isLoading}
            className={`flex items-center justify-center rounded-full transition-all flex-shrink-0 ${buttonSize} ${
                isSpeaking
                    ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-300'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-500'
            } disabled:opacity-50 ${className}`}
            title={isSpeaking ? "Stop Voice of Peace" : "Listen to Voice of Peace"}
        >
            {isLoading ? (
                <LoaderIcon className={`${iconSize} animate-spin`} />
            ) : isSpeaking ? (
                <StopIcon className={iconSize} />
            ) : (
                <SpeakerWaveIcon className={iconSize} />
            )}
        </button>
    );
};

export default SpeechButton;
