export const elipsis = (text: string, maxLength=250) => text.substring(0, maxLength - 3) + (text.length > maxLength ? '...' : '');

export const matchLast = (text: string, match: RegExp) => {
    const matches = [...text.matchAll(match)]
    return matches?.length ? matches.pop() : '';
} 