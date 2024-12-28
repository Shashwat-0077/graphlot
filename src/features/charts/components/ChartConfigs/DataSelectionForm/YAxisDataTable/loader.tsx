import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function YAxisDataTableSkeleton() {
    return (
        <div className="container mx-auto py-10">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">
                            <Skeleton className="h-7 w-full" />
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-7 w-full" />
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-7 w-full" />
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-7 w-full" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className="h-7 w-[60px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-7 w-full" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-7 w-full" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-7 w-full" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
