import { Link } from "react-router";

export default function ErrorPage({ errorCode }: ErrorPageProps) {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl">{errorCode}</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    {errorCodeToMessage(errorCode)}
                </p>
                <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>
    )
}

type ErrorPageProps = {
    errorCode: number;
};

function errorCodeToMessage(code: number): string {
    switch (code) {
        case 404:
            return "Oops, it looks like the page you're looking for doesn't exist.";
        case 500:
            return "Oops, something went wrong on our end.";
        default:
            return "Oops, an unexpected error occurred.";
    }
}