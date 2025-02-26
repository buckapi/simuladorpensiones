declare module 'bootstrap' {
    export const Modal: any;
}

declare global {
    interface Window {
        bootstrap: any; // Agregar la propiedad bootstrap
    }
}