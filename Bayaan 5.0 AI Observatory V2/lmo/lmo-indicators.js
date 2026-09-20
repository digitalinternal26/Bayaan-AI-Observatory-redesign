window.LMO_CATEGORIES = [
  { id: 'all', label: 'All Indicators' },
  { id: 'employment', label: 'Employment' },
  { id: 'unemployment', label: 'Unemployment' },
  { id: 'wages', label: 'Wages & Compensation' },
  { id: 'demographics', label: 'Demographics' },
  { id: 'skills', label: 'Skills & Education' },
  { id: 'sectors', label: 'Sectors & Activity' },
  { id: 'flows', label: 'Flow Analysis' }
];

window.LMO_INDICATORS = [
  { id: 'emp-residents', title: 'Employed Residents', sub: 'Citizenship and Gender', cat: 'employment', subcat: 'Headcount', status: 'stable', value: '2.9M', chg: 4.33, dir: 'up', chgLbl: 'vs 2024', updated: '19 March, 2026', spark: [2.52, 2.58, 2.65, 2.72, 2.81, 2.9], insight: 'Employed residents up +4.33% YoY — broad growth across Emirati and Non-Emirati cohorts, led by private sector hiring.' },
  { id: 'emp-emiratis', title: 'Employed Emiratis', sub: 'Economic Activity', cat: 'employment', subcat: 'Emiratisation', status: 'stable', value: '274.3K', chg: 12.31, dir: 'up', chgLbl: 'vs 2024', updated: '19 March, 2026', spark: [153.9, 168, 182, 205, 245, 274.3], insight: 'Emirati employment up 12.3% YoY — Finance and public administration sectors driving absorption.' },
  { id: 'emp-high-skill', title: 'Employed Non-Emiratis with High Skill', sub: 'Annually', cat: 'skills', subcat: 'Skills', status: 'stable', value: '894.6K', chg: 24.56, dir: 'up', chgLbl: 'vs 2024', updated: '18 March, 2026', spark: [447.6, 508.8, 674.8, 718.2, 806, 894.6], insight: 'High-skill Non-Emirati employment surging +24.6% — technology and finance roles dominate inflows.' },
  { id: 'emp-activity', title: 'Employment', sub: 'Economic Activity and Occupation', cat: 'sectors', subcat: 'Sector', status: 'stable', value: '122.1K', chg: 22.7, dir: 'up', chgLbl: 'vs 2024', updated: '17 March, 2026', spark: [88, 92, 98, 105, 112, 122.1], insight: 'Professional & technical activities employment expanding — Emirati share rising in high-value occupations.' },
  { id: 'labour-plant', title: 'Labors in Plant Holdings', sub: 'Region', cat: 'sectors', subcat: 'Agriculture', status: 'stable', value: '28.4K', chg: 1.78, dir: 'up', chgLbl: 'vs 2024', updated: '15 March, 2026', spark: [23.6, 25.1, 26.8, 27.2, 27.9, 28.4], insight: 'Agricultural labour stable with modest growth — seasonal hiring patterns within normal range.' },
  { id: 'labour-animal', title: 'Labors in Animal Traditional Holdings', sub: 'Region', cat: 'sectors', subcat: 'Agriculture', status: 'moderate', value: '36.5K', chg: -0.8, dir: 'dn', chgLbl: 'vs 2024', updated: '15 March, 2026', spark: [37.2, 36.8, 37.5, 37.1, 36.9, 36.5], insight: 'Traditional holdings labour flat — structural shift toward mechanised operations continues.' },
  { id: 'unemp-residents', title: 'Unemployed Residents', sub: 'Total', cat: 'unemployment', subcat: 'Headcount', status: 'watch', value: '112.9K', chg: -17.42, dir: 'dn', chgLbl: 'vs 2024', updated: '19 March, 2026', spark: [136.7, 128, 120, 115, 118, 112.9], insight: 'Unemployment count fell 17.4% YoY but remains elevated vs 2019 baseline — monitor Q3 trajectory.' },
  { id: 'unemp-age', title: 'Unemployed Residents', sub: 'Age Group', cat: 'unemployment', subcat: 'Demographics', status: 'watch', value: '112.9K', chg: -17.42, dir: 'dn', chgLbl: 'vs 2024', updated: '19 March, 2026', spark: [87.9, 98.7, 110.7, 120, 136.7, 112.9], insight: 'Youth cohort (15–24) contributes disproportionately — NEET rate elevated at 6.4%.' },
  { id: 'unemp-citizen', title: 'Unemployed Residents', sub: 'Citizenship', cat: 'unemployment', subcat: 'Nationality', status: 'moderate', value: '112.9K', chg: -17.42, dir: 'dn', chgLbl: 'vs 2024', updated: '19 March, 2026', spark: [98, 105, 112, 118, 125, 112.9], insight: 'Emirati unemployment share declining but absolute count still above Vision 2030 interim targets.' },
  { id: 'unemp-edu', title: 'Unemployment', sub: 'Education and Citizenship', cat: 'unemployment', subcat: 'Education', status: 'watch', value: '48.3K', chg: 2.1, dir: 'up', chgLbl: 'vs 2024', updated: '16 March, 2026', spark: [42, 44, 45, 46, 47.2, 48.3], insight: 'Emirati primary-education unemployment ticked up — skills mismatch in entry-level roles.' },
  { id: 'median-salary-age', title: 'Median Salary', sub: 'Age Group', cat: 'wages', subcat: 'Compensation', status: 'stable', value: '4.8K', unit: 'AED', chg: 3.2, dir: 'up', chgLbl: 'vs 2024', updated: '18 March, 2026', spark: [4.2, 4.3, 4.5, 4.6, 4.7, 4.8], insight: 'Female median salary (6.5K AED) exceeds male (4.7K) — driven by public sector concentration.' },
  { id: 'median-salary-edu', title: 'Median Salary', sub: 'Education Level', cat: 'wages', subcat: 'Compensation', status: 'stable', value: '3.1K', unit: 'AED', chg: 2.8, dir: 'up', chgLbl: 'vs 2024', updated: '18 March, 2026', spark: [2.6, 2.7, 2.8, 2.9, 3.0, 3.1], insight: 'Higher education commands premium — Bachelor+ earn 2.3× upper secondary median.' },
  { id: 'salary-bands', title: 'Salary Distribution', sub: 'Bands by Economic Activity', cat: 'wages', subcat: 'Distribution', status: 'stable', value: '19.7K', unit: 'AED avg', chg: 1.5, dir: 'up', chgLbl: 'vs 2024', updated: '17 March, 2026', spark: [17.2, 17.8, 18.2, 18.6, 19.1, 19.7], insight: 'Public administration and mining lead salary bands — construction median lagging at 12.4K AED.' },
  { id: 'dep-ratio', title: 'Age Dependency Ratio', sub: 'Residents 18+ Years', cat: 'demographics', subcat: 'Dependency', status: 'moderate', value: '19.2', unit: '%', chg: 1.58, dir: 'up', chgLbl: 'vs 2024', updated: '19 March, 2026', spark: [21.1, 20.5, 24.6, 22.3, 18.9, 19.2], insight: 'Dependency ratio stabilising at 19.2% after 2020 peak — working-age share recovering.' },
  { id: 'dep-ratio-reg', title: 'Age Dependency Ratio', sub: 'Region and Citizenship', cat: 'demographics', subcat: 'Regional', status: 'stable', value: '25.2', unit: '%', chg: 0.4, dir: 'up', chgLbl: 'vs 2024', updated: '19 March, 2026', spark: [24.1, 24.5, 25.8, 26.2, 24.9, 25.2], insight: 'Al Ain shows higher dependency (28.1%) vs Abu Dhabi City (22.4%) — education sector effect.' },
  { id: 'corr-macro', title: 'Employment–Unemployment Correlation', sub: 'Macro Indicators', cat: 'flows', subcat: 'Correlation', status: 'moderate', value: '0.81', unit: 'r', chg: 0.05, dir: 'up', chgLbl: 'vs prior period', updated: '14 March, 2026', spark: [0.72, 0.74, 0.76, 0.78, 0.79, 0.81], bar: true, insight: 'Strong positive correlation with crude activity index — cyclical component ~1.5pp of total unemployment.' },
  { id: 'flow-age', title: 'Flow of Labour Supply', sub: 'Citizenship and Age Group', cat: 'flows', subcat: 'Sankey', status: 'stable', value: '2.9M', unit: 'supply', chg: 4.3, dir: 'up', chgLbl: 'net flow', updated: '12 March, 2026', spark: [2.5, 2.6, 2.65, 2.72, 2.82, 2.9], flow: true, insight: '25–34 age band largest supply pool — demand gap concentrated in mid-skill construction roles.' },
  { id: 'flow-edu', title: 'Flow of Labour Supply', sub: 'Citizenship and Education', cat: 'flows', subcat: 'Sankey', status: 'stable', value: '2.9M', unit: 'supply', chg: 3.8, dir: 'up', chgLbl: 'net flow', updated: '12 March, 2026', spark: [2.48, 2.55, 2.62, 2.7, 2.8, 2.9], flow: true, insight: 'Bachelor+ share rising to 34% of supply — upper secondary still largest single education band.' },
  { id: 'teachers', title: 'Teachers in School Education', sub: 'Region', cat: 'skills', subcat: 'Education workforce', status: 'stable', value: '28.4K', chg: 1.78, dir: 'up', chgLbl: 'vs 2024', updated: '16 March, 2026', spark: [23.6, 26.2, 28.5, 31.4, 27.8, 28.4], insight: 'Teacher count recovering post-2021 dip — Emirati teacher share at 42% and rising.' },
  { id: 'students', title: 'Students in School Education', sub: 'Region and Sector', cat: 'skills', subcat: 'Enrolment', status: 'stable', value: '434.5K', chg: 4.71, dir: 'up', chgLbl: 'vs 2024', updated: '16 March, 2026', spark: [351.5, 368, 385, 402, 415, 434.5], insight: 'Enrolment growing steadily — private sector share at 63.3% of total students.' },
  { id: 'private-schools', title: 'Students in Private Schools', sub: 'Region', cat: 'skills', subcat: 'Enrolment', status: 'stable', value: '63.31', unit: '%', chg: 0.91, dir: 'up', chgLbl: 'vs 2024', updated: '16 March, 2026', spark: [64.7, 63.8, 62.5, 61.9, 62.4, 63.31], insight: 'Private school share recovering from 2021 low — quality migration driving gradual shift.' },
  { id: 'nurses', title: 'Nurses', sub: 'Facility Region', cat: 'skills', subcat: 'Healthcare', status: 'stable', value: '29.8K', chg: 1.12, dir: 'up', chgLbl: 'vs 2024', updated: '15 March, 2026', spark: [32.9, 31.2, 30.5, 29.5, 29.6, 29.8], insight: 'Nursing workforce stabilising after 2022 contraction — Emirati nurse recruitment accelerating.' },
  { id: 'dentists', title: 'Dentists', sub: 'Facility Region', cat: 'skills', subcat: 'Healthcare', status: 'stable', value: '3.4K', chg: 5.54, dir: 'up', chgLbl: 'vs 2024', updated: '15 March, 2026', spark: [1.6, 1.9, 2.1, 2.5, 3.0, 3.4], insight: 'Dental workforce expanded 5.5% — capacity building aligned with healthcare sector growth plan.' },
  { id: 'pharmacists', title: 'Pharmacists', sub: 'Facility Region', cat: 'skills', subcat: 'Healthcare', status: 'stable', value: '2.8K', chg: 3.2, dir: 'up', chgLbl: 'vs 2024', updated: '15 March, 2026', spark: [1.8, 2.0, 2.2, 2.4, 2.6, 2.8], insight: 'Pharmacist count growing in line with retail and hospital pharmacy expansion.' }
];

window.LMO_CAT_DETAIL = {
  employment: {
    impacts: [
      { title: 'Private Sector Absorption', text: 'Accelerating private hiring reduces fiscal pressure on public employment programmes and supports diversification targets.' },
      { title: 'Visa & Mobility Flows', text: 'Employment growth correlates with work visa issuance — monitor ICP throughput for supply-side constraints.' },
      { title: 'Sector Concentration', text: 'Growth concentrated in finance and professional services may widen sectoral wage dispersion.' },
      { title: 'Productivity Linkage', text: 'Headcount gains without matching output growth can signal underemployment — cross-check with sector GDP contributions.' }
    ],
    actions: [
      { title: 'Track Sector Mix', text: 'Review quarterly SCAD business register updates to confirm employment gains are broad-based across NACE sectors.' },
      { title: 'Align NAFIS Intake', text: 'Calibrate NAFIS placement targets to sectors showing strongest net job creation.' },
      { title: 'Monitor Emirati Share', text: 'Set dashboard alerts when Emirati employment growth falls below 8% YoY in priority sectors.' },
      { title: 'Validate with Admin Data', text: 'Reconcile LFS employment counts with MOHRE establishment register filings each quarter.' }
    ]
  },
  unemployment: {
    impacts: [
      { title: 'Youth NEET Pressure', text: 'Elevated youth unemployment increases NEET risk and delays human capital returns on education investment.' },
      { title: 'Emiratisation Gap', text: 'Persistent unemployment among nationals may slow progress toward Vision 2030 interim employment targets.' },
      { title: 'Social Programme Load', text: 'Higher unemployment duration extends benefit uptake and raises fiscal exposure on active labour market programmes.' },
      { title: 'Household Stability', text: 'Prolonged joblessness in key age cohorts reduces consumption and housing demand in affected municipalities.' }
    ],
    actions: [
      { title: 'Target Youth Cohort', text: 'Prioritise NAFIS and internship placements for 15–24 age band where displacement is highest.' },
      { title: 'Skills Diagnostics', text: 'Run mismatch analysis on entry-level roles where primary-education unemployment is rising.' },
      { title: 'Early Warning Review', text: 'Cross-check with CIO-style leading indicators — job postings, PMI, and permit volumes — weekly.' },
      { title: 'Activate ALMP Pathways', text: 'Fast-track eligible jobseekers into subsidised placement and reskilling programmes within 30 days of registration.' }
    ]
  },
  wages: {
    impacts: [
      { title: 'Cost of Living', text: 'Nominal wage growth above CPI supports household purchasing power but raises employer cost base.' },
      { title: 'Sector Competitiveness', text: 'Construction and retail wage bands lagging may affect talent retention vs higher-paying sectors.' },
      { title: 'Gender Pay Structure', text: 'Public-sector concentration drives observed gender median gaps — not directly comparable to private market.' },
      { title: 'Inflation Pass-Through', text: 'Sustained wage growth above productivity gains may feed into service-sector price pressures over time.' }
    ],
    actions: [
      { title: 'Benchmark Bands', text: 'Compare sector medians against GCC peers and adjust minimum wage guidance where warranted.' },
      { title: 'Review Allowances', text: 'Assess housing and transport allowance trends that affect real compensation outcomes.' },
      { title: 'Publish Guidance', text: 'Issue quarterly compensation brief for HR directors in priority economic zones.' },
      { title: 'Track Real Wages', text: 'Publish CPI-adjusted median wage trends alongside nominal figures in the quarterly LMO brief.' }
    ]
  },
  demographics: {
    impacts: [
      { title: 'Fiscal Dependency', text: 'Higher dependency ratios increase per-capita public service costs and pension liabilities.' },
      { title: 'Regional Variation', text: 'Al Ain and peripheral regions show structurally higher ratios due to student and elderly populations.' },
      { title: 'Workforce Planning', text: 'Age structure shifts affect future labour supply and sector-specific skill pipelines.' },
      { title: 'Participation Ceiling', text: 'Aging and dependency trends set upper bounds on achievable labour force participation without migration policy shifts.' }
    ],
    actions: [
      { title: 'Regional Drill-Down', text: 'Segment dependency analysis by municipality to target family and education policies.' },
      { title: 'Long-Range Modelling', text: 'Feed updated ratios into LMO population-employment projection models.' },
      { title: 'Cross-Observatory Sync', text: 'Share demographic signals with Economic Observatory for GDP per worker forecasts.' },
      { title: 'Update Cohort Profiles', text: 'Refresh age-band labour supply profiles annually for use in forecasting and simulation layers.' }
    ]
  },
  skills: {
    impacts: [
      { title: 'Pipeline Quality', text: 'Education and healthcare workforce trends directly affect service delivery capacity and Emiratisation outcomes.' },
      { title: 'Skills Mismatch', text: 'Rapid high-skill inflows may outpace mid-skill domestic pipeline, widening dual labour market.' },
      { title: 'Sector Delivery', text: 'Teacher and nurse shortages in specific regions delay sector growth plans and Vision 2030 KPIs.' },
      { title: 'Graduate Readiness', text: 'Enrolment growth without aligned vocational output increases time-to-employment for new labour market entrants.' }
    ],
    actions: [
      { title: 'Expand Emirati Recruitment', text: 'Accelerate scholarship-to-employment pathways in healthcare and education.' },
      { title: 'Skills Forecast Link', text: 'Connect enrolment trends to LMO forecasting layer for 3-year supply projections.' },
      { title: 'Credential Mapping', text: 'Align qualification frameworks with high-demand occupation codes from MOHRE register.' },
      { title: 'STEM Pipeline Review', text: 'Audit graduate output vs sector demand gaps and adjust scholarship priorities for the next academic cycle.' }
    ]
  },
  sectors: {
    impacts: [
      { title: 'Agricultural Transition', text: 'Mechanisation reduces traditional labour demand while raising productivity per worker.' },
      { title: 'Professional Services', text: 'High-value occupation growth supports GDP diversification but increases competition for talent.' },
      { title: 'Seasonal Volatility', text: 'Agricultural and construction sub-sectors retain seasonal hiring patterns affecting quarterly readings.' },
      { title: 'Supply Chain Exposure', text: 'Sector-specific employment shocks can propagate through linked value chains within 1–2 quarters.' }
    ],
    actions: [
      { title: 'Sector Taskforces', text: 'Convene cross-ministry reviews for sectors showing deceleration vs emirate average.' },
      { title: 'Permit Cross-Check', text: 'Validate employment trends against construction and commercial permit data.' },
      { title: 'Reskilling Programmes', text: 'Deploy targeted upskilling where structural shift reduces traditional role demand.' },
      { title: 'Sector Dashboards', text: 'Maintain live sector KPI boards linking headcount, permits, and wage trends for priority industries.' }
    ]
  },
  flows: {
    impacts: [
      { title: 'Macro Sensitivity', text: 'Strong employment–activity correlation implies unemployment responds quickly to GDP shocks.' },
      { title: 'Supply Composition', text: 'Shifts in age and education mix of labour supply affect sectoral matching efficiency.' },
      { title: 'Policy Transmission', text: 'Visa and education policy changes propagate through flow indicators within 2–3 quarters.' },
      { title: 'Matching Friction', text: 'Imbalances between inflow composition and sector demand raise vacancy duration and hiring costs.' }
    ],
    actions: [
      { title: 'Stress Test Flows', text: 'Run simulation scenarios on supply shocks using LMO Simulations workspace.' },
      { title: 'Sankey Review', text: 'Quarterly review of citizenship × education flow splits with MOHRE and ICP.' },
      { title: 'Correlation Monitor', text: 'Alert when macro correlation coefficient moves ±0.05 from trailing 4-quarter average.' },
      { title: 'Flow Reconciliation', text: 'Compare LFS inflow estimates with visa issuance and graduation cohort data each quarter.' }
    ]
  }
};
