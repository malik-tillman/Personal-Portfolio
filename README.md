# Personal Portfolio v4

Repository for the v4 of my Personal Portfolio built with Angular.

## Todo

- [x] ~~Migrate to latest Angular version~~ 
- [x] ~~Migrate from Strapi --> Sanity.io~~
- [x] ~~Implement SSG~~
- [x] ~~Implement better SEO/SEM~~ 
- [x] ~~Performance audit (Core Web Vitals)~~
- [ ] Add new features
  - [x] ~~Better value proposition and project showcasing~~
  - [ ] Testimonials (social proof)
  - [x] ~~Case Studies~~
  - [x] ~~Metric~~
  - [x] ~~Better "wow factor" (animations, etc.)~~
  - [ ] Dark mode
  - [ ] Blog
  - [ ] Filtering (don't need)
  - [ ] Search (lite semantic search) (don't need)
  - [x] ~~Availability status (don't need)~~

## Deploy TODO
- [ ] Validate data in Sanity
- [ ] Make design tweaks
- [ ] Review codebase
- [ ] Review PR and merge
- [ ] Deploy

## Roadmap

Ordered by dependency and conversion impact. Complete infrastructure items first before building new features on top.

### Infrastructure (do in order — each unblocks the next)

~~1. **Migrate to latest Angular** — foundation for everything; SSG requires modern Angular (`@angular/ssr`)~~
~~2. **Migrate Strapi → Sanity** — switch CMS before building new features so content schema is stable~~
~~3. **Implement SSG** — requires Angular migration; dramatically improves load time and crawlability~~
~~4. **Implement better SEO/SEM** — pairs with SSG; add meta tags, Open Graph, structured data, sitemap~~

### New Features (ordered by conversion impact)

~~5. **Better value proposition + metrics** — homepage first impression; high impact, low dev effort~~
6. **Testimonials (social proof)** — trust signal for freelance clients; quick win
~~7. **Better wow factor (animations)** — polish pass; scroll-triggered animations, micro-interactions~~
8. **Dark mode** — self-contained UI feature; persist via localStorage
~~9. **Case Studies** — deeper project storytelling; requires Sanity schema work + content effort~~
10. **Filtering** — project discoverability; requires stable project data from Sanity first
11. **Search (lite semantic)** — builds on top of filtering
12. **Availability status** — small feature; can bundle with dark mode or filtering pass
13. **Blog** — standalone concern; good for SEO long-term but lowest immediate conversion ROI
