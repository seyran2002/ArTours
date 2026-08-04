
interface Localized {
    en: string;
    ru: string;
    hy: string;
}

export interface Testimonial {
    id: number
    name: Localized
    letter: Localized
    rating: number
    tour: Localized
    comment: Localized
    avatarColor: string
}