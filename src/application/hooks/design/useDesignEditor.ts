/// TO BE IMPLEMENTED PRORPERLY

/**
 * Design Editor Hook
 * @module application/hooks/design/useDesignEditor
 *
 * @description
 * Hook for managing the design editor state and operations.
 * Handles design editing, transformations, and applied effects.
 *
 * Dependencies:
 * - DesignEditorDto from application layer
 * - IDesignService from domain layer
 * - IStorageService from domain layer
 */

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DesignEditorDto,
  DesignTransformDto,
  DesignEffectDto,
} from "@/application/dtos/design";
import { IDesignService } from "@/domain/ports/services/IDesignService";
import { IStorageService } from "@/domain/ports/services/IStorageService";
import { ValidationError } from "@/domain/common/errors";
import { toast } from "@/components/ui/use-toast";

interface EditorState {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
  selectedEffect: string | null;
  history: DesignTransformDto[];
  historyIndex: number;
}

export interface UseDesignEditorReturn {
  /** Editor state */
  editorState: EditorState;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Transform design */
  transformDesign: (transform: DesignTransformDto) => void;
  /** Apply effect */
  applyEffect: (effect: DesignEffectDto) => Promise<boolean>;
  /** Undo last action */
  undo: () => void;
  /** Redo last undone action */
  redo: () => void;
  /** Reset transformations */
  reset: () => void;
  /** Save current state */
  saveState: () => Promise<boolean>;
}

/**
 * Hook for managing design editor
 *
 * @param designService - Instance of IDesignService
 * @param storageService - Instance of IStorageService
 * @param designId - ID of the design being edited
 * @returns Design editor functionality and state
 */
export const useDesignEditor = (
  designService: IDesignService,
  storageService: IStorageService,
  designId: string,
): UseDesignEditorReturn => {
  const [editorState, setEditorState] = useState<EditorState>({
    scale: 1,
    rotation: 0,
    position: { x: 0, y: 0 },
    selectedEffect: null,
    history: [],
    historyIndex: -1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Reference to keep track of unsaved changes
  const hasUnsavedChanges = useRef(false);

  // Transform design handler
  const transformDesign = useCallback((transform: DesignTransformDto) => {
    setEditorState((prev) => {
      // Remove any redo history when making a new change
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);

      return {
        ...prev,
        ...transform,
        history: [...newHistory, transform],
        historyIndex: newHistory.length,
      };
    });

    hasUnsavedChanges.current = true;
  }, []);

  // Effect application handler
  const applyEffect = useCallback(
    async (effect: DesignEffectDto): Promise<boolean> => {
      try {
        setIsLoading(true);

        // Process effect through storage service first
        const processedImage = await storageService.transformImage(
          designId,
          effect,
        );

        // Update design with processed image
        await designService.updateDesignImage(designId, processedImage);

        setEditorState((prev) => ({
          ...prev,
          selectedEffect: effect.type,
        }));

        toast({
          title: "Effect Applied",
          description: `${effect.type} effect has been applied`,
        });

        hasUnsavedChanges.current = true;
        return true;
      } catch (err) {
        toast({
          title: "Effect Failed",
          description: "Failed to apply effect",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [designId, designService, storageService],
  );

  // Undo handler
  const undo = useCallback(() => {
    setEditorState((prev) => {
      if (prev.historyIndex < 0) return prev;

      const newIndex = prev.historyIndex - 1;
      const previousState =
        newIndex >= 0
          ? prev.history[newIndex]
          : { scale: 1, rotation: 0, position: { x: 0, y: 0 } };

      return {
        ...prev,
        ...previousState,
        historyIndex: newIndex,
      };
    });

    hasUnsavedChanges.current = true;
  }, []);

  // Redo handler
  const redo = useCallback(() => {
    setEditorState((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;

      const newIndex = prev.historyIndex + 1;
      return {
        ...prev,
        ...prev.history[newIndex],
        historyIndex: newIndex,
      };
    });

    hasUnsavedChanges.current = true;
  }, []);

  // Reset handler
  const reset = useCallback(() => {
    setEditorState({
      scale: 1,
      rotation: 0,
      position: { x: 0, y: 0 },
      selectedEffect: null,
      history: [],
      historyIndex: -1,
    });

    hasUnsavedChanges.current = true;
  }, []);

  // Save state handler
  const saveState = useCallback(async (): Promise<boolean> => {
    if (!hasUnsavedChanges.current) return true;

    try {
      setIsLoading(true);

      await designService.updateTransformations(designId, {
        scale: editorState.scale,
        rotation: editorState.rotation,
        position: editorState.position,
      });

      toast({
        title: "Changes Saved",
        description: "Your changes have been saved successfully",
      });

      hasUnsavedChanges.current = false;
      return true;
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Failed to save changes",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [designId, designService, editorState]);

  // Prompt for unsaved changes on unmount
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return {
    editorState,
    isLoading,
    error,
    transformDesign,
    applyEffect,
    undo,
    redo,
    reset,
    saveState,
  };
};
