import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'

interface WarningDialogProps {
  warningMessage: string
  warningDialogOpen: boolean
  setWarningDialogOpen: (open: boolean) => void
}

import { Button } from '@/components/ui/button'

const WarningDialog: React.FC<WarningDialogProps> = ({ warningMessage, warningDialogOpen, setWarningDialogOpen }) => {

  return (
    <Dialog open={warningDialogOpen} onOpenChange={setWarningDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Peringatan</DialogTitle>
        </DialogHeader>
        <p>{warningMessage}</p>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setWarningDialogOpen(false)}>Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WarningDialog
