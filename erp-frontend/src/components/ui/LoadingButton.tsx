import React, { forwardRef } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import styled from 'styled-components';

interface LoadingButtonProps {
  type: "skyler" | "neutral" | "cancel" | "destructive";
  children: string;
  onClick: () => void;
  loading: boolean;
  className?: string;
}

const StyledButton = styled(Button)<{ btnType: string }>`
  background-color: ${(props) => {
    switch (props.btnType) {
      case "skyler":
        return "var(--skyler-blue)";
      case "cancel":
        return "var(--deep-white-button)";
      case "neutral":
        return "var(--deep-white-button)";
      case "destructive":
        return "var(--red)";
      default:
        return "initial";
    }
  }};
  color: ${(props) => {
    switch (props.btnType) {
      case "skyler":
        return "white";
      case "cancel":
        return "var(--red)";
      case "neutral":
        return "var(--skyler-blue)";
      case "destructive":
        return "white";
      default:
        return "initial";
    }
  }};
  &:hover {
    background-color: ${(props) => {
      switch (props.btnType) {
        case "skyler":
          return "var(--skyler-blue-hover)";
        case "cancel":
          return "var(--deep-white-button-hover)";
        case "neutral":
          return "var(--deep-white-button-hover)";
        case "destructive":
          return "var(--red-hover)";
        default:
          return "initial";
      }
    }};
  }
`;

// Use forwardRef to forward the ref to the underlying button element
export const LoadingButton: React.FC<LoadingButtonProps> = forwardRef<HTMLButtonElement, LoadingButtonProps>(({
  className,
  type,
  children,
  loading,
  onClick,
}, ref) => {
  return (
    <StyledButton
      ref={ref}
      disabled={loading}
      onClick={onClick}
      className={className}
      btnType={type}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </StyledButton>
  );
});
