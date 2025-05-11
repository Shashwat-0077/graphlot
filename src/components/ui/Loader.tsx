"use client";

import { Loader2 } from "lucide-react";
import styled, { keyframes } from "styled-components";

// 3D Box Loader Animation
const StyledBoxWrapper = styled.div`
    .spinner {
        width: 44px;
        height: 44px;
        animation: spinner-y0fdc1 2s infinite ease;
        transform-style: preserve-3d;
    }

    .spinner > div {
        height: 100%;
        position: absolute;
        width: 100%;
        border: 2px solid #f2545b;
    }

    .spinner div:nth-of-type(1) {
        transform: translateZ(-22px) rotateY(180deg);
    }

    .spinner div:nth-of-type(2) {
        transform: rotateY(-270deg) translateX(50%);
        transform-origin: top right;
    }

    .spinner div:nth-of-type(3) {
        transform: rotateY(270deg) translateX(-50%);
        transform-origin: center left;
    }

    .spinner div:nth-of-type(4) {
        transform: rotateX(90deg) translateY(-50%);
        transform-origin: top center;
    }

    .spinner div:nth-of-type(5) {
        transform: rotateX(-90deg) translateY(50%);
        transform-origin: bottom center;
    }

    .spinner div:nth-of-type(6) {
        transform: translateZ(22px);
    }

    @keyframes spinner-y0fdc1 {
        0% {
            transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
        }

        50% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
        }

        100% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
        }
    }
`;

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

export function BoxLoader() {
    return (
        <StyledBoxWrapper>
            <div className="spinner">
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
        </StyledBoxWrapper>
    );
}

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
