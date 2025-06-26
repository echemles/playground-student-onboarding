'use client';

import NextImage from 'next/image';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  initialSignature?: string;
  className?: string;
}

export function SignaturePad({ onSave, initialSignature, className }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showDrawingPad, setShowDrawingPad] = useState(true);
  const [savedSignature, setSavedSignature] = useState<string>(initialSignature || '');

  // Load initial signature if provided
  useEffect(() => {
    if (initialSignature !== savedSignature) {
      if (initialSignature) {
        setSavedSignature(initialSignature);
        setShowDrawingPad(false);
        setIsEmpty(false);
      } else {
        // If initialSignature is cleared from parent, clear our state
        setSavedSignature('');
        setShowDrawingPad(true);
        setIsEmpty(true);
        if (sigCanvas.current) {
          sigCanvas.current.clear();
        }
      }
    }
  }, [initialSignature, savedSignature]);

  const clear = useCallback(() => {
    // Clear the canvas if it exists
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    
    // Update all states to reflect cleared signature
    setIsEmpty(true);
    setSavedSignature('');
    
    // Always notify parent that signature is cleared
    onSave('');
    
    // Always show the drawing pad after clearing
    setShowDrawingPad(true);
  }, [onSave]);

  const save = () => {
    if (sigCanvas.current && !isEmpty) {
      // Create signature with white background
      const canvas = sigCanvas.current.getCanvas();
      
      // Get the current signature data
      const signatureData = sigCanvas.current.toDataURL('image/png');
      
      // Create a new canvas with white background
      const newCanvas = document.createElement('canvas');
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;
      const newContext = newCanvas.getContext('2d');
      
      if (newContext) {
        // Fill with white background
        newContext.fillStyle = 'white';
        newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);
        
        // Draw the signature on top
        const img = new Image();
        img.onload = () => {
          newContext.drawImage(img, 0, 0);
          const finalSignature = newCanvas.toDataURL('image/png');
          setSavedSignature(finalSignature);
          onSave(finalSignature);
          setShowDrawingPad(false);
        };
        img.src = signatureData;
      }
    }
  };

  const handleBeginStroke = () => {
    setIsEmpty(false);
  };

  const handleEdit = () => {
    setShowDrawingPad(true);
    // Only load the saved signature if we have one and we're switching to edit mode
    if (savedSignature) {
      // Use a small timeout to ensure the canvas is visible before trying to draw on it
      const timer = setTimeout(() => {
        if (sigCanvas.current) {
          sigCanvas.current.clear();
          sigCanvas.current.fromDataURL(savedSignature);
          setIsEmpty(false);
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {showDrawingPad ? (
        <>
          <div className="border border-gray-300 rounded-md bg-white">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              backgroundColor="white"
              canvasProps={{
                className: "w-full h-32 cursor-crosshair",
                style: { width: '100%', height: '128px', backgroundColor: 'white' }
              }}
              onBegin={handleBeginStroke}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={clear}
            >
              Clear
            </Button>
            <Button 
              type="button" 
              variant="default" 
              onClick={save}
              disabled={isEmpty}
            >
              Save Signature
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="border border-gray-300 rounded-md bg-white p-2">
            {savedSignature && (
              <NextImage 
                src={savedSignature} 
                alt="Saved signature" 
                width={200}
                height={100}
                className="max-h-32 mx-auto"
              />
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={clear}
            >
              Clear
            </Button>
            <Button 
              type="button" 
              variant="default" 
              onClick={handleEdit}
            >
              Edit Signature
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
