export function InputError({ error }: { error: string[] | string }) {
    return (
        <>
            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error[0]}
                </p>
            )}
        </>
    )
}
