// Translated privacy and terms pages. Text can use **bold** and {email} (the contact email, as a link).
export type LegalSection = { h?: string; id?: string; p?: string[]; ul?: string[] };
export type LegalDoc = { title: string; description: string; updated: string; intro: string[]; sections: LegalSection[] };
