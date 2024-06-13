import React, { forwardRef } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import styled from 'styled-components';

export interface LoadingButtonProps {
  type: "skyler" | "neutral" | "cancel" | "destructive" | "warning" | "success";
  children: string;
  onClick?: () => void;
  loading: boolean;
  className?: string;
}

const StyledButton = styled(Button)<{ btnType: string }>`
  background-color: ${(props) => {
    switch (props.btnType) {
      case "success":
        return "rgb(203, 251, 182)";
      case "warning":
        return "rgb(251, 255, 187)";
      case "skyler":
        return "var(--skyler-blue)";
      case "cancel":
        return "var(--deep-white-button)";
      case "neutral":
        return "var(--deep-white-button)";
      case "destructive":
        return "rgb(245, 187, 187)";
      default:
        return "initial";
    }
  }};
  color: ${(props) => {
    switch (props.btnType) {
      case "success":
        return "black";
      case "warning":
        return "black";
      case "skyler":
        return "white";
      case "cancel":
        return "var(--red)";
      case "neutral":
        return "var(--skyler-blue)";
      case "destructive":
        return "black";
      default:
        return "initial";
    }
  }};
  border: ${(props)=>{
      switch (props.btnType) {
        case "success":
          return "1px solid rgb(110, 244, 52)";
        case "warning":
          return "1px solid rgb(232, 248, 55)";
        case "destructive":
          return "1px solid rgb(253, 58, 58)";
        default:
          return "none";
    }
  }};
  &:hover {
    background-color: ${(props) => {
      switch (props.btnType) {
        case "success":
          return "rgb(144, 254, 96)";
        case "warning":
          return "rgb(245, 250, 165)";
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
