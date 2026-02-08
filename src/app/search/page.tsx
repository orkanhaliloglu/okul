import { redirect } from "next/navigation";

export default function SearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const type = searchParams.type;

    if (type === "universite") {
        const params = new URLSearchParams(searchParams as Record<string, string>);
        params.delete("type");
        redirect(`/yks-tercih-robotu?${params.toString()}`);
    } else {
        // Default to high school if type is lise or missing
        const params = new URLSearchParams(searchParams as Record<string, string>);
        params.delete("type");
        redirect(`/lgs-tercih-robotu?${params.toString()}`);
    }
}
