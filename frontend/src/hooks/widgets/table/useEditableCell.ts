// src/hooks/useEditableCell.ts
import React from 'react';

export interface EditingCell {
  row: number;
  col: number;
}

export const useEditableCell = () => {
  const [editingCell, setEditingCell] = React.useState<EditingCell | null>(null);
  const [editingValue, setEditingValue] = React.useState<string>('');

  return { editingCell, setEditingCell, editingValue, setEditingValue };
};
