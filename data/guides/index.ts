import content from './content.json';
import sourceData from './sources.json';

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: string[];
  items: string[];
  table: { caption: string; columns: string[]; rows: string[][] } | null;
  sourceIds: string[];
}
export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  primaryKeyword: string;
  reviewedOn: string;
  answer: string;
  sections: GuideSection[];
  roleSlugs: string[];
  relatedSlugs: string[];
  faq: { question: string; answer: string }[];
  sourceIds: string[];
  download: { path: string; label: string; format: string } | null;
}
export const GUIDES: Guide[] = content;
export const GUIDE_SOURCES: Record<string, { title: string; url: string }> = sourceData;
export const GUIDE_CATEGORIES = [...new Set(GUIDES.map(guide => guide.category))];
export const getGuide = (slug: string) => GUIDES.find(guide => guide.slug === slug);
export const getGuidesForRole = (slug: string) => GUIDES.filter(guide => guide.roleSlugs.includes(slug)).slice(0, 3);
export const guidePath = (guide: Guide) => `/guides/${guide.slug}`;
export function readingMinutes(guide: Guide) {
  const text = [guide.answer, ...guide.sections.flatMap(section => [section.title, ...section.paragraphs, ...section.items, ...(section.table?.rows.flat() ?? [])])].join(' ');
  return Math.max(3, Math.ceil(text.split(/\s+/).length / 180));
}
