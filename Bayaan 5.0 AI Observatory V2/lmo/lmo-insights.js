/* Shared LMO Insights data + visualization helpers */
(function () {
  const INSIGHT_LEGEND = `<div class="obs-insight-legend obs-insight-legend--dots">
    <span><i class="obs-pyr-dot obs-pyr-dot--emi" aria-hidden="true"></i>Emirati</span>
    <span><i class="obs-pyr-dot obs-pyr-dot--non" aria-hidden="true"></i>Non-Emirati</span>
  </div>`;

  const FILTER_DEFS = {
    citizenship: {
      id: "citizenship",
      label: "Citizenship",
      icon: "ti-world",
      options: ["All", "Emirati", "Non-Emirati"],
    },
    gender: {
      id: "gender",
      label: "Gender",
      icon: "ti-gender-bigender",
      options: ["All", "Male", "Female"],
    },
    region: {
      id: "region",
      label: "Region",
      icon: "ti-map-2",
      options: [
        "Abu Dhabi Emirate",
        "Abu Dhabi Region",
        "Al Ain Region",
        "Al Dhafra Region",
      ],
    },
    economicActivity: {
      id: "economicActivity",
      label: "Economic Activity",
      icon: "ti-building",
      options: ["All", "Construction", "Public Admin", "Manufacturing", "Services"],
    },
    occupation: {
      id: "occupation",
      label: "Occupation",
      icon: "ti-briefcase",
      options: ["All", "Professional", "Technical", "Service", "Managerial"],
    },
    education: {
      id: "education",
      label: "Education Level",
      icon: "ti-school",
      options: ["All", "Bachelor+", "Upper Secondary", "Lower Secondary", "Primary"],
    },
    ageGroup: {
      id: "ageGroup",
      label: "Age Group",
      icon: "ti-users",
      options: ["All", "15-24", "25-34", "35-44", "45+"],
    },
  };

  const INSIGHTS = [
    {
      id: "olf-edu",
      title: "Outside Labor Force by Education",
      type: "breakdown",
      fmt: "k",
      icon: "ti-school",
      hideKpi: true,
      labels: ["Lower Secondary", "Upper Secondary", "Bachelor or above", "Less than Primary"],
      a: [86, 85, 24, 32],
      b: [173, 158, 118, 22],
      aDelta: [9.85, -4.55, 40.09, -4.51],
      bDelta: [3.26, 5.21, 13.49, 9.91],
      summary: { left: "173K", center: ["114K", "0", "114K"], right: "173K" },
      insight:
        "The number of non-Emirati males with post-secondary education outside the labor force in Al Dhafra Region surged to 420 (+433%). Among Emirati males with a bachelor's degree in Al Dhafra, the count increased to 278 (+275%). Emirati females with higher education in Abu Dhabi Region reached 1,148 (+116%). Non-Emirati males with primary education in Abu Dhabi Region rose to 6,414 (+139%). These sharp increases highlight growing pockets of working-age population outside the labour force, concentrated in specific region-education segments.",
      updated: "09/2025",
      subtitle: "Explore working-age population outside the labour force by education level across Abu Dhabi Emirate.",
      category: "Education",
      description: "Count of working-age population outside the labour force, segmented by education attainment and citizenship.",
      chartSummary: "Non-Emirati counts dominate every education band; bachelor-and-above segments show the fastest growth outside the labour force.",
      filters: ["citizenship", "gender", "region", "education"],
      stakeholders: {
        policy:
          "<strong>Overview:</strong> Surging outside-labour-force counts among educated non-Emiratis in Al Dhafra and Abu Dhabi Region warrant targeted activation programmes. Consider incentives for Emirati female participation and skills alignment for degree holders re-entering the workforce.",
        employers:
          "<strong>Employer lens:</strong> Growing pools of educated workers outside the labour force represent untapped talent. Review recruitment outreach to degree holders and design flexible entry pathways for segments showing the sharpest increases.",
        seekers:
          "<strong>Job seeker lens:</strong> Education segments with rising outside-labour-force counts may indicate mismatch or access barriers. Priorise credential recognition, career counselling, and regional mobility support for re-entry.",
      },
    },
    {
      id: "emp-age",
      title: "Employment by Age",
      type: "breakdown",
      fmt: "k",
      headline: "389K",
      delta: 7.61,
      labels: ["40-44", "35-39", "30-34", "25-29"],
      a: [42, 50, 46, 51],
      b: [389, 496, 555, 401],
      insight:
        "Employment concentrates in the 25-44 band; non-Emirati participation dominates every age group.",
      updated: "09/2025",
      subtitle: "Explore employment distribution across age cohorts in Abu Dhabi Emirate.",
      category: "Employment",
      description: "Employed population by age group, split by Emirati and Non-Emirati citizenship.",
      chartSummary: "The 30-34 cohort records the highest employment among non-Emiratis; Emirati employment peaks in the 25-29 band.",
      filters: ["citizenship", "gender", "region", "ageGroup"],
      stakeholders: {
        policy:
          "<strong>Overview:</strong> Employment concentrates in the prime working-age band (25-44). Policy should sustain youth entry pathways while expanding Emirati participation in mid-career cohorts where non-Emirati shares remain highest.",
        employers:
          "<strong>Employer lens:</strong> The 30-34 and 35-39 bands offer the largest talent pools. Align workforce planning and succession coverage to these cohorts while building graduate pipelines for younger entrants.",
        seekers:
          "<strong>Job seeker lens:</strong> Strongest hiring momentum sits in the 25-44 range. Focus job search and upskilling on sectors actively recruiting within your age cohort.",
      },
    },
    {
      id: "emp-econ",
      title: "Employment by Economic Activity",
      type: "breakdown",
      fmt: "k",
      headline: "581K",
      delta: 9.36,
      labels: ["Construction", "Public Admin", "Mining & Quarrying", "Household Activities"],
      a: [7, 8, 0.1, 0.2],
      b: [581, 208, 70, 516],
      insight: "Construction and public administration remain the two largest employing activities.",
      updated: "09/2025",
      subtitle: "Explore employment patterns across economic activities in Abu Dhabi Emirate.",
      category: "Employment",
      description: "Employed population by ISIC economic activity, split by citizenship.",
      chartSummary: "Construction leads total employment; household activities and public administration follow as the next largest sectors.",
      filters: ["citizenship", "gender", "region", "economicActivity"],
      stakeholders: {
        policy:
          "<strong>Overview:</strong> Construction and public administration anchor employment. Diversification policy should monitor construction cyclicality while accelerating Emirati placement in household services and public sector roles.",
        employers:
          "<strong>Employer lens:</strong> Construction and household activities drive the bulk of hiring demand. Sector-specific talent pipelines and safety certification remain critical for sustained growth.",
        seekers:
          "<strong>Job seeker lens:</strong> Construction, household activities, and public administration offer the widest job openings. Match skills and certifications to the activity showing strongest year-on-year expansion.",
      },
    },
    {
      id: "emp-econ-occ",
      title: "Employment by Economic Activity & Occupation",
      type: "trend",
      headline: "2.9M",
      delta: 10.55,
      labels: ["2022", "2023", "2024", "2025"],
      series: [2.42, 2.6, 2.74, 2.9],
      insight: "Employment across activity-occupation pairs has grown steadily since 2022.",
      updated: "09/2025",
      subtitle: "Explore historical employment patterns across activity and occupation in Abu Dhabi Emirate.",
      category: "Employment",
      description: "Total employment by economic activity and occupation cross-tabulation, emirate-wide.",
      chartSummary: "Employment continues to expand, with the strongest acceleration appearing in the latest years.",
      filters: ["citizenship", "gender", "region", "economicActivity", "occupation"],
      stakeholders: {
        policy:
          "<strong>Overview:</strong> Steady expansion across activity-occupation pairs supports labour market resilience. Target Emiratisation in high-growth occupation-activity combinations while monitoring skills supply in technical roles.",
        employers:
          "<strong>Employer lens:</strong> Broad-based hiring growth signals opportunity to strengthen role-specific training and align recruitment plans with the fastest-growing activity-occupation pairs.",
        seekers:
          "<strong>Job seeker lens:</strong> Employment momentum is spread across multiple activity-occupation combinations. Prioritise credentials that map directly to expanding occupational groups.",
      },
    },
    {
      id: "emp-edu",
      title: "Employment by Education",
      type: "breakdown",
      fmt: "k",
      headline: "703K",
      delta: 13.71,
      labels: ["Bachelor+", "Upper Secondary", "Lower Secondary", "Primary"],
      a: [113, 98, 13, 2],
      b: [703, 287, 568, 473],
      insight: "Bachelor-and-above holders show the strongest employment correlation across both groups.",
      updated: "09/2025",
      subtitle: "Explore employment levels by educational attainment across Abu Dhabi Emirate.",
      category: "Education",
      description: "Employed population by highest education level attained, split by citizenship.",
      chartSummary: "Degree holders dominate non-Emirati employment; upper-secondary attainment shows the broadest base across both groups.",
      filters: ["citizenship", "gender", "region", "education"],
      stakeholders: {
        policy:
          "<strong>Overview:</strong> Higher education strongly correlates with employment outcomes. Expand scholarship-to-employment pathways and address primary-education segments with lower Emirati participation.",
        employers:
          "<strong>Employer lens:</strong> Bachelor-and-above talent pools are deep but competitive. Invest in graduate programmes and vocational pathways for upper-secondary entrants to widen the pipeline.",
        seekers:
          "<strong>Job seeker lens:</strong> Degree holders see the strongest employment outcomes. Upskilling toward post-secondary qualifications unlocks the widest set of opportunities.",
      },
    },
    {
      id: "emp-pop",
      title: "Employed Population",
      type: "trend",
      headline: "2.9M",
      delta: 10.55,
      labels: ["2022", "2023", "2024", "2025"],
      series: [2.42, 2.6, 2.74, 2.9],
      insight: "Abu Dhabi's employed population crossed 2.9M in 2025, up steadily since 2022.",
      updated: "09/2025",
      subtitle: "Track total employed population trends across Abu Dhabi Emirate.",
      category: "Employment",
      description: "Total count of employed persons in Abu Dhabi Emirate, all sectors and citizenships.",
      chartSummary: "Employed population has risen consistently since 2022, crossing 2.9M in 2025.",
      filters: ["citizenship", "gender", "region"],
      stakeholders: {
        policy:
          "<strong>Overview:</strong> Crossing 2.9M employed signals robust labour market expansion. Maintain infrastructure and housing supply to support continued inflows while tracking Emirati share of net new jobs.",
        employers:
          "<strong>Employer lens:</strong> A growing employed base expands the consumer market and talent competition. Plan capacity and retention strategies for a labour pool that added ~480K since 2022.",
        seekers:
          "<strong>Job seeker lens:</strong> A steadily expanding employed population indicates sustained hiring. Active job search and sector targeting align with a market adding roles year-on-year.",
      },
    },
    {
      id: "emp-rate",
      title: "Employment Rate",
      type: "trend",
      headline: "96.2%",
      delta: 1.99,
      labels: ["2022", "2023", "2024", "2025"],
      series: [94.2, 95.0, 95.5, 96.2],
      insight: "Employment rate improved every year, reaching 96.2% of the labour force in 2025.",
      updated: "09/2025",
      subtitle: "Monitor the share of the labour force that is employed across Abu Dhabi Emirate.",
      category: "Employment",
      description: "Employment-to-labour-force ratio (employed ÷ labour force × 100).",
      chartSummary: "Employment rate improved each year since 2022, reaching 96.2% in 2025.",
      filters: ["citizenship", "gender", "region"],
      stakeholders: {
        policy:
          "<strong>Overview:</strong> A 96.2% employment rate reflects a tight, efficient labour market. Focus remaining policy effort on inactive and unemployed segments rather than aggregate rate improvement.",
        employers:
          "<strong>Employer lens:</strong> High employment rates imply tighter candidate availability. Strengthen employer branding, compensation benchmarks, and upskilling partnerships to compete for scarce talent.",
        seekers:
          "<strong>Job seeker lens:</strong> A rising employment rate indicates favourable conditions for job seekers already in the labour force. Ensure registration and active search to capture available openings.",
      },
    },
    {
      id: "emp-rate-edu",
      title: "Employment Rate by Education",
      type: "breakdown",
      fmt: "pct",
      headline: "96.2%",
      delta: 1.6,
      labels: ["Bachelor+", "Upper Secondary", "Lower Secondary", "Primary"],
      a: [98.1, 96.5, 94.0, 89.2],
      b: [97.0, 96.0, 95.0, 93.0],
      insight: "Employment rate holds above 94% across all education bands, highest for degree holders.",
      updated: "09/2025",
      subtitle: "Compare employment rates across education levels in Abu Dhabi Emirate.",
      category: "Education",
      description: "Employment rate segmented by highest education level, split by citizenship.",
      chartSummary: "Emirati degree holders lead at 98.1%; all bands remain above 89% for both citizenship groups.",
      filters: ["citizenship", "gender", "region", "education"],
      stakeholders: {
        policy:
          "<strong>Overview:</strong> Employment rates above 94% across all education bands show broad labour market absorption. Target primary-education segments (89.2% Emirati) for activation and vocational bridging programmes.",
        employers:
          "<strong>Employer lens:</strong> High employment rates across education tiers mean recruitment success depends on differentiation. Offer clear progression paths especially for upper-secondary and vocational entrants.",
        seekers:
          "<strong>Job seeker lens:</strong> Every education band shows strong employment rates. Additional qualifications still improve outcomes — degree holders reach the highest placement rates.",
      },
    },
    {
      id: "lf-econ",
      title: "Labor Force by Economic Activity",
      type: "breakdown",
      fmt: "k",
      headline: "581K",
      delta: 9.36,
      labels: ["Construction", "Public Admin", "Mining & Quarrying", "Household Activities"],
      a: [7, 8, 0.1, 0.2],
      b: [581, 208, 70, 516],
      insight: "Mirrors the employment split closely — unemployment is a small share of the labour force here.",
      updated: "09/2025",
      subtitle: "Explore labour force distribution across economic activities in Abu Dhabi Emirate.",
      category: "Labour Force",
      description: "Economically active population by economic activity, split by citizenship.",
      chartSummary: "Labour force composition closely tracks employment — construction and household activities dominate.",
      filters: ["citizenship", "gender", "region", "economicActivity"],
      stakeholders: {
        policy:
          "<strong>Overview:</strong> Labour force and employment splits align, indicating low sectoral unemployment. Monitor construction-dependent labour force concentration for cyclical risk.",
        employers:
          "<strong>Employer lens:</strong> Sector labour-force depth mirrors hiring patterns. Workforce planning can rely on construction and services as primary sourcing sectors.",
        seekers:
          "<strong>Job seeker lens:</strong> Sectors with the largest labour force also offer the most turnover and new openings. Construction and household activities remain primary search targets.",
      },
    },
    {
      id: "lf-trend",
      title: "Labor Force by Education & Age",
      type: "trend",
      headline: "3M",
      delta: 9.51,
      labels: ["2022", "2023", "2024", "2025"],
      series: [2.5, 2.7, 2.85, 3.0],
      insight: "Labour force size has grown ~9.5% since 2022, tracked here by age and by occupation.",
      updated: "09/2025",
      subtitle: "Track labour force growth by education and age across Abu Dhabi Emirate.",
      category: "Labour Force",
      description: "Total labour force size trend, with education and age cross-dimensions available via filters.",
      chartSummary: "Labour force expanded from 2.5M to 3.0M between 2022 and 2025, a ~9.5% cumulative increase.",
      filters: ["citizenship", "gender", "region", "education", "ageGroup"],
      stakeholders: {
        policy:
          "<strong>Overview:</strong> Labour force growth of ~9.5% since 2022 supports economic expansion targets. Align education output and work-visa policy with age-cohort inflows to prevent future mismatch.",
        employers:
          "<strong>Employer lens:</strong> A growing labour force expands the hiring pool. Plan onboarding capacity and training infrastructure for sustained net inflows.",
        seekers:
          "<strong>Job seeker lens:</strong> A larger labour force reflects more participants competing for roles — differentiation through skills and sector focus becomes more important.",
      },
    },
  ];

  function fmtBar(v, fmt) {
    if (fmt === "pct") return v.toFixed(1) + "%";
    if (v < 1) return v.toFixed(1) + "K";
    return (Number.isInteger(v) ? v : v.toFixed(1)) + "K";
  }

  function calcPyrPct(val, fmt, item, side) {
    if (fmt === "pct") return Math.min(Math.max(val, 0), 100);
    const arr = side === "emi" ? item.a : item.b;
    const sideMax = Math.max(...arr, 1);
    return val ? Math.max((val / sideMax) * 100, 4) : 0;
  }

  function pyrBarStyle(pct) {
    return `style="--pyr-bar-pct:${pct}%"`;
  }

  function fmtPyrDelta(v) {
    if (v == null || Number.isNaN(v)) return "";
    const up = v >= 0;
    const sign = up ? "+" : "";
    const cls = up ? "up" : "dn";
    return `<span class="obs-pyr-chg ${cls}">${sign}${Math.abs(v).toFixed(2)}%</span>`;
  }

  function buildPyrBarSide(val, pct, fmt, deltaHtml, side) {
    const valText = fmtBar(val, fmt);
    const sideCls = side === "emi" ? "emi" : "non";
    const barStyle = pyrBarStyle(pct);
    const meta = `<span class="obs-pyr-meta obs-pyr-meta--${sideCls}"><span class="obs-pyr-val">${valText}</span>${deltaHtml}</span>`;
    const bar = `<div class="obs-pyr-bar obs-pyr-bar--${sideCls}" ${barStyle}></div>`;
    const track = side === "emi" ? `${meta}${bar}` : `${bar}${meta}`;
    return `<div class="obs-pyr-side obs-pyr-side--${sideCls}"><div class="obs-pyr-bar-track">${track}</div></div>`;
  }

  function buildPyramidHtml(item) {
    const fmt = item.fmt;
    const rows = item.labels
      .map((label, i) => {
        const aVal = item.a[i];
        const bVal = item.b[i];
        const aPct = calcPyrPct(aVal, fmt, item, "emi");
        const bPct = calcPyrPct(bVal, fmt, item, "non");
        const aDelta = item.aDelta ? fmtPyrDelta(item.aDelta[i]) : "";
        const bDelta = item.bDelta ? fmtPyrDelta(item.bDelta[i]) : "";
        return `<div class="obs-pyr-row">
          <span class="obs-pyr-lbl" data-full="${label}">${label}</span>
          <div class="obs-pyr-split">
            ${buildPyrBarSide(aVal, aPct, fmt, aDelta, "emi")}
            <div class="obs-pyr-axis" aria-hidden="true"></div>
            ${buildPyrBarSide(bVal, bPct, fmt, bDelta, "non")}
          </div>
        </div>`;
      })
      .join("");

    return `<div class="obs-pyr">
      <div class="obs-pyr-hd">
        <span class="obs-pyr-hd-group">Group</span>
        <div class="obs-pyr-hd-split">
          <span class="obs-pyr-hd-emi">Emirati</span>
          <span class="obs-pyr-hd-non">Non-Emirati</span>
        </div>
      </div>
      <div class="obs-pyr-rows">${rows}</div>
    </div>`;
  }

  function findInsight(id) {
    return INSIGHTS.find((item) => item.id === id) || null;
  }

  function signalMetrics(item) {
    if (item.type === "trend" && item.series && item.series.length) {
      const first = item.series[0];
      const last = item.series[item.series.length - 1];
      const sincePct = first ? (((last - first) / first) * 100).toFixed(1) : "0";
      const latest = item.headline || (item.fmt === "pct" ? last.toFixed(1) + "%" : last + "M");
      const yoy = item.delta != null ? (item.delta >= 0 ? "+" : "") + item.delta + "%" : "—";
      return { latest, yoy, since: (sincePct >= 0 ? "+" : "") + sincePct + "%", sinceLabel: "Since " + item.labels[0] };
    }
    if (item.type === "breakdown") {
      const maxB = Math.max(...(item.b || [0]));
      const latest = item.headline || (item.hideKpi && item.summary ? item.summary.right : fmtBar(maxB, item.fmt));
      const yoy = item.delta != null ? (item.delta >= 0 ? "+" : "") + item.delta + "%" : "—";
      const totalA = (item.a || []).reduce((s, v) => s + v, 0);
      const totalB = (item.b || []).reduce((s, v) => s + v, 0);
      const sincePct = totalA ? (((totalB - totalA) / totalA) * 100).toFixed(1) : "0";
      return { latest, yoy, since: (sincePct >= 0 ? "+" : "") + sincePct + "%", sinceLabel: "Emirati vs Non-Emirati gap" };
    }
    return { latest: "—", yoy: "—", since: "—", sinceLabel: "Baseline" };
  }

  window.LMO_INSIGHTS = INSIGHTS;
  window.LMO_INSIGHT_FILTER_DEFS = FILTER_DEFS;
  window.LMO_INSIGHT_HELPERS = {
    INSIGHT_LEGEND,
    fmtBar,
    calcPyrPct,
    pyrBarStyle,
    fmtPyrDelta,
    buildPyrBarSide,
    buildPyramidHtml,
    findInsight,
    signalMetrics,
  };
})();
