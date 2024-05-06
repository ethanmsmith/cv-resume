'use-strict';
import moment from 'moment';
import { Basics, Location, Profile } from './cv';
type cvSkill = {
    category: string,
    skills: string[]
}

export type cvItem = {
    text: string
}

const cvItem = (item: cvItem) =>
    `\\item {${item.text.replace('#', '\\#').replace('%', '\\%')}}`;
const cvItems = (items: cvItem[]) =>
    `\\begin{cvitems}
        ${items.map(item => cvItem(item)).join('\n')}
    \\end{cvitems}`;
const cvSkill = (category: string, skills: string[]) =>
    `\\cvskill
        {${category}}
        {${skills.join(', ').replace('#', '\\#').replace('%', '\\%')}}`;
const cvEntry = (firstRow: string, secondRow: string, thirdRow: string, startDate: string, endDate: string, list: cvItem[]) =>
    `\\cventry
        {${firstRow}}
        {${secondRow}}
        {${thirdRow}}
        {${moment(startDate).format('YYYY.M.D')} $\\minus$ ${endDate !== "Present" ? moment(endDate).format('YYYY.M.D') : "Present"}}
        {
            ${cvItems(list)}
        }`;
const cvEntryColor = (firstRow: string, secondRow: string, thirdRow: string, startDate: string, endDate: string, list: cvItem[]) =>
    `\\cventry
        {${firstRow}}
        {${secondRow}}
        {${thirdRow}}
        {${moment(startDate).format('YYYY.M.D')} $\\minus$ ${endDate !== "Present" ? moment(endDate).format('YYYY.M.D') : "Present"}}
        {
            ${cvItems(list)}
        }`;

const cvPersonal = (person: Basics) => `
    \\name{${person.name.split(' ')[0]}}{${person.name.split(' ')[1]}}
    \\position{${person.label}}
    \\address{${person.location.city}, ${person.location.region}}
    \\email{${person.email}}
    \\homepage{${person.website}}
    ${person.profiles.filter(profile => profile.network === 'Github').length === 1 ? "\\github{" + person.profiles.filter(profile => profile.network === 'Github')[0].username + "}" : null}
    ${person.profiles.filter(profile => profile.network === 'LinkedIn').length === 1 ? "\\linkedin{" + person.profiles.filter(profile => profile.network === 'LinkedIn')[0].username + "}" : null}
`;

export const experience = (JobTitle: string, Organization: string, Location: string, StartDate: string, EndDate: string, Summary: string, highlights: cvItem[]) =>
    cvEntry(JobTitle, Organization, Location, StartDate, EndDate, [{ text: Summary }, ...highlights]);

export const skill = (Category: string, Skills: string[]) =>
    cvSkill(Category, Skills);

export const education = (Degree: string, University: string, Location: string, StartDate: string, EndDate: string, Classes: string[]) =>
    cvEntryColor(Degree, University, Location, StartDate, EndDate, [{ text: Classes.join(', ') }]);

export const personal = (person: Basics) =>
    cvPersonal(person);

export const summary = (summary: string) =>
    summary;