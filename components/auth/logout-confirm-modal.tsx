"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type LogoutConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function LogoutConfirmModal({
  open,
  onOpenChange,
  onConfirm,
}: LogoutConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] rounded-[24px] p-6">
        <DialogTitle className="text-lg font-semibold text-foreground">
          Are you sure you want to log out from Manud Jaya Village?
        </DialogTitle>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Please ensure all important activity has been saved before logging out.
        </p>

        <div className="mt-5 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-500 hover:bg-red-600"
            onClick={onConfirm}
          >
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}