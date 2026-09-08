//Serve come classe di errore personalizzata per gestire gli errori specifici dell'applicazione.
export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;
    }
}