"use client";

import { Loader2 } from "lucide-react";
import styled, { keyframes } from "styled-components";

// Wave Animation
const waveAnimation = keyframes`
  0% {
    height: 10px;
  }
  50% {
    height: 50px;
  }
  100% {
    height: 10px;
  }
`;

const LoadingWave = styled.div`
    width: 300px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
`;

const LoadingBar = styled.div`
    width: 20px;
    height: 10px;
    margin: 0 5px;
    background-color: #f2545b;
    border-radius: 5px;
    animation: ${waveAnimation} 1s ease-in-out infinite;

    &:nth-child(2) {
        animation-delay: 0.1s;
    }

    &:nth-child(3) {
        animation-delay: 0.2s;
    }

    &:nth-child(4) {
        animation-delay: 0.3s;
    }
`;

export function WavyLoader() {
    return (
        <LoadingWave>
            <LoadingBar />
            <LoadingBar />
            <LoadingBar />
            <LoadingBar />
        </LoadingWave>
    );
}

export function SimpleLoader() {
    return (
        <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
