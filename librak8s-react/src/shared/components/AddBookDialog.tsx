import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusCircle } from "lucide-react";
import { BookForm } from "@/features/books/components/BookForm.tsx";
import { Book } from "@/features/books/types";

interface BookDialogProps {
    open: boolean
    setOpen: (b: boolean) => void
    book?: Book
    showTrigger?: boolean
}

export function BookDialog({ open, setOpen, book, showTrigger = true }: BookDialogProps) {
    const isEditing = !!book

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un livre
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Modifier le livre' : 'Nouveau livre'}</DialogTitle>
                </DialogHeader>
                <BookForm onSuccess={() => setOpen(false)} book={book} />
            </DialogContent>
        </Dialog>
    )
}