"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthErrorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthErrorModal({
  open,
  onOpenChange,
}: AuthErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] rounded-[24px] p-6">
        <DialogTitle className="text-lg font-semibold text-foreground">
          Login gagal
        </DialogTitle>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Akun tidak ditemukan, silakan periksa kembali email/password/role milik Anda.
        </p>

        <div className="mt-5">
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Oke
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}