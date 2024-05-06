export interface cv {
    basics:       Basics;
    work:         ExtraWork[];
    extraWork:    ExtraWork[];
    volunteer:    ExtraWork[];
    education:    Education[];
    awards:       Award[];
    publications: Publication[];
    skills:       Skill[];
    languages:    Language[];
    interests:    Interest[];
    references:   Reference[];
}

export interface Award {
    title:   string;
    date:    string;
    awarder: string;
    summary: string;
}

export interface Basics {
    name:     string;
    label:    string;
    picture:  string;
    email:    string;
    website:  string;
    summary:  string;
    location: Location;
    profiles: Profile[];
}

export interface Location {
    address:     string;
    postalCode:  string;
    city:        string;
    countryCode: string;
    region:      string;
}

export interface Profile {
    network:  string;
    username: string;
    url:      string;
}

export interface Education {
    institution: string;
    area:        string;
    location:    string;
    studyType:   string;
    startDate:   string;
    endDate:     string;
    gpa:         string;
    courses:     string[];
}

export interface ExtraWork {
    company:      string;
    position:      string;
    website:       string;
    location:      string;
    startDate:     string;
    endDate:       string;
    summary:       string;
    organization?: string;
    highlights?:   string[];
}

export interface Interest {
    name:     string;
    keywords: string[];
}

export interface Language {
    language: string;
    fluency:  string;
}

export interface Publication {
    name:        string;
    publisher:   string;
    releaseDate: string;
    website:     string;
    summary:     string;
}

export interface Reference {
    name:      string;
    reference: string;
}

export interface Skill {
    name:     string;
    level:    string;
    keywords: string[];
}
