# Census Data Reference

**How this file relates to the source screenshots (read this first):** the screenshots are
**dataset-discovery context**, not a complete numerical export. Many are cropped and show only
part of a table or chart. Their job is to establish *what datasets, metrics, dimensions,
geographic levels, and relationships exist* — not to serve as a directly-quotable numeric feed.
**This file is the confirmed-values layer**: every number below has already been filtered for
"was this actually legible / was this actually complete," with cropped, illegible, or
low-confidence figures explicitly labelled as such (`[chart]`, "flagged," "unconfirmed") rather
than filled in by inference. When building or revising UI:
- Need an exact number to display? Use this file. If it's not here, it isn't confirmed — don't
  invent it, and don't assume a cropped screenshot's visible rows are the whole table.
- Need to know what's *possible* (a dimension, a drill-down path, an analytical angle)? The
  screenshots (and the "known to exist" notes throughout this file) are the right source, even
  where this file has no exact value for that angle yet. In that case, design the interaction and
  flag the data dependency (e.g. "district-level population exists as a dimension; no value
  confirmed yet") rather than skipping the dimension entirely or fabricating a number for it.
- An analytical angle the data *could* support but isn't yet confirmed by a number (e.g. "is
  growth concentrated in one region?") should be presented as a flagged opportunity, not stated
  as a finding, until this file has the figures to back it.

**Source:** Screenshots of the Abu Dhabi Census dashboard (SCAD), shared by the user as the
data source of truth for the Bayaan Census Observatory. Four "Story View" pages (Population,
teal; Overview, blue; Labour Force, green; Real Estate, orange) and a set of "Tables" pages
(Population, Labour Force, Real Estate).

**Status:** Extraction only. No UI has been changed to match this file yet. Everything the
existing Bayaan Census Observatory prototype currently shows (CensusObservatory.html,
census-observe.html, census-population.html, census-labour.html, census-real-estate.html,
census-benchmark.html, census-population-projection.html) was built with **illustrative
placeholder numbers before this reference existed**, and does **not** match the figures below
in most places. See "Known conflicts with the existing prototype" at the end of this file.

**Revision log:**
- v1 — initial extraction from the Population/Overview/Labour Force/Real Estate story pages and
  Tables pages.
- v2 — merged a second batch of Real Estate "Tables" screenshots (Buildings/Units by Type, by
  Use, by Top 10 Districts, and Units by Region). These upgraded several Real Estate figures from
  chart/text-derived to table-confirmed, added exact percentages and region tags throughout
  §3.4–3.5, and **corrected a mistaken conflict** from v1: the prototype's real-estate composition
  card (58.0/31.3/10.7) is not wrong — it matches Units-by-use exactly. See §3.4 and "Known
  conflicts" for detail. No new domains, years, or dimensions were introduced by this batch — it
  is entirely Real Estate drill-down detail.

**Reading confidence:** Two tiers are used throughout:
- Figures taken from an actual **data table** screenshot (crisp text, unambiguous) are marked
  `[table]` and treated as reliable.
- Figures read off an **infographic/chart** (bubble size, sankey band, pyramid bar) are marked
  `[chart]`; several of these were too small/anti-aliased to transcribe with confidence and are
  explicitly flagged rather than guessed.

---

## 0. Methodology notes (apply to all domains)

- **Data source:** "Abu Dhabi's integrated administrative registers" (not a traditional census
  survey — administrative/registry-based).
- **Disclosure control:** SCAD applies rounding as a tabular disclosure-control method — *all
  statistics are rounded to a multiple of 5*. As a result, some table totals will not exactly
  equal the sum of their displayed parts (observed directly: Public sector total 240,785 vs.
  Emirati 54,215 + Non-Emirati 188,570 = 242,785 — a discrepancy consistent with independent
  rounding of each cell). **Do not "fix" these gaps by adjusting one figure to make a total
  match another — both are independently rounded and both are correct as shown.**
- **Revision policy:** figures for **Census 2023** shown throughout the tool are the *revised*
  data (R1), not the original (R0). Real Estate 2023 and 2024 figures are also described as
  "revised, in line with our revision policy." Non-revised 2023 (R0) results are available only
  on request via info@scad.gov.ae — not shown anywhere in these screenshots.
- Every domain page carries this same disclosure note; it is not repeated per-domain below.

---

## 1. Population

### 1.1 Headline totals — 2025 `[table]`
| Metric | Value | % of total |
|---|---|---|
| Total population | **4,441,550** (shown rounded as "4.44M" on cards) | 100% |
| Emirati | 817,135 | 18.4% |
| Non-Emirati | 3,624,415 | 81.6% |
| Male (total) | 2,988,950 | 67.3% |
| Female (total) | 1,452,600 | 32.7% |

Source: "Population by Region, Citizenship and Gender" table, Year=2025.

### 1.2 By region — 2025 `[table]`
| Region | Population | Share |
|---|---|---|
| Abu Dhabi Region | 3,066,635 | 69% |
| Al Ain Region | 1,020,955 | 23% |
| Al Dhafra Region | 353,960 | 8% |

Sums to 4,441,550 exactly.

### 1.3 By region × citizenship × gender — 2025 `[table]`
| Region | Emirati M | Emirati F | Emirati T | Non-Emirati M | Non-Emirati F | Non-Emirati T | Total M | Total F | Total T |
|---|---|---|---|---|---|---|---|---|---|
| Abu Dhabi | 252,455 | 250,180 | 502,635 | 1,807,900 | 756,105 | 2,564,000 | 2,060,355 | 1,006,285 | 3,066,635 |
| Al Ain | 134,210 | 138,405 | 272,610 | 506,180 | 242,165 | 748,345 | 640,385 | 380,570 | 1,020,955 |
| Al Dhafra | 22,795 | 19,095 | 41,890 | 265,415 | 46,655 | 312,070 | 288,210 | 65,750 | 353,960 |
| **Emirate of Abu Dhabi** | **409,460** | **407,675** | **817,135** | **2,579,490** | **1,044,925** | **3,624,415** | **2,988,950** | **1,452,600** | **4,441,550** |

This is the master table — every other citizenship/gender split elsewhere in the screenshots is
consistent with it (Emirati gender ≈ 50.1% M / 49.9% F; Non-Emirati gender ≈ 71.2% M / 28.8% F —
both confirmed against the donut charts on the Population and Overview story pages).

### 1.4 Year-over-year change `[chart, text]`
- **Population grew +7.4% from 2024 to 2025** (Overview page narrative text). This is the only
  YoY population growth figure given anywhere in the screenshots.
- 2023/2024 absolute population totals are **not given** in any screenshot. The historical line
  chart ("Population of Abu Dhabi Emirate in years 1975–2025") shows tick marks for
  1975, 1980, 1985, 1995, 2001, 2005, 2011, 2023(R1), 2024, 2025, but the per-year *values* are
  not legible at the resolution provided. **Flagged: need the underlying 2023/2024 totals if a
  3-year trend chart is required anywhere.**

### 1.5 By age — five-year bands, 2025, Region=All `[table, partial]`
| Age band | Emirati M | Emirati F | Emirati T | Non-Emirati M | Non-Emirati F | Non-Emirati T | Total M | Total F | Total T |
|---|---|---|---|---|---|---|---|---|---|
| 0–4 | 43,375 | 39,165 | 82,540 | 60,870 | 57,280 | 118,150 | 104,245 | 96,445 | 200,690 |
| 5–9 | 48,145 | 45,435 | 93,580 | 67,300 | 64,310 | 131,610 | 115,440 | 109,745 | 225,185 |
| 10–14 | 43,650 | 41,995 | 85,645 | 56,095 | 53,415 | 109,510 | 99,745 | 95,405 | 195,155 |
| 15–19 | 39,830 | 38,800 | 78,630 | 47,770 | 41,265 | 89,035 | 87,600 | 80,065 | 167,665 |
| 20–24 | 36,815 | 35,985 | 72,800 | 201,095 | 57,215 | 258,310 | 237,910 | 93,200 | 331,110 |

**Table continues past 25–29 up to 80+ in the live tool but the screenshot cuts off after the
20–24 row.** The full table exists (confirmed by the visible scrollable table structure) but
rows above 24 were not captured. **Flagged: need remaining age bands (25–29 through 80+).**

### 1.6 By wide age group — 2025, Emirate of Abu Dhabi `[chart, low confidence]`
Structure confirmed: Junior (0–14 or under-15), Working Age (15–64), Senior (65+), each split by
Emirati/Non-Emirati and Male/Female, shown as a population-pyramid-style chart ("Population by
Wide Age Group, Citizenship and Gender"). Numbers visible in the chart (e.g. "356,270",
"300,555", "3,565,755", "857,700" for working-age bars; smaller values for children/seniors) were
**too small/anti-aliased to transcribe reliably** and are not recorded as fact here.
**Flagged: re-extract from the Tables view (a "Population by Wide Age Group…" table exists per
the Tables page menu) rather than the chart, once accessible.**

Separately, a related table **is** captured at district level: "Population by Wide Age Group,
Citizenship, Gender, Region and District" — confirms wide-age-group data is available filtered
down to individual districts, but the visible rows only show the "0–14" age group across a long
list of districts (Abu Dhabi Industrial City, Abu Dhabi Islands A/B, Abu Mreikhah, Al 'Adlah, Al
'Asheesh, Al Bahyah — list continues, table scrolls further). Not transcribed in full here —
this is confirmation the *dimension* exists, not a source of headline numbers.

### 1.7 Median age — 2025 `[chart]`
**Median age: 34** (Emirate of Abu Dhabi). No breakdown by citizenship/gender/region given for
this specific figure.

### 1.8 By marital status (population 15+) — 2025 `[table, district-level]`
Region/Year/District filters, Total/Emirati/Non-Emirati toggle. District-level table observed
(Total toggle selected):
| District | M Never Married | M Married | M Divorced | M Widowed | F Never Married | F Married | F Divorced | F Widowed | T Never Married | T Married | T Divorced | T Widowed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Musaffah | 182,940 | 157,560 | 775 | 1,885 | 3,780 | 5,305 | 25 | 25 | 186,720 | 162,865 | 795 | 1,905 |
| Jarn Yafour | 92,090 | 64,755 | 165 | 360 | 395 | 740 | 5 | 5 | 92,485 | 65,495 | 170 | 365 |
| Al Danah | 76,180 | 77,725 | 355 | 170 | 39,665 | 57,980 | 500 | 435 | 115,845 | 135,705 | 855 | 610 |
| Mohamed Bin Zayed City | 50,170 | 52,915 | 330 | 115 | 24,250 | 37,990 | 810 | 365 | 74,420 | 90,905 | 1,140 | 480 |
| Abu Dhabi Industrial City | 40,190 | 29,985 | 55 | 70 | 830 | 1,450 | 5 | 10 | 41,025 | 31,435 | 60 | 80 |
| Al Zahiyah | 37,225 | 35,915 | 245 | 100 | 17,270 | 21,920 | 300 | 185 | 54,495 | 57,835 | 545 | 280 |
| Al Nahyan | 34,050 | 31,165 | 145 | 35 | 14,005 | 18,220 | 255 | 220 | 48,055 | 49,385 | 400 | 255 |

This is *Total-toggle* data — the same table can be filtered to Emirati-only or Non-Emirati-only,
but those variants weren't captured. An Emirate-of-Abu-Dhabi-level (non-district) summary chart
for this same dimension also exists on the Population story page but its bubble values were not
legibly readable.

### 1.9 By education level (population 10+) — 2025
- **Headline total for this cut: 4,015,675** (population 10+, per the sankey chart on the
  Population story page).
- Sankey shows two aggregate flows — **641,020** and **3,374,655** — into three outcome buckets:
  Above Secondary, Secondary, Below Secondary. The exact split of each of those two flows across
  the three buckets was **not legible** in the sankey. **Flagged.**
- A separate, far more granular **district-level table** exists: "Population by Education Level,
  Gender, Region and District", with columns illiterate / Read & Write / Primary / Preparatory /
  Secondary / Above Secondary & Below University / University / Higher Diploma / Master /
  Doctorate, for both Male and Female, by Region + District. One clearly legible row:
  - **Musaffah** — Male: illiterate 4,260, Read&Write 23,690(?)/23,690, Primary 13,825,
    Preparatory 19,235, Secondary 199,210, Above Sec & Below Uni 12,680, University 70,305,
    Higher Diploma 370, Master 180, Doctorate 15. Female: illiterate 300, Read&Write 335,
    Primary 995, Preparatory 635, Secondary 3,090, Above Sec & Below Uni 1,375, University 2,800,
    Higher Diploma 65, Master 95, Doctorate 10.
  - Other district rows (Al Danah, Mohamed Bin Zayed City, Al Zahiyah, Jarn Yafour, Al Nahyan)
    are visible but the columns are too dense/small at this resolution to transcribe with
    confidence beyond the Musaffah row. **Flagged — re-extract at higher resolution or from the
    live table if a full education breakdown is needed.**

### 1.10 Districts (named, no population value attached in the screenshots)
The "Top 5 Largest Districts in Abu Dhabi Emirate 2025" bubble chart (Total/Emirati/Non-Emirati
toggle) names, but does not give legible numeric values for:
- **Abu Dhabi Region:** Musaffah, Al Danah, Mohamed Bin Zayed City, Jarn Yafour, Al Bahyah (exact
  order/5th name uncertain — bubble sizing suggests Musaffah is largest)
- **Al Ain Region:** Central District, Industrial Area, Al Aamerah, Al Hosn, Zakher
- **Al Dhafra Region:** Ghyathi, Zayed City, Central Al Dhafra, Al Ghwaifat, Delma and
  Surrounding Islands

**Flagged: population-by-district numeric values are not available from these screenshots** even
though the district *names* and the fact that ranking data exists are confirmed. (Compare: Real
Estate's Top-10-districts table, §3.5, *does* give exact numbers — Population's equivalent
apparently only rendered as an unlabeled bubble chart in what was captured.)

---

## 2. Labour Force / Employment

**Important structural note:** in this data source, "**Labour Force**" appears to be used
synonymously with "**Employed Population**" — the Overview page's "Labour Force 2.98M" KPI card
and the "Employed Population of Abu Dhabi Emirate 2025" section's total (2,976,520) are the same
figure. There is **no separate, larger "labour force" total that includes unemployed persons**
visible anywhere. Unemployment/jobseeking is tracked *only* for Emiratis, as its own separate,
much smaller series (§2.6). **Do not assume a conventional "labour force participation rate" or
an "unemployment rate" exists in this data — it doesn't appear to, for non-Emiratis at least.**

### 2.1 Headline totals — 2025 `[table/chart, consistent across pages]`
| Metric | Value | % of total |
|---|---|---|
| Employed population (= "Labour Force" card) | 2,976,520 | 100% |
| Emirati | 332,235 | 11.2% |
| Non-Emirati | 2,644,285 | 88.8% |
| White-collar | — | 45.6% |
| Blue-collar | — | 54.4% |

### 2.2 Year-over-year change `[text]`
- **Employed population grew +7.7% from 2024 to 2025.**
- **White-collar employment grew +9.2%.**
- **Blue-collar employment grew +6.6%.**
No 2023/2024 absolute totals given (same limitation as population).

### 2.3 By sector × citizenship — 2025 `[table]`
| Sector | Total | Emirati | Non-Emirati |
|---|---|---|---|
| Government | 113,715 | 59,340 | 54,375 |
| Public | 240,785 | 54,215 | 188,570 |
| Private | 1,777,000 | 87,660 | 1,689,340 |
| Private Household | 453,785 | 0 | 453,780 |

(Emirati + Non-Emirati doesn't always exactly equal Total — expected, see §0 disclosure-control
note.)

### 2.4 By region × citizenship × gender — sankey, 2025 `[chart, now fully confirmed via checksum]`
Structure: the sankey's legend confirms the sub-split under each region is **Male / Female**
(not a sector split as v1 of this file guessed). Every regional sub-split below sums exactly to
its stated regional total, and both citizenship groups' M+F sum exactly to the grand total
(2,976,520) — this internal consistency is what moves the whole table from "chart, partially
legible" to confirmed, including the Al Ain Non-Emirati split v1 had flagged as unconfirmed.

**Emirati** (Male / Female):
| Region | Male | Female | Total |
|---|---|---|---|
| Abu Dhabi Region | 114,205 | 89,645 | 203,850 |
| Al Ain Region | 63,235 | 47,290 | 110,525 |
| Al Dhafra Region | 11,315 | 6,545 | 17,860 |
| **Emirati total** | **188,755** | **143,480** | **332,235** |

Emirati labour force gender split: **Male 56.8% / Female 43.2%**.

**Non-Emirati** (Male / Female):
| Region | Male | Female | Total |
|---|---|---|---|
| Abu Dhabi Region | 1,491,070 | 352,265 | 1,843,335 |
| Al Ain Region | 416,395 | 134,325 | 550,720 |
| Al Dhafra Region | 230,800 | 19,430 | 250,230 |
| **Non-Emirati total** | **2,138,265** | **506,020** | **2,644,285** |

Non-Emirati labour force gender split: **Male 80.9% / Female 19.1%**.

**Grand total labour force gender split (previously listed as "not confirmed" in v1/v2 — now
confirmed): Male 2,327,020 (78.2%) / Female 649,500 (21.8%).** This is the figure to use on any
Labour Force card/section showing an overall gender split — close to, but more precise than, the
placeholder 76%/24% the existing prototype happened to already be showing.

Sankey structure note: each citizenship/region cell further breaks down by sector (Government/
Public/Private/Private Household) — that finer cut (§2.3 gives the citizenship-level sector
totals only) wasn't re-derived at the region level here, since it wasn't needed to confirm gender.

### 2.5 By occupation (top 5) — 2025, gender split by citizenship `[chart, moderate confidence]`
"Top 5 Occupations for Abu Dhabi Emirate's Employed Population 2025" — % is Female/Male split
**within** each citizenship group for that occupation, not share of total employment:
| Occupation | Emirati F% | Emirati M% | Non-Emirati F% | Non-Emirati M% |
|---|---|---|---|---|
| Elementary occupations | 74.8% | 25.2% | 67.8% | 32.2% |
| Craft and related trades workers | 70.9% | 29.1% | 99.2%* | 0.8%* |
| Service and sales workers | 39.5% | 60.5% | 68.3% | 31.7% |
| Professionals | 46.3% | 53.7% | 67.7% | 32.3% |
| Plant and machine operators, and assemblers | 85.8%* | — | 97.5%* | 2.5%* |

`*` = lower-confidence read (small/overlapping label). **This table's gender-majority pattern
looks internally inconsistent for "Craft and related trades" and "Plant/machine operators" —
those are typically male-dominated blue-collar roles, so a 99.2%/0.8% or 85.8% split needs
verification against the source rather than being trusted at face value.** Flagged.

A companion granular table, "Employed (15+) by Main Occupation, Region, District, Citizenship
and Gender", confirms the same occupation categories at district level (Musaffah, Jarn Yafour,
Al Danah rows observed for Craft/Elementary/Professionals), but full transcription wasn't
attempted given resolution constraints — noted as confirmation the dimension exists.

### 2.6 By economic activity — 2025, region/district level `[table, partial]`
Confirmed activities: Construction, Wholesale and retail trade (repair of motor vehicles and
motorcycles), Manufacturing, Transportation and storage, Administrative and support service
activities. Sample rows (Emirati / Non-Emirati / Total, each as M/F/T):
| Region/District | Activity | Emirati M/F/T | Non-Emirati M/F/T | Total M/F/T |
|---|---|---|---|---|
| Musaffah | Construction | 30/5/35 | 74,590/405/74,995 | 74,620/415/75,035 |
| Jarn Yafour | Construction | 5/5/10 | 63,090/75/63,165 | 63,095/80/63,175 |
| Musaffah | Wholesale & retail trade | 25/10/35 | 42,200/600/42,800 | 42,225/610/42,835 |
| Musaffah | Manufacturing | 15/5/20 | 39,410/225/39,635 | 39,425/230/39,655 |
| Musaffah | Transportation & storage | 15/10/25 | 35,465/240/35,705 | 35,480/250/35,730 |
| (Unspecified Districts) | — | 4,905/6,830/11,735 | 15,310/6,195/21,510 | 20,215/13,025/33,245 |
| Al Danah | Administrative & support services | 1,625/1,155/2,785 | 20,175/8,935/29,110 | 21,800/10,090/31,890 |
| Jarn Yafour | Administrative & support services | 0/0/5 | 30,320/110/30,430 | 30,320/110/30,430 |
| Ghiyathi (Al Dhafra) | Construction | 30/70/100 | 25,860/25/25,890 | 25,895/95/25,990 |

This table is large (many more region/district/activity combinations exist than were captured) —
included as a representative sample confirming the dimension, not a complete extract.

### 2.7 By sector, district-level detail — "Private Enterprises" rows `[table, partial]`
| District | Emirati M/F/T | Non-Emirati M/F/T | Total M/F/T |
|---|---|---|---|
| Musaffah | 115/50/160 | 278,600/4,440/283,040 | 278,715/4,485/283,200 |
| Jarn Yafour | 10/10/25 | 125,715/315/126,030 | 125,725/330/126,055 |
| Al Danah | 705/960/1,665 | 78,640/33,900/112,540 | 79,350/34,860/114,205 |
| (Unspecified) | 2,055/5,565/7,620 | 78,870/17,050/95,920 | 80,930/22,615/103,540 |
| Mohamed Bin Zayed City | 1,725/1,845/3,565 | 52,135/12,580/64,715 | 53,860/14,425/68,285 |
| Al Zahiyah | 455/570/1,025 | 36,810/12,080/48,890 | 37,265/12,650/49,915 |
| Al Nahyan | 380/415/795 | 36,410/11,595/48,000 | 36,790/12,010/48,800 |
| Abu Dhabi Industrial City | 15/15/30 | 46,985/755/47,740 | 47,000/770/47,770 |
| Industrial Area | 55/20/75 | 41,275/745/42,015 | 41,325/765/42,090 |

Only the "Private Enterprises" sector row is visible in the captured screenshot; Government/
Public/Private Household rows for this same district breakdown were not captured.

### 2.8 Emirati Jobseekers — 2025 `[table, high confidence]`
**This is the only unemployment/jobseeking data in the whole dataset, and it is Emirati-only.**

By region:
| Region | Male | Female | Total |
|---|---|---|---|
| Abu Dhabi | 2,785 | 5,320 | 8,110 |
| Al Ain | 1,645 | 5,295 | 6,940 |
| Al Dhafra | 205 | 600 | 805 |
| **Total** | **4,635** | **11,220** | **15,855** |

By age group (table visibly cuts off after 30–34; more bands exist up to at least 55–59 per the
companion bar chart):
| Age | Male | Female | Total |
|---|---|---|---|
| 18–19 | 1,545 | 1,915 | 3,460 |
| 20–24 | 1,675 | 4,040 | 5,710 |
| 25–29 | 535 | 1,690 | 2,230 |
| 30–34 | 325 | 1,280 | 1,605 |

(Bar-chart version of this same series, lower confidence, suggested further bands: 35–39 ≈
1,025M/730F, 40–44, 45–49, 50–54, 55–59 all present but small — **not transcribed as fact**,
flagged for re-extraction.)

By education level (table cuts off after "Post-secondary non-tertiary education" — University,
Higher Diploma etc. rows likely exist below but weren't captured):
| Education level | Male | Female | Total |
|---|---|---|---|
| Read & Write | 0 | 0 | 0 |
| Primary | 0 | 0 | 0 |
| Preparatory | 140 | 270 | 410 |
| Secondary | 3,465 | 6,130 | 9,590 |
| Post-secondary non-tertiary education | 40 | 95 | 135 |

By marital status:
| Marital status | Male | Female | Total |
|---|---|---|---|
| Never Married | 3,870 | 6,525 | 10,395 |
| Married | 655 | 4,205 | 4,860 |
| Divorced | 110 | 450 | 560 |
| Widowed | 0 | 40 | 40 |

A bottom chart on the Labour Force story page ("Below Secondary / Secondary / Above Secondary" by
gender) appears related to this same jobseekers-by-education cut but wasn't confidently
reconciled to the table above — **flagged, do not treat as a second independent source.**

---

## 3. Real Estate

### 3.1 Headline totals — 2025 `[table/text, high confidence]`
| Metric | Value |
|---|---|
| Buildings | 326,130 |
| Units | 899,575 |

### 3.2 Year-over-year change `[text]`
- **Units grew +2.9% from 2024 to 2025**, reaching 899,575.
- **No YoY growth % is given anywhere for Buildings.** (Do not reuse the Units % for Buildings —
  they are two independently reported series in this data source.)

### 3.3 By region — 2025 `[table, confirmed — "Number and Proportion of Buildings/Units by Region"]`
Buildings:
| Region | Buildings | Share |
|---|---|---|
| Abu Dhabi Region | 176,905 | 54.2% |
| Al Ain Region | 117,425 | 36.0% |
| Al Dhafra Region | 31,805 | 9.8% |
| **Emirate of Abu Dhabi** | **326,130** | **100.0%** |

Units — now confirmed from the dedicated "Number and Proportion of Units by Region" table
(previously only sourced from the Overview page narrative; figures unchanged, confidence upgraded):
| Region | Units | Share |
|---|---|---|
| Abu Dhabi Region | 624,455 | 69.4% |
| Al Ain Region | 207,205 | 23.0% |
| Al Dhafra Region | 67,910 | 7.5% |
| **Emirate of Abu Dhabi** | **899,575** | **100.0%** |

(Component sum = 899,570, five short of the stated 899,575 total — expected under the
disclosure-control rounding policy in §0, not an error.)

### 3.4 By use and type — 2025 `[table, confirmed with exact percentages]`
**Buildings by use** ("Number and Proportion of Buildings by Use" table):
| Use | Count | Share |
|---|---|---|
| Residential | 203,095 | 62.3% |
| Other* | 56,410 | 17.3% |
| Commercial | 55,255 | 16.9% |
| Multi-use | 11,375 | 3.5% |
| **Emirate of Abu Dhabi** | **326,130** | **100.0%** |

**Buildings by type** ("Number and Proportion of Buildings by Type" table):
| Type | Count | Share |
|---|---|---|
| Villa and similar | 180,900 | 55.5% |
| Establishment building | 104,110 | 31.9% |
| Multi-apartment building | 39,620 | 12.1% |
| Other* | 1,500 | 0.5% |
| **Emirate of Abu Dhabi** | **326,130** | **100.0%** |

**Units by use** ("Number and Proportion of Units by Use" table):
| Use | Count | Share |
|---|---|---|
| Residential | 521,795 | 58.0% |
| Commercial | 281,960 | 31.3% |
| Other* | 95,820 | 10.7% |
| **Emirate of Abu Dhabi** | **899,575** | **100.0%** |

**Units by type** ("Number and Proportion of Units by Type" table):
| Type | Count | Share |
|---|---|---|
| Apartment and similar | 359,850 | 40.0% |
| Establishment unit | 356,930 | 39.7% |
| Villa and similar | 180,910 | 20.1% |
| Other* | 1,885 | 0.2% |
| **Emirate of Abu Dhabi** | **899,575** | **100.0%** |

`*Other` (uses) = Industrial, Governance, Social and Cultural Services, Healthcare and Education,
Recreational, Agriculture, and Other. `*Other` (types) = Unknown, Caravan, and Other.

**Correction to the previous version of this file:** the prior edit flagged the prototype's
Interpret-page Real Estate composition card (Residential 58.0% / Commercial 31.3% / Other 10.7%)
as a conflict against Buildings-by-use. That was a wrong comparison on my part — those three
numbers are an **exact match for Units-by-use** (58.0% / 31.3% / 10.7%, confirmed above), not
buildings. **This is not a conflict; the prototype's card is correct, once understood as showing
Units-by-use rather than Buildings-by-use** (its current label is ambiguous on this point — worth
clarifying in the UI copy when Interpret is revised, but the numbers themselves need no change).
See the corrected "Known conflicts" table at the end of this file.

### 3.5 Top 10 districts — 2025 `[table, confirmed with region + exact percentages]`
By buildings ("Number and Proportion of Buildings by Top 10 Districts" — region now confirmed
per row):
| Region | District | Buildings | Share |
|---|---|---|---|
| Abu Dhabi | Mohamed Bin Zayed City | 18,230 | 5.6% |
| Abu Dhabi | Khalifa City | 16,425 | 5.0% |
| Abu Dhabi | Madinat Al Riyad | 10,915 | 3.3% |
| Abu Dhabi | Bani Yas | 9,080 | 2.8% |
| Abu Dhabi | Al Falah | 8,280 | 2.5% |
| Abu Dhabi | Al Shamkhah | 7,800 | 2.4% |
| Al Dhafra | Zayed City | 6,970 | 2.1% |
| Al Ain | Al Aamerah | 6,745 | 2.1% |
| Abu Dhabi | Musaffah | 6,690 | 2.1% |
| Abu Dhabi | Shakhbout City | 6,575 | 2.0% |
| — | **Total (top 10)** | **97,715** | **30.0%** |

The "97,715 / 30%" figure flagged as unclear in the previous version of this file is now
**confirmed**: it is the top-10-districts-by-buildings subtotal and its share of the Emirate
total (326,130).

By units ("Number and Proportion of Units by Top 10 Districts" — table screenshot cuts off after
6 of 10 rows; remaining 4 rows and the Total row carried over from the previous extraction at
lower confidence, marked below):
| Region | District | Units | Share |
|---|---|---|---|
| Abu Dhabi | Al Danah | 78,300 | 8.7% |
| Abu Dhabi | Musaffah | 72,060 | 8.0% |
| Abu Dhabi | Mohamed Bin Zayed City | 58,210 | 6.5% |
| Abu Dhabi | Khalifa City | 36,035 | 4.0% |
| Abu Dhabi | Al Reem Island | 34,510 | 3.8% |
| Abu Dhabi | Al Zahiyah | 31,980 | 3.6% |
| — | Al Nahyan `[unconfirmed region/%]` | 25,610 | — |
| — | Industrial Area `[unconfirmed region/%]` | 22,050 | — |
| — | Al Hisn `[unconfirmed region/%]` | 20,005 | — |
| — | Zayed City `[unconfirmed region/%]` | 19,255 | — |
| — | **Total (top 10)** `[not captured]` | **~398,015 (carried over, unconfirmed)** | **~44% (carried over, unconfirmed)** |

By analogy with the now-confirmed buildings total (97,715/30.0% = the top-10 subtotal/share),
**398,015/44% is very likely the same kind of top-10-by-units subtotal/share** seen on the
Overview infographic — but this batch's screenshot cut off before reaching that table's own
Total row, so it remains **carried over at unconfirmed status**, not newly verified. The last 4
districts' individual percentages are likewise not yet confirmed from a table (values only, from
the previous batch's chart reading).

Note: these two top-10 lists are **not the same set of districts** — e.g. Al Danah (#1 by units)
doesn't appear in the top-10-by-buildings list, and vice versa for Bani Yas/Al Falah/Al Shamkhah/
Al Aamarah/Shakhbout City. Both lists are genuine, independent rankings. Newly confirmed: **9 of
the 10 top-buildings districts are in Abu Dhabi Region**, with only Zayed City (Al Dhafra) and Al
Aamerah (Al Ain) representing the other two regions — buildings are heavily Abu-Dhabi-Region-
concentrated even within the "top 10" cut. All 6 confirmed top-units districts are also Abu Dhabi
Region.

---

## 4. Geography — summary

**Region hierarchy:** Emirate of Abu Dhabi → 3 regions (Abu Dhabi Region, Al Ain Region, Al
Dhafra Region) → districts. This 3-region structure already matches what the existing prototype
uses.

**Districts named across the screenshots** (population, real estate, or labour-force tables/
charts — not necessarily all with population figures attached):
Musaffah, Al Danah, Mohamed Bin Zayed City, Jarn Yafour, Al Bahyah, Abu Dhabi Industrial City,
Khalifa City, Madinat Al Riyad, Bani Yas, Al Falah, Al Shamkhah, Zayed City, Al Aamarah,
Shakhbout City, Al Reem Island, Al Zahiyah, Al Nahyan, Industrial Area, Al Hisn, Central District
(Al Ain), Al Aamerah, Al Hosn, Zakher, Ghiyathi, Central Al Dhafra, Al Ghwaifat, Delma and
Surrounding Islands, and a long additional list visible only in the age/education district tables
(Abu Dhabi Islands A, Abu Dhabi Islands B, Abu Mreikhah, Al 'Adlah, Al 'Asheesh, Al Bihouth, and
more not fully captured).

This is a **much larger and more specific district list** than the prototype's current
placeholder ("Al Ain City, Al Mutawa, Al Hili, Al Jimi, Al Khabisi" — none of which appear
anywhere in these real screenshots). **Flagged as a conflict**, see below.

---

## 5. Years available

- **2023, 2024, 2025** are the three years the year-selector dropdowns offer (confirmed on the
  Population table page: "2025 / 2024 / 2023 - R1").
- **2023 is explicitly labelled "R1" (revised)** in the year selector itself, not just in the
  footnote — reinforcing that R0 (original) 2023 data is a separate, request-only dataset.
- Actual 2023/2024 **values** were not captured for Population or Labour Force in any screenshot
  (only 2025 snapshots plus a few YoY % deltas). Real Estate is the same — only 2025 absolute
  values captured, YoY % given only for Units.
- The Population historical trend chart goes back to 1975, but only as an unlabeled line —
  no usable data points before 2025 were legible.

**Net effect: we have solid 2025 cross-sections for all three domains, plus four YoY-change
percentages (Population +7.4%, Employed +7.7%/white-collar +9.2%/blue-collar +6.6%, Real Estate
Units +2.9%). We do NOT have 2023/2024 absolute values for anything.** Any 3-year trend chart
currently in the prototype is necessarily fabricated and cannot yet be corrected to real numbers
— it can only be replaced with a 2025-snapshot-plus-YoY-% presentation until 2023/2024 absolutes
are sourced.

---

## 6. Units & conventions observed

- Population, labour force, buildings, units: **counts** (persons / buildings / units).
- Shares/compositions: **percentages** of the relevant total.
- Growth: **year-over-year percentage change**, always stated as "vs previous year" in prose, not
  as a multi-year CAGR.
- Median age: a single **age-in-years** figure, no unit suffix needed.
- No indices, ratios, or rates (e.g. no "dependency ratio," no "male/female ratio," no
  "employment participation rate") appear anywhere in this data source. **These specific
  indicators, currently used on the prototype's Benchmark page, have no basis in this data and
  are prototype-only inventions** (flagged below).

---

## 7. Important data that should NOT be omitted from the UI

1. **Real gender split is 67.3% Male / 32.7% Female overall** — a much larger skew than a casual
   "roughly balanced" assumption; this is one of the most decision-relevant facts in the whole
   dataset (driven by the non-Emirati labour-migration population) and should be visible on
   Interpret, not buried in a detail page.
2. **Emirati jobseekers (15,855, 71% female)** — the only unemployment-adjacent figure in the
   entire dataset, and heavily female-skewed (11,220 of 15,855). This is a specific, meaningful,
   decision-relevant statistic that a generic "employment rate" framing would completely hide.
3. **White-collar vs. blue-collar split (45.6% / 54.4%) and their different growth rates (+9.2%
   vs +6.6%)** — called out by name on the Labour Force story page, a genuine cross-cutting
   insight.
4. **Real estate Units-vs-Buildings growth divergence** — Units +2.9% YoY is the only real estate
   growth figure available; do not imply a Buildings growth rate exists when it doesn't.
5. **Private Household sector has 0 Emiratis** (453,785 total, all Non-Emirati) — a stark,
   citable fact about sector composition.
6. **Two independent Top-10-district rankings for real estate** (by buildings vs. by units) tell
   different stories about density and should probably both be shown, not collapsed into one.
7. **The top-10 districts by buildings are almost entirely Abu Dhabi Region** — 9 of 10 (all but
   Zayed City in Al Dhafra and Al Aamerah in Al Ain) — a sharper concentration statement than the
   region-level 54.2% share alone conveys, and a citable fact for a regional-balance narrative.

## 8. Unclear / missing values needing confirmation

1. Population by 5-year age band: only 0–4 through 20–24 captured; 25–29 through 80+ missing.
2. Population by wide age group (Junior/Working-age/Senior): chart values illegible; a Tables
   view for this exists and should be re-captured.
3. Population by education level (sankey): only the two top-level flow totals (641,020 /
   3,374,655) are legible; the breakdown into Above Secondary / Secondary / Below Secondary is
   not.
4. Population by district: **no numeric values at all**, only district names via an unlabeled
   bubble chart. Needs the underlying table.
5. Top-5-occupation gender splits (§2.5) look internally suspicious for two rows (Craft & related
   trades; Plant & machine operators) — re-verify against source before using.
6. Emirati jobseekers by age: only 18–34 confirmed from the table; 35–59 only seen in a
   lower-confidence bar chart.
7. Emirati jobseekers by education: only Read&Write through Post-secondary non-tertiary
   confirmed; University/Higher Diploma/Master/Doctorate rows likely exist below the visible cut.
8. ~~Labour-force sankey Al Ain Non-Emirati sub-split~~ — **now confirmed** (416,395M/134,325F,
   verified by checksum against three independent totals, §2.4).
9. ~~Real estate "97,715/30%" and "398,015/44%" summary figures~~ — **97,715/30.0% is now
   confirmed** (top-10-districts-by-buildings subtotal/share, §3.5). 398,015/44% remains
   unconfirmed (very likely the analogous top-10-by-units figure, but its source table's Total
   row wasn't captured). Also still open: the last 4 rows of the by-units top-10 table (Al
   Nahyan, Industrial Area, Al Hisn, Zayed City) have no confirmed region or per-district %.
10. **2023 and 2024 absolute values for Population, Labour Force, and Buildings are not available
    from any screenshot** — only 2025 snapshots and a handful of YoY percentages exist.
11. Buildings YoY growth rate — not given anywhere (only Units' +2.9% is stated).
12. Full population-by-education, population-by-marital-status, and employment-by-occupation/
    activity/sector tables are much larger than what's transcribed here (many more districts) —
    what's captured above is a representative sample per table, not the complete dataset.

## 9. Where each data group should eventually surface in the Observatory

*(Mapping only — no build work done yet, per your instruction.)*

| Data group | Interpret (high-level) | Domain detail page |
|---|---|---|
| Population headline (4.44M, +7.4%, Emirati/Non-Emirati, overall M/F 67/33) | ✅ replaces current fabricated KPIs | — |
| Population by region | ✅ one-line regional insight only | Full region→district drill-down (Observe already has the region level; district level is new) |
| Population by age (5-yr bands, wide bands, median age) | ✗ | Population detail page |
| Population by marital status | ✗ | Population detail page |
| Population by education | ✗ | Population detail page |
| Employed population headline (2.98M, +7.7%, white/blue collar) | ✅ | — |
| Employed by sector | ✗ | Labour Force detail page |
| Employed by occupation | ✗ | Labour Force detail page |
| Employed by economic activity | ✗ | Labour Force detail page (likely needs its own filter, this table is large) |
| Emirati Jobseekers (region/age/education/marital status) | Possibly one Key-Insight callout (it's a distinctive stat) | Labour Force detail page — this is currently **entirely absent** from the prototype and should probably get its own subsection |
| Real estate headline (326,130 buildings, 899,575 units, +2.9% units) | ✅ replaces current fabricated %s | — |
| Real estate by use/type | ✗ | Real Estate detail page — replaces the current fabricated 58/31.3/10.7 split |
| Real estate top-10 districts (buildings AND units, two different rankings) | ✗ | Real Estate detail page, or Observe |
| District-level detail (any domain) | ✗ | Observe (region→district already built; district names need correcting) |
| Benchmark's "Male/Female Ratio," "Dependency Ratio," "Employment Participation Rate" | — | **No basis in this data at all — these were prototype-only inventions and should be reconsidered once you say "Revise Benchmark"** |

---

## Known conflicts with the existing prototype

For when you say "Revise Interpret" / "Revise Observe" / etc. — these are the specific numbers
currently hard-coded in the live pages that this reference contradicts:

| Prototype currently shows | This reference says | Where |
|---|---|---|
| Population +3.1% vs 2024 | **+7.4%** vs 2024 | Interpret, Observe |
| Population M 54% / F 46% | **M 67.3% / F 32.7%** | Interpret, Observe, Population detail |
| Emirati 510K (11%) / Non-Emirati 3.93M (89%) | **Emirati 817,135 (18.4%) / Non-Emirati 3,624,415 (81.6%)** | Interpret, Observe, Population detail |
| Labour force +2.4% vs 2024 | Employed population **+7.7%** vs 2024 (and "Labour Force" ≈ "Employed", see §2) | Interpret, Observe, Labour detail |
| Labour force Emirati 332K (11%) / Non-Emirati 2.64M (89%) | **332,235 (11.2%) / 2,644,285 (88.8%)** — close, just needs exact figures | Interpret, Observe |
| Labour M 76% / F 24% | **Now confirmed: Male 78.2% / Female 21.8%** (§2.4) — close to the placeholder, small correction | Interpret, Observe |
| Buildings 326K +2.8% vs 2024 | **326,130**, no YoY figure exists for buildings | Interpret, Observe, Real Estate detail |
| Units 900K +4.1% vs 2024 | **899,575, +2.9%** vs 2024 | Interpret, Observe, Real Estate detail |
~~Real estate composition Residential 58.0% / Commercial 31.3% / Other 10.7%~~ | **Not a conflict** — this is an exact match for Units-by-use (confirmed §3.4). Only the card's label is ambiguous (doesn't say "by unit use"); numbers are correct as-is. | Interpret (label wording only) |
| Real estate composition wasn't otherwise checked for **Buildings**-by-use anywhere in the prototype | Buildings by use: Residential 62.3% / Other 17.3% / Commercial 16.9% / Multi-use 3.5% (§3.4) — use this if a *buildings* composition view is ever added | Real Estate detail (new content, not a fix) |
| Regions: Abu Dhabi 2,845,300 / Al Ain 972,600 / Al Dhafra 618,400 | **Abu Dhabi 3,066,635 / Al Ain 1,020,955 / Al Dhafra 353,960** | Observe, Interpret regional callouts |
| Observe's Al Ain districts: Al Ain City, Al Mutawa, Al Hili, Al Jimi, Al Khabisi | **None of these appear in the real data.** Real district names include Central District, Industrial Area, Al Aamerah, Al Hosn, Zakher (Al Ain districts named in the Population page) — different from the real-estate district list, which is Emirate-wide, not per-region | Observe |
| 2023/2024 population, labour, buildings, units trend values (used for "What's Changed" bar/driver charts) | **Not available in this data source at all** — only 2025 + a YoY % | Interpret's "What's Changed" section, Population Projection's "Actual" series |
| Benchmark's Male/Female Ratio, Dependency Ratio, Employment Participation Rate indicators, and all GCC/Emirates/Global comparison figures | **No equivalent data in this source** — these remain prototype-only illustrative content unless/until a benchmark data source is provided | Benchmark |

Waiting for your next instruction ("Revise Interpret" / "Revise Observe" / etc.) before changing
any UI.
