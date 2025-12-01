export const formatDate = (date: Date) => date.toISOString().split('T')[0]

export const base64ToFile = (base64: string, filename: string, type: string): File => {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);

    return new File([byteArray], filename, { type });
}

