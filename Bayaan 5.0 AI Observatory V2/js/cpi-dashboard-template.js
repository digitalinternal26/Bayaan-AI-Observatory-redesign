window.CPID_DASHBOARD_MAIN_HTML=`<div class="cpi-page-header">
                <div class="cpid-headcard">
                  <!-- Row 1 — identity + filters + export -->
                  <div class="cpid-hc-row">
                    <div class="cpid-hc-lead">
                      <h1 class="cpid-hc-title">Consumer Price Index</h1>
                      <span class="cpid-status"><span class="cpid-status-dot" aria-hidden="true"></span><span id="cpidStatusText">Q4 2025</span></span>
                    </div>
                    <div class="cpid-hc-actions">
                      <!-- Filters — standard app filter bar (.prod-filter-dd) -->
                      <div class="cpid-filters">
                  <div class="prod-filter-dd" data-dd="year">
                    <button type="button" class="prod-filter-dd-trigger" aria-expanded="false" aria-controls="cpidYearMenu" aria-label="Select year" onclick="cpidToggleDd('year')">
                      <i class="ti ti-calendar prod-filter-dd-lead" aria-hidden="true"></i>
                      <span data-dd-label>2025</span>
                      <i class="ti ti-chevron-down" aria-hidden="true"></i>
                    </button>
                    <div class="prod-filter-dd-menu" id="cpidYearMenu" role="listbox" aria-label="Year" hidden>
                      <div class="prod-filter-dd-head">
                        <button type="button" class="prod-filter-dd-reset" data-dd-reset disabled>
                          <i class="ti ti-rotate-2" aria-hidden="true"></i> <span>Reset filter</span>
                        </button>
                      </div>
                      <button type="button" class="prod-filter-dd-option is-active" role="option">2025 <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option">2024 <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option">2023 <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option">2022 <i class="ti ti-check" aria-hidden="true"></i></button>
                    </div>
                  </div>

                  <div class="prod-filter-dd" data-dd="quarter">
                    <button type="button" class="prod-filter-dd-trigger" aria-expanded="false" aria-controls="cpidQuarterMenu" aria-label="Select quarter" onclick="cpidToggleDd('quarter')">
                      <i class="ti ti-calendar-stats prod-filter-dd-lead" aria-hidden="true"></i>
                      <span data-dd-label>Q4</span>
                      <i class="ti ti-chevron-down" aria-hidden="true"></i>
                    </button>
                    <div class="prod-filter-dd-menu" id="cpidQuarterMenu" role="listbox" aria-label="Quarter" hidden>
                      <div class="prod-filter-dd-head">
                        <button type="button" class="prod-filter-dd-reset" data-dd-reset disabled>
                          <i class="ti ti-rotate-2" aria-hidden="true"></i> <span>Reset filter</span>
                        </button>
                      </div>
                      <button type="button" class="prod-filter-dd-option is-active" role="option">Q4 <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option">Q3 <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option">Q2 <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option">Q1 <i class="ti ti-check" aria-hidden="true"></i></button>
                    </div>
                  </div>

                  <div class="prod-filter-dd" data-dd="group">
                    <button type="button" class="prod-filter-dd-trigger" aria-expanded="false" aria-controls="cpidGroupMenu" aria-label="Select the group" onclick="cpidToggleDd('group')">
                      <i class="ti ti-chart-bar prod-filter-dd-lead" data-dd-lead aria-hidden="true"></i>
                      <span data-dd-label>General Index</span>
                      <i class="ti ti-chevron-down" aria-hidden="true"></i>
                    </button>
                    <div class="prod-filter-dd-menu" id="cpidGroupMenu" role="listbox" aria-label="Group" hidden>
                      <div class="prod-filter-dd-head">
                        <button type="button" class="prod-filter-dd-reset" data-dd-reset disabled>
                          <i class="ti ti-rotate-2" aria-hidden="true"></i> <span>Reset filter</span>
                        </button>
                      </div>
                      <button type="button" class="prod-filter-dd-option is-active" role="option" data-icon="ti-chart-bar"><i class="ti ti-chart-bar prod-filter-dd-oico" aria-hidden="true"></i> General Index <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option" data-icon="ti-tools-kitchen-2"><i class="ti ti-tools-kitchen-2 prod-filter-dd-oico" aria-hidden="true"></i> Food and beverages <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option" data-icon="ti-bottle"><i class="ti ti-bottle prod-filter-dd-oico" aria-hidden="true"></i> Tobacco <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option" data-icon="ti-shirt"><i class="ti ti-shirt prod-filter-dd-oico" aria-hidden="true"></i> Clothing and footwear <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option" data-icon="ti-home"><i class="ti ti-home prod-filter-dd-oico" aria-hidden="true"></i> Housing &amp; utilities <i class="ti ti-check" aria-hidden="true"></i></button>
                      <button type="button" class="prod-filter-dd-option" role="option" data-icon="ti-car"><i class="ti ti-car prod-filter-dd-oico" aria-hidden="true"></i> Transport <i class="ti ti-check" aria-hidden="true"></i></button>
                    </div>
                  </div>

                  <div class="bm-region-seg" role="group" aria-label="Frequency">
                    <button type="button" class="bm-seg-btn is-active" data-freq="quarterly">Quarterly</button>
                    <button type="button" class="bm-seg-btn" data-freq="monthly">Monthly</button>
                  </div>

                        <button type="button" class="cpid-reset-all" id="cpidResetAll" hidden>
                          <i class="ti ti-rotate-2" aria-hidden="true"></i> Reset filters
                        </button>
                      </div>

                      <button type="button" class="cpid-iconbtn" id="cpidShare" title="Share" aria-label="Share">
                        <i class="ti ti-share" aria-hidden="true"></i>
                      </button>
                      <button type="button" class="cpid-export" id="cpidDownload">
                        <i class="ti ti-download" aria-hidden="true"></i> Export
                      </button>
                    </div>
                  </div>

                  <!-- Row 2 — view tabs + result/base-year pills -->
                  <div class="cpid-hc-row cpid-hc-row--tabs">
                    <div class="cpid-view-tabs" role="tablist" aria-label="CPI views">
                      <button type="button" class="cpid-view-tab active" role="tab" data-tab="overview">
                        <i class="ti ti-layout-grid" aria-hidden="true"></i> Overview
                      </button>
                      <button type="button" class="cpid-view-tab" role="tab" data-tab="indicators">
                        <i class="ti ti-list-details" aria-hidden="true"></i> Main Indicators
                      </button>
                      <button type="button" class="cpid-view-tab" role="tab" data-tab="overtime">
                        <i class="ti ti-timeline" aria-hidden="true"></i> CPI Over Time
                      </button>
                      <button type="button" class="cpid-view-tab" role="tab" data-tab="growth">
                        <i class="ti ti-trending-up" aria-hidden="true"></i> Growth Rate
                      </button>
                    </div>
                    <div class="cpid-hc-info">
                      <span class="cpid-info-pill"><i class="ti ti-eye" aria-hidden="true"></i> Showing <b id="cpidResultLabel">Q4 2025</b></span>
                      <span class="cpid-info-pill"><i class="ti ti-info-circle" title="The index reference period against which price changes are measured." aria-hidden="true"></i> Base Year 2021 = 100</span>
                    </div>
                  </div>
                </div>
              </div>

              <div id="cpid-content" class="cpi-obs-content">
                <!-- ── TAB: Overview ── -->
                <section data-panel="overview">
                  <div class="cpid-grid">
                    <div class="obs-card cpid-card">
                      <div class="cpid-card-hd">
                        <span class="cpid-card-ic"><i class="ti ti-chart-line"></i></span>
                        <div>
                          <div class="cpid-card-title">CPI Quarterly</div>
                          <div class="cpid-card-sub">CPI in Q4 2025</div>
                        </div>
                      </div>
                      <div class="cpid-kpi">
                        <span class="cpid-kpi-val">107.4</span>
                        <span class="cpid-delta up"><i class="ti ti-trending-up"></i>0.9%</span>
                      </div>
                      <div class="cpid-kpi-note">Compared with <b>Q3 2025</b></div>
                      <div class="cpid-chart h-md"><canvas id="cpidCpiLine"></canvas></div>
                    </div>

                    <div class="obs-card cpid-card">
                      <div class="cpid-card-hd">
                        <span class="cpid-card-ic"><i class="ti ti-trending-up"></i></span>
                        <div>
                          <div class="cpid-card-title">Annual Growth Rate</div>
                          <div class="cpid-card-sub">in Q4 2025</div>
                        </div>
                      </div>
                      <div class="cpid-kpi">
                        <span class="cpid-kpi-val">1.3%</span>
                        <span class="cpid-delta up"><i class="ti ti-trending-up"></i>0.9 pts</span>
                      </div>
                      <div class="cpid-kpi-note">Compared with <b>Q3 2025</b></div>
                      <div class="cpid-chart h-md"><canvas id="cpidGrowthLine"></canvas></div>
                    </div>

                    <div class="obs-card cpid-card">
                      <div class="cpid-card-hd">
                        <span class="cpid-card-ic"><i class="ti ti-chart-bar"></i></span>
                        <div>
                          <div class="cpid-card-title">General Index</div>
                          <div class="cpid-card-sub">Quarterly · 2024 Q1 – 2025 Q4</div>
                        </div>
                      </div>
                      <div class="cpid-chart h-md"><canvas id="cpidGeneralBar"></canvas></div>
                    </div>

                    <div class="obs-card cpid-card">
                      <div class="cpid-card-hd">
                        <span class="cpid-card-ic"><i class="ti ti-shopping-cart"></i></span>
                        <div>
                          <div class="cpid-card-title">CPI by Group of Commodities</div>
                          <div class="cpid-card-sub">Q4 2025 · index level</div>
                        </div>
                      </div>
                      <div class="cpid-chart h-md"><canvas id="cpidGroupBar"></canvas></div>
                    </div>
                  </div>
                </section>

                <!-- ── TAB: Main Indicators ── -->
                <section data-panel="indicators" hidden>
                  <div class="cpid-region-cards" role="tablist" aria-label="Region">
                    <button type="button" class="cpid-region-card active" role="tab" data-region="Abu Dhabi Emirate">
                      <span class="cpid-rc-ic"><i class="ti ti-map-pin" aria-hidden="true"></i></span>
                      <span class="cpid-rc-body">
                        <span class="cpid-rc-name">Abu Dhabi Emirate</span>
                        <span class="cpid-rc-kpi"><b>108.1</b><span class="cpid-rc-unit">CPI Q4 2025</span></span>
                        <span class="cpid-rc-chg"><span class="cpid-rc-pct"><i class="ti ti-trending-up" aria-hidden="true"></i>8.1%</span><span class="cpid-rc-cmp">Compared with Q3 2025</span></span>
                      </span>
                      <i class="ti ti-chevron-down cpid-rc-arrow" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="cpid-region-card" role="tab" data-region="Abu Dhabi Region">
                      <span class="cpid-rc-ic"><i class="ti ti-map-pin" aria-hidden="true"></i></span>
                      <span class="cpid-rc-body">
                        <span class="cpid-rc-name">Abu Dhabi Region</span>
                        <span class="cpid-rc-kpi"><b>108.3</b><span class="cpid-rc-unit">CPI Q4 2025</span></span>
                        <span class="cpid-rc-chg"><span class="cpid-rc-pct"><i class="ti ti-trending-up" aria-hidden="true"></i>7.3%</span><span class="cpid-rc-cmp">Compared with Q3 2025</span></span>
                      </span>
                      <i class="ti ti-chevron-down cpid-rc-arrow" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="cpid-region-card" role="tab" data-region="Al Ain Region">
                      <span class="cpid-rc-ic"><i class="ti ti-map-pin" aria-hidden="true"></i></span>
                      <span class="cpid-rc-body">
                        <span class="cpid-rc-name">Al Ain Region</span>
                        <span class="cpid-rc-kpi"><b>108.4</b><span class="cpid-rc-unit">CPI Q4 2025</span></span>
                        <span class="cpid-rc-chg"><span class="cpid-rc-pct"><i class="ti ti-trending-up" aria-hidden="true"></i>8.3%</span><span class="cpid-rc-cmp">Compared with Q3 2025</span></span>
                      </span>
                      <i class="ti ti-chevron-down cpid-rc-arrow" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="cpid-region-card" role="tab" data-region="Al Dhafra Region">
                      <span class="cpid-rc-ic"><i class="ti ti-map-pin" aria-hidden="true"></i></span>
                      <span class="cpid-rc-body">
                        <span class="cpid-rc-name">Al Dhafra Region</span>
                        <span class="cpid-rc-kpi"><b>109.6</b><span class="cpid-rc-unit">CPI Q4 2025</span></span>
                        <span class="cpid-rc-chg"><span class="cpid-rc-pct"><i class="ti ti-trending-up" aria-hidden="true"></i>10.8%</span><span class="cpid-rc-cmp">Compared with Q3 2025</span></span>
                      </span>
                      <i class="ti ti-chevron-down cpid-rc-arrow" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div class="cpid-mi-grid">
                    <!-- Left: relative change vs previous quarter -->
                    <div class="obs-card cpid-mi-panel">
                      <div class="cpid-mi-panel-hd">
                        <span class="cpid-mi-hd-ic"><i class="ti ti-chart-bar" aria-hidden="true"></i></span>
                        <span class="cpid-mi-hd-txt">Relative change during <b>Q4 2025</b> compared with <b>Q3 2025</b> · <span data-region-name>Abu Dhabi Emirate</span></span>
                      </div>
                      <div class="cpid-table-wrap">
                        <table class="cpid-table cpid-rel-table">
                          <thead>
                            <tr><th>Groups of Commodities</th><th>Q4 2025</th><th>Q3 2025</th><th>Relative Change</th></tr>
                          </thead>
                          <tbody id="cpidRelQoq"></tbody>
                        </table>
                      </div>
                    </div>

                    <!-- Relative change vs same quarter last year -->
                    <div class="obs-card cpid-mi-panel">
                      <div class="cpid-mi-panel-hd">
                        <span class="cpid-mi-hd-ic"><i class="ti ti-chart-bar" aria-hidden="true"></i></span>
                        <span class="cpid-mi-hd-txt">Relative change during <b>Q4 2025</b> compared with <b>Q4 2024</b> · <span data-region-name>Abu Dhabi Emirate</span></span>
                      </div>
                      <div class="cpid-table-wrap">
                        <table class="cpid-table cpid-rel-table">
                          <thead>
                            <tr><th>Groups of Commodities</th><th>Q4 2025</th><th>Q4 2024</th><th>Relative Change</th></tr>
                          </thead>
                          <tbody id="cpidRelYoy"></tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div class="cpid-mi-foot">
                    <span class="cpid-mi-foot-note"><i class="ti ti-info-circle" aria-hidden="true"></i> All changes are calculated using unrounded CPI values. Percentage changes may not appear to match changes in index values due to rounding.</span>
                    <span class="cpid-mi-foot-src">Source: Statistics Centre – Abu Dhabi <i class="ti ti-external-link" aria-hidden="true"></i></span>
                  </div>
                </section>

                <!-- ── TAB: CPI Over Time ── -->
                <section data-panel="overtime" hidden>
                  <div class="cpid-ot-hd">
                    <h2 class="cpi-section-title"><i class="ti ti-table"></i> Quarterly Indices</h2>
                    <div class="bm-region-seg cpid-ot-seg" role="group" aria-label="Frequency">
                      <button type="button" class="bm-seg-btn">Monthly</button>
                      <button type="button" class="bm-seg-btn is-active">Quarterly</button>
                      <button type="button" class="bm-seg-btn">Annually</button>
                    </div>
                  </div>
                  <div class="cpid-matrix-wrap">
                    <table class="cpid-matrix">
                      <thead id="cpidMatrixHead"></thead>
                      <tbody id="cpidMatrixBody"></tbody>
                    </table>
                  </div>
                </section>

                <!-- ── TAB: Growth Rate ── -->
                <section data-panel="growth" hidden>
                  <div class="section-hdr">
                    <h2 class="cpi-section-title"><i class="ti ti-chart-bar"></i> Annual Growth Rate · Abu Dhabi Emirate</h2>
                  </div>
                  <div class="cpid-gr-years" id="cpidGrYears" aria-hidden="true"></div>
                  <div class="cpid-chart cpid-gr-chart"><canvas id="cpidGrowthBars"></canvas></div>
                  <div class="cpid-gr-note">*Compared with same quarter of previous year</div>
                </section>
              </div>`;
