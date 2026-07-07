export function formatTime(iso: string): string {
    const date = new Date(iso)
    return date.toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit',
    })
}