// ETL Pipeline Studio bundle
window.WB_ETL_STUDIO_HTML = "<div class=\"view\" id=\"v-etl\">\n              <!-- ─── SUB-VIEW 1: PIPELINE LIBRARY ─── -->\n              <div class=\"etl-view active\" id=\"etl-library\">\n                <div class=\"etl-sub-header\">\n                  <div class=\"etl-breadcrumb\">\n                    <span class=\"etl-bc-cur\">Data Transformation</span>\n                  </div>\n                  <div class=\"etl-sub-header-right\">\n                    <button class=\"btn btn-s btn-sm\">\n                      <i class=\"ti ti-search\"></i> Search\n                    </button>\n                    <button\n                      class=\"btn btn-p btn-sm\"\n                      onclick=\"etlGoTo('etl-builder')\"\n                    >\n                      <i class=\"ti ti-plus\"></i> New Pipeline\n                    </button>\n                  </div>\n                </div>\n                <div class=\"lib-body\">\n                  <div class=\"lib-header\">\n                    <div class=\"lib-header-left\">\n                      <h1>Data Transformation</h1>\n                      <p>\n                        Build, manage, and monitor your data pipelines — from\n                        source to destination.\n                      </p>\n                    </div>\n                  </div>\n                  <div class=\"lib-tabs\">\n                    <div class=\"lib-tab active\" onclick=\"etlLibTab(this, 'my')\">\n                      My Pipelines\n                    </div>\n                    <div class=\"lib-tab\" onclick=\"etlLibTab(this, 'tmpl')\">\n                      Templates\n                    </div>\n                  </div>\n                  <div id=\"etl-tab-my\">\n                    <div class=\"section-label\">Active pipelines (3)</div>\n                    <div class=\"pipelines-grid\">\n                      <div class=\"new-card\" onclick=\"etlGoTo('etl-builder')\">\n                        <div class=\"nc-icon\"><i class=\"ti ti-plus\"></i></div>\n                        <div class=\"nc-label\">Create new pipeline</div>\n                        <div class=\"nc-sub\">\n                          Connect a source, transform, and deliver\n                        </div>\n                      </div>\n                      <div\n                        class=\"pipe-card c-blue\"\n                        onclick=\"etlGoTo('etl-workspace')\"\n                      >\n                        <div class=\"pc-head\">\n                          <div class=\"pc-icon blue\">\n                            <i class=\"ti ti-transfer\"></i>\n                          </div>\n                          <div class=\"pc-meta\">\n                            <div class=\"pc-name\">Labour Registry Cleanse</div>\n                            <div class=\"pc-type\">PostgreSQL → ClickHouse</div>\n                          </div>\n                          <span class=\"pc-badge ok\"\n                            ><i class=\"ti ti-check\"></i> Healthy</span\n                          >\n                        </div>\n                        <div class=\"pc-flow\">\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-database\"></i\n                            ><span>PostgreSQL · labour_db</span>\n                          </div>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <span class=\"pc-flow-badge\">3 transforms</span>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-database\"></i\n                            ><span>ClickHouse · dwh</span>\n                          </div>\n                        </div>\n                        <div class=\"pc-stats\">\n                          <div class=\"pc-stat\">\n                            <div class=\"pc-stat-val\">24</div>\n                            <div class=\"pc-stat-lbl\">Runs</div>\n                          </div>\n                          <div class=\"pc-stat\">\n                            <div class=\"pc-stat-val\">1.2M</div>\n                            <div class=\"pc-stat-lbl\">Rows/run</div>\n                          </div>\n                          <div class=\"pc-stat\">\n                            <div class=\"pc-stat-val\">99.2%</div>\n                            <div class=\"pc-stat-lbl\">Success</div>\n                          </div>\n                        </div>\n                        <div class=\"pc-footer\">\n                          <div class=\"pc-last\">\n                            <i class=\"ti ti-clock\"></i> Last run 06:04 today\n                          </div>\n                          <div class=\"pc-actions\">\n                            <button\n                              class=\"btn btn-s btn-xs\"\n                              onclick=\"\n                                event.stopPropagation();\n                                toast('Running…', 'ti-player-play');\n                              \"\n                            >\n                              <i class=\"ti ti-player-play\"></i>\n                            </button>\n                            <button\n                              class=\"btn btn-s btn-xs\"\n                              onclick=\"\n                                event.stopPropagation();\n                                etlGoTo('etl-workspace');\n                              \"\n                            >\n                              <i class=\"ti ti-message-chatbot\"></i> Open\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"pipe-card c-teal\">\n                        <div class=\"pc-head\">\n                          <div class=\"pc-icon teal\">\n                            <i class=\"ti ti-table-import\"></i>\n                          </div>\n                          <div class=\"pc-meta\">\n                            <div class=\"pc-name\">GDP Sector Aggregation</div>\n                            <div class=\"pc-type\">ClickHouse → Tableau</div>\n                          </div>\n                          <span class=\"pc-badge ok\"\n                            ><i class=\"ti ti-check\"></i> Healthy</span\n                          >\n                        </div>\n                        <div class=\"pc-flow\">\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-database\"></i\n                            ><span>ClickHouse · scad_dw</span>\n                          </div>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <span class=\"pc-flow-badge\">2 transforms</span>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-chart-bar\"></i\n                            ><span>Tableau · GDP</span>\n                          </div>\n                        </div>\n                        <div class=\"pc-stats\">\n                          <div class=\"pc-stat\">\n                            <div class=\"pc-stat-val\">12</div>\n                            <div class=\"pc-stat-lbl\">Runs</div>\n                          </div>\n                          <div class=\"pc-stat\">\n                            <div class=\"pc-stat-val\">340K</div>\n                            <div class=\"pc-stat-lbl\">Rows/run</div>\n                          </div>\n                          <div class=\"pc-stat\">\n                            <div class=\"pc-stat-val\">100%</div>\n                            <div class=\"pc-stat-lbl\">Success</div>\n                          </div>\n                        </div>\n                        <div class=\"pc-footer\">\n                          <div class=\"pc-last\">\n                            <i class=\"ti ti-clock\"></i> Last run yesterday\n                          </div>\n                          <div class=\"pc-actions\">\n                            <button\n                              class=\"btn btn-s btn-xs\"\n                              onclick=\"toast('Running…', 'ti-player-play')\"\n                            >\n                              <i class=\"ti ti-player-play\"></i>\n                            </button>\n                            <button class=\"btn btn-s btn-xs\">\n                              <i class=\"ti ti-message-chatbot\"></i> Open\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"pipe-card c-orange\">\n                        <div class=\"pc-head\">\n                          <div class=\"pc-icon orange\">\n                            <i class=\"ti ti-file-import\"></i>\n                          </div>\n                          <div class=\"pc-meta\">\n                            <div class=\"pc-name\">CPI CSV Ingestor</div>\n                            <div class=\"pc-type\">CSV Upload → PostgreSQL</div>\n                          </div>\n                          <span class=\"pc-badge warn\"\n                            ><i class=\"ti ti-alert-triangle\"></i> 2\n                            warnings</span\n                          >\n                        </div>\n                        <div class=\"pc-flow\">\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-file-spreadsheet\"></i\n                            ><span>CSV · monthly upload</span>\n                          </div>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <span class=\"pc-flow-badge\">1 transform</span>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-database\"></i\n                            ><span>PostgreSQL · cpi_db</span>\n                          </div>\n                        </div>\n                        <div class=\"pc-stats\">\n                          <div class=\"pc-stat\">\n                            <div class=\"pc-stat-val\">8</div>\n                            <div class=\"pc-stat-lbl\">Runs</div>\n                          </div>\n                          <div class=\"pc-stat\">\n                            <div class=\"pc-stat-val\">28K</div>\n                            <div class=\"pc-stat-lbl\">Rows/run</div>\n                          </div>\n                          <div class=\"pc-stat\">\n                            <div class=\"pc-stat-val\">87.5%</div>\n                            <div class=\"pc-stat-lbl\">Success</div>\n                          </div>\n                        </div>\n                        <div class=\"pc-footer\">\n                          <div class=\"pc-last\">\n                            <i class=\"ti ti-clock\"></i> Last run 3 days ago\n                          </div>\n                          <div class=\"pc-actions\">\n                            <button\n                              class=\"btn btn-s btn-xs\"\n                              onclick=\"toast('Running…', 'ti-player-play')\"\n                            >\n                              <i class=\"ti ti-player-play\"></i>\n                            </button>\n                            <button class=\"btn btn-s btn-xs\">\n                              <i class=\"ti ti-message-chatbot\"></i> Open\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                  <div id=\"etl-tab-tmpl\" style=\"display: none\">\n                    <div class=\"section-label\">Ready-to-use templates (3)</div>\n                    <div class=\"pipelines-grid\">\n                      <div class=\"pipe-card c-blue\">\n                        <div class=\"pc-head\">\n                          <div class=\"pc-icon blue\">\n                            <i class=\"ti ti-transfer\"></i>\n                          </div>\n                          <div class=\"pc-meta\">\n                            <div class=\"pc-name\">DB to DB Migration</div>\n                            <div class=\"pc-type\">Any DB → Any DB</div>\n                          </div>\n                        </div>\n                        <div class=\"pc-flow\">\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-database\"></i><span>Source DB</span>\n                          </div>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <span class=\"pc-flow-badge\">Cleanse + Map</span>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-database\"></i\n                            ><span>Destination</span>\n                          </div>\n                        </div>\n                        <div class=\"pc-footer\" style=\"margin-top: 8px\">\n                          <div class=\"pc-last\">\n                            <i class=\"ti ti-users\"></i> Used 34 times\n                          </div>\n                          <div class=\"pc-actions\">\n                            <button\n                              class=\"btn btn-p btn-xs\"\n                              onclick=\"\n                                etlGoTo('etl-builder');\n                                toast('Template loaded', 'ti-check');\n                              \"\n                            >\n                              Use template\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"pipe-card c-teal\">\n                        <div class=\"pc-head\">\n                          <div class=\"pc-icon teal\">\n                            <i class=\"ti ti-file-import\"></i>\n                          </div>\n                          <div class=\"pc-meta\">\n                            <div class=\"pc-name\">CSV to Database</div>\n                            <div class=\"pc-type\">\n                              CSV Upload → PostgreSQL / ClickHouse\n                            </div>\n                          </div>\n                        </div>\n                        <div class=\"pc-flow\">\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-file-spreadsheet\"></i\n                            ><span>CSV file</span>\n                          </div>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <span class=\"pc-flow-badge\">Validate + Load</span>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-database\"></i><span>Target DB</span>\n                          </div>\n                        </div>\n                        <div class=\"pc-footer\" style=\"margin-top: 8px\">\n                          <div class=\"pc-last\">\n                            <i class=\"ti ti-users\"></i> Used 21 times\n                          </div>\n                          <div class=\"pc-actions\">\n                            <button\n                              class=\"btn btn-p btn-xs\"\n                              onclick=\"\n                                etlGoTo('etl-builder');\n                                toast('Template loaded', 'ti-check');\n                              \"\n                            >\n                              Use template\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"pipe-card c-purple\">\n                        <div class=\"pc-head\">\n                          <div class=\"pc-icon purple\">\n                            <i class=\"ti ti-api\"></i>\n                          </div>\n                          <div class=\"pc-meta\">\n                            <div class=\"pc-name\">API to Warehouse</div>\n                            <div class=\"pc-type\">REST API → ClickHouse</div>\n                          </div>\n                        </div>\n                        <div class=\"pc-flow\">\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-api\"></i><span>REST endpoint</span>\n                          </div>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <span class=\"pc-flow-badge\">Parse + Store</span>\n                          <div class=\"pc-flow-arrow\">\n                            ——<i class=\"ti ti-arrow-right\"></i>\n                          </div>\n                          <div class=\"pc-flow-node\">\n                            <i class=\"ti ti-database\"></i\n                            ><span>ClickHouse</span>\n                          </div>\n                        </div>\n                        <div class=\"pc-footer\" style=\"margin-top: 8px\">\n                          <div class=\"pc-last\">\n                            <i class=\"ti ti-users\"></i> Used 15 times\n                          </div>\n                          <div class=\"pc-actions\">\n                            <button\n                              class=\"btn btn-p btn-xs\"\n                              onclick=\"\n                                etlGoTo('etl-builder');\n                                toast('Template loaded', 'ti-check');\n                              \"\n                            >\n                              Use template\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <!-- /etl-library -->\n\n              <!-- ─── SUB-VIEW 2: PIPELINE BUILDER ─── -->\n              <div class=\"etl-view\" id=\"etl-builder\">\n                <div class=\"etl-sub-header\">\n                  <div class=\"etl-breadcrumb\">\n                    <span class=\"etl-bc-link\" onclick=\"etlGoTo('etl-library')\"\n                      >Data Transformation</span\n                    >\n                    <span class=\"etl-bc-sep\">›</span\n                    ><span class=\"etl-bc-cur\">New Pipeline</span>\n                  </div>\n                  <div class=\"etl-sub-header-right\">\n                    <button\n                      class=\"btn btn-s btn-sm\"\n                      onclick=\"etlGoTo('etl-library')\"\n                    >\n                      <i class=\"ti ti-x\"></i> Cancel\n                    </button>\n                  </div>\n                </div>\n                <div class=\"etl-builder-body\">\n                  <!-- LEFT: CHAT -->\n                  <div class=\"builder-chat\">\n                    <div class=\"builder-chat-top\">\n                      <div class=\"bct-title\">\n                        Pipeline Builder <span class=\"ai-badge\">BAYAAN AI</span>\n                      </div>\n                      <div class=\"bct-sub\">\n                        Answer a few questions — your pipeline configures itself\n                        as you go\n                      </div>\n                    </div>\n                    <div class=\"step-pills\" id=\"etlStepPills\">\n                      <div class=\"step-pill active\" id=\"etlsp0\">\n                        <div class=\"pill-num\">\n                          <span class=\"pill-num-inner\">1</span>\n                        </div>\n                        Name\n                      </div>\n                      <div class=\"step-pill\" id=\"etlsp1\">\n                        <div class=\"pill-num\">\n                          <span class=\"pill-num-inner\">2</span>\n                        </div>\n                        Source\n                      </div>\n                      <div class=\"step-pill\" id=\"etlsp2\">\n                        <div class=\"pill-num\">\n                          <span class=\"pill-num-inner\">3</span>\n                        </div>\n                        Connect\n                      </div>\n                      <div class=\"step-pill\" id=\"etlsp3\">\n                        <div class=\"pill-num\">\n                          <span class=\"pill-num-inner\">4</span>\n                        </div>\n                        Destination\n                      </div>\n                      <div class=\"step-pill\" id=\"etlsp4\">\n                        <div class=\"pill-num\">\n                          <span class=\"pill-num-inner\">5</span>\n                        </div>\n                        Transform\n                      </div>\n                      <div class=\"step-pill\" id=\"etlsp5\">\n                        <div class=\"pill-num\">\n                          <span class=\"pill-num-inner\">6</span>\n                        </div>\n                        Schedule\n                      </div>\n                      <div class=\"step-pill\" id=\"etlsp6\">\n                        <div class=\"pill-num\">\n                          <span class=\"pill-num-inner\">7</span>\n                        </div>\n                        Confirm\n                      </div>\n                    </div>\n                    <div class=\"chat-msgs\" id=\"etlBuilderMsgs\"></div>\n                    <div class=\"chat-input-wrap\">\n                      <div class=\"chat-input-inner\">\n                        <textarea\n                          class=\"chat-ta\"\n                          id=\"etlBuilderInput\"\n                          rows=\"1\"\n                          placeholder=\"Type your answer or tap a suggestion…\"\n                          onkeydown=\"etlBuilderKey(event)\"\n                          oninput=\"autoResize(this)\"\n                        ></textarea>\n                        <button class=\"etl-send-btn\" onclick=\"etlBuilderSend()\">\n                          <i class=\"ti ti-arrow-up\"></i>\n                        </button>\n                      </div>\n                    </div>\n                  </div>\n                  <!-- RIGHT: LIVE PREVIEW -->\n                  <div class=\"builder-preview\">\n                    <div class=\"bp-header\">\n                      <i\n                        class=\"ti ti-git-merge\"\n                        style=\"font-size: 16px; color: var(--t3)\"\n                      ></i>\n                      <span class=\"bp-title\">Pipeline Preview</span>\n                      <span class=\"bp-status\" id=\"etlBpStatus\"\n                        >Configuring…</span\n                      >\n                      <div style=\"margin-left: auto; display: flex; gap: 8px\">\n                        <button\n                          class=\"btn btn-p btn-sm\"\n                          id=\"etlBpFinishBtn\"\n                          style=\"display: none\"\n                          onclick=\"etlOpenModal()\"\n                        >\n                          <i class=\"ti ti-device-floppy\"></i> Save Pipeline\n                        </button>\n                      </div>\n                    </div>\n                    <div class=\"bp-body\">\n                      <div class=\"flow-summary\" id=\"etlFlowSummary\">\n                        <div class=\"fs-label\">\n                          <i class=\"ti ti-git-merge\"></i> Data flow\n                        </div>\n                        <div class=\"fs-nodes\" id=\"etlFsNodes\">\n                          <div class=\"fs-placeholder\">\n                            Your pipeline will take shape here as you answer the\n                            questions on the left…\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"config-strip\" id=\"etlConfigStrip\"></div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <!-- /etl-builder -->\n\n              <!-- ─── SUB-VIEW 3: PIPELINE WORKSPACE ─── -->\n              <div class=\"etl-view\" id=\"etl-workspace\">\n                <div class=\"etl-sub-header\">\n                  <div class=\"etl-breadcrumb\">\n                    <span class=\"etl-bc-link\" onclick=\"etlGoTo('etl-library')\"\n                      >Data Transformation</span\n                    >\n                    <span class=\"etl-bc-sep\">›</span>\n                    <span class=\"etl-bc-link\" onclick=\"etlGoTo('etl-library')\"\n                      >My Pipelines</span\n                    >\n                    <span class=\"etl-bc-sep\">›</span>\n                    <span class=\"etl-bc-cur\">Labour Registry Cleanse</span>\n                  </div>\n                  <div class=\"etl-sub-header-right\">\n                    <button\n                      class=\"btn btn-s btn-sm\"\n                      onclick=\"etlToggleSettings()\"\n                    >\n                      <i class=\"ti ti-settings\"></i> Settings\n                    </button>\n                    <button\n                      class=\"btn btn-p btn-sm\"\n                      onclick=\"toast('Pipeline running…', 'ti-player-play')\"\n                    >\n                      <i class=\"ti ti-player-play\"></i> Run now\n                    </button>\n                  </div>\n                </div>\n                <div class=\"etl-ws-body\">\n                  <!-- SIDEBAR -->\n                  <div class=\"ws-sidebar\">\n                    <div class=\"ws-sidebar-top\">\n                      <div class=\"wsp-info\">\n                        <div class=\"wsp-icon\">\n                          <i class=\"ti ti-transfer\"></i>\n                        </div>\n                        <div>\n                          <div class=\"wsp-name\">Labour Registry Cleanse</div>\n                          <div class=\"wsp-type\">\n                            Daily · PostgreSQL → ClickHouse\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"wsp-flow-mini\">\n                        <i class=\"ti ti-database\"></i\n                        ><span style=\"font-size: 11px; font-weight: 500\"\n                          >labour_db</span\n                        >\n                        <span class=\"arr\">→→</span>\n                        <span\n                          style=\"\n                            font-size: 10px;\n                            background: var(--purple-50);\n                            color: #5930c4;\n                            padding: 1px 6px;\n                            border-radius: 10px;\n                            font-weight: 600;\n                          \"\n                          >3 transforms</span\n                        >\n                        <span class=\"arr\">→→</span>\n                        <i class=\"ti ti-database\"></i\n                        ><span style=\"font-size: 11px; font-weight: 500\"\n                          >dwh</span\n                        >\n                      </div>\n                    </div>\n                    <div class=\"ws-sidebar-mid\">\n                      <div class=\"ws-sec-label\">Run History</div>\n                      <div class=\"run-item active\">\n                        <div class=\"ri-top\">\n                          <div class=\"ri-title\">Today — 06:04 GST</div>\n                        </div>\n                        <div class=\"ri-sub\">1,247,302 rows · 4m 12s</div>\n                        <span class=\"ri-badge ok\"\n                          ><i class=\"ti ti-check\"></i> Success</span\n                        >\n                      </div>\n                      <div class=\"run-item\">\n                        <div class=\"ri-top\">\n                          <div class=\"ri-title\">Yesterday — 06:01 GST</div>\n                        </div>\n                        <div class=\"ri-sub\">1,241,891 rows · 3m 58s</div>\n                        <span class=\"ri-badge ok\"\n                          ><i class=\"ti ti-check\"></i> Success</span\n                        >\n                      </div>\n                      <div class=\"run-item\">\n                        <div class=\"ri-top\">\n                          <div class=\"ri-title\">May 23 — 06:02 GST</div>\n                        </div>\n                        <div class=\"ri-sub\">1,238,445 rows · 4m 34s</div>\n                        <span class=\"ri-badge warn\"\n                          ><i class=\"ti ti-alert-triangle\"></i> 340 rows\n                          skipped</span\n                        >\n                      </div>\n                      <div class=\"run-item\">\n                        <div class=\"ri-top\">\n                          <div class=\"ri-title\">May 22 — 06:00 GST</div>\n                        </div>\n                        <div class=\"ri-sub\">1,236,112 rows · 3m 52s</div>\n                        <span class=\"ri-badge ok\"\n                          ><i class=\"ti ti-check\"></i> Success</span\n                        >\n                      </div>\n                      <div class=\"run-item\">\n                        <div class=\"ri-top\">\n                          <div class=\"ri-title\">May 21 — 06:05 GST</div>\n                        </div>\n                        <div class=\"ri-sub\">1,229,884 rows · 5m 01s</div>\n                        <span class=\"ri-badge err\"\n                          ><i class=\"ti ti-x\"></i> Connection timeout</span\n                        >\n                      </div>\n                      <div class=\"ws-sec-label\" style=\"margin-top: 8px\">\n                        Conversations\n                      </div>\n                      <div class=\"run-item\">\n                        <div class=\"ri-top\">\n                          <div class=\"ri-title\">Asked about May 23 skips</div>\n                        </div>\n                        <div class=\"ri-sub\">Yesterday at 10:22</div>\n                      </div>\n                      <div class=\"run-item\">\n                        <div class=\"ri-top\">\n                          <div class=\"ri-title\">Requested schema export</div>\n                        </div>\n                        <div class=\"ri-sub\">May 22 at 14:05</div>\n                      </div>\n                    </div>\n                    <div class=\"ws-sidebar-bottom\">\n                      <button\n                        class=\"ws-sb-btn\"\n                        onclick=\"etlSwitchTab('pipeline')\"\n                      >\n                        <i class=\"ti ti-git-merge\"></i\n                        ><span>View pipeline diagram</span\n                        ><i class=\"ti ti-chevron-right arr\"></i>\n                      </button>\n                      <button class=\"ws-sb-btn\" onclick=\"etlToggleSettings()\">\n                        <i class=\"ti ti-settings\"></i\n                        ><span>Pipeline settings</span\n                        ><i class=\"ti ti-chevron-right arr\"></i>\n                      </button>\n                    </div>\n                  </div>\n                  <!-- MAIN -->\n                  <div class=\"ws-main\">\n                    <div class=\"ws-main-tabs\">\n                      <div\n                        class=\"ws-tab active\"\n                        id=\"etl-tab-chat\"\n                        onclick=\"etlSwitchTab('chat')\"\n                      >\n                        <i class=\"ti ti-message-chatbot\"></i> Chat\n                      </div>\n                      <div\n                        class=\"ws-tab\"\n                        id=\"etl-tab-pipeline\"\n                        onclick=\"etlSwitchTab('pipeline')\"\n                      >\n                        <i class=\"ti ti-git-merge\"></i> View Pipeline\n                      </div>\n                      <div class=\"ws-tab-divider\"></div>\n                      <div\n                        class=\"ws-tab\"\n                        onclick=\"toast('Opening logs…', 'ti-file-text')\"\n                      >\n                        <i class=\"ti ti-file-text\"></i> Logs\n                      </div>\n                      <div class=\"ws-tab-right\">\n                        <button\n                          class=\"btn btn-s btn-sm\"\n                          onclick=\"toast('Schema exported', 'ti-download')\"\n                        >\n                          <i class=\"ti ti-download\"></i> Export schema\n                        </button>\n                      </div>\n                    </div>\n                    <!-- CHAT PANE -->\n                    <div class=\"ws-chat-pane\" id=\"etlWsChatPane\">\n                      <div\n                        style=\"\n                          display: flex;\n                          align-items: center;\n                          gap: 10px;\n                          margin-bottom: 12px;\n                          margin-top: 4px;\n                        \"\n                      >\n                        <div class=\"rsc-icon ok\">\n                          <i class=\"ti ti-check\"></i>\n                        </div>\n                        <div>\n                          <div\n                            style=\"\n                              font-size: 13.5px;\n                              font-weight: 700;\n                              color: var(--t1);\n                            \"\n                          >\n                            Today's run completed — 1,247,302 rows processed\n                          </div>\n                          <div style=\"font-size: 11.5px; color: var(--t3)\">\n                            06:04 GST · 4m 12s · 0 errors\n                          </div>\n                        </div>\n                        <button\n                          class=\"btn btn-s btn-xs\"\n                          style=\"margin-left: auto\"\n                          onclick=\"\n                            etlWsAsk('Show me a sample of today\\'s output data')\n                          \"\n                        >\n                          View output\n                        </button>\n                      </div>\n                      <div\n                        style=\"\n                          background: var(--white);\n                          border: 1px solid var(--border);\n                          border-radius: 18px;\n                          padding: 16px 20px;\n                          margin-bottom: 16px;\n                        \"\n                      >\n                        <div\n                          style=\"\n                            font-size: 11px;\n                            font-weight: 700;\n                            letter-spacing: 0.07em;\n                            text-transform: uppercase;\n                            color: var(--t3);\n                            margin-bottom: 10px;\n                            display: flex;\n                            align-items: center;\n                            gap: 6px;\n                          \"\n                        >\n                          <i\n                            class=\"ti ti-chart-bar\"\n                            style=\"font-size: 13px; color: var(--acc)\"\n                          ></i\n                          >Run metrics\n                        </div>\n                        <div style=\"display: flex; gap: 10px; flex-wrap: wrap\">\n                          <div class=\"rsc-metric\">\n                            <div class=\"rsc-metric-val\">1.24M</div>\n                            <div class=\"rsc-metric-lbl\">Rows loaded</div>\n                          </div>\n                          <div class=\"rsc-metric\">\n                            <div class=\"rsc-metric-val\">0</div>\n                            <div class=\"rsc-metric-lbl\">Errors</div>\n                          </div>\n                          <div class=\"rsc-metric\">\n                            <div class=\"rsc-metric-val\">4m 12s</div>\n                            <div class=\"rsc-metric-lbl\">Duration</div>\n                          </div>\n                          <div class=\"rsc-metric\">\n                            <div class=\"rsc-metric-val\">99.2%</div>\n                            <div class=\"rsc-metric-lbl\">Data quality</div>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"ws-msg agent etl-fade-up\">\n                        <img class=\"ws-msg-av agent\" src=\"./assets/ai-chat-thumb.svg\" alt=\"Bayaan AI\" width=\"30\" height=\"30\" />\n                        <div class=\"ws-msg-bubble\">\n                          <p>\n                            Today's run completed cleanly. All 1,247,302 rows\n                            from <strong>labour_db.registrations</strong> were\n                            cleansed and loaded into\n                            <strong>ClickHouse · dwh.labour_clean</strong>.\n                          </p>\n                          <p>\n                            You can ask me about data quality, request a sample\n                            output, check schema differences, or adjust the\n                            transform rules for the next run.\n                          </p>\n                        </div>\n                      </div>\n                      <div\n                        class=\"ws-msg user etl-fade-up\"\n                        style=\"animation-delay: 0.1s\"\n                      >\n                        \n                        <div class=\"ws-msg-bubble\">\n                          Why were 340 rows skipped on May 23?\n                        </div>\n                      </div>\n                      <div\n                        class=\"ws-msg agent etl-fade-up\"\n                        style=\"animation-delay: 0.15s\"\n                      >\n                        <img class=\"ws-msg-av agent\" src=\"./assets/ai-chat-thumb.svg\" alt=\"Bayaan AI\" width=\"30\" height=\"30\" />\n                        <div class=\"ws-msg-bubble\">\n                          <p>\n                            I checked the May 23 run log. The 340 skipped rows\n                            all failed the\n                            <strong>null validation rule</strong> on the\n                            <code\n                              style=\"\n                                background: var(--gray-100);\n                                padding: 2px 5px;\n                                border-radius: 4px;\n                                font-family: monospace;\n                                font-size: 12px;\n                              \"\n                              >nationality_code</code\n                            >\n                            field — they came in as empty strings rather than\n                            NULL, which your current filter doesn't catch.\n                          </p>\n                          <p>I can fix this in two ways:</p>\n                          <ul>\n                            <li>\n                              <strong>Auto-fix:</strong> Update the cleanse rule\n                              to treat empty strings as NULL and forward-fill\n                              from prior record\n                            </li>\n                            <li>\n                              <strong>Quarantine:</strong> Route these rows to a\n                              <code\n                                style=\"\n                                  background: var(--gray-100);\n                                  padding: 2px 5px;\n                                  border-radius: 4px;\n                                  font-family: monospace;\n                                  font-size: 12px;\n                                \"\n                                >labour_rejected</code\n                              >\n                              table for manual review\n                            </li>\n                          </ul>\n                          <p>Which approach do you prefer?</p>\n                        </div>\n                      </div>\n                      <div id=\"etlWsExtraMsgs\"></div>\n                    </div>\n                    <!-- PIPELINE DIAGRAM PANE -->\n                    <div class=\"ws-pipeline-pane\" id=\"etlWsPipelinePane\">\n                      <div\n                        style=\"\n                          padding: 20px 24px;\n                          background: var(--white);\n                          border-bottom: 1px solid var(--border);\n                          display: flex;\n                          align-items: center;\n                          gap: 10px;\n                        \"\n                      >\n                        <div\n                          style=\"\n                            font-size: 13px;\n                            font-weight: 600;\n                            color: var(--t1);\n                          \"\n                        >\n                          Labour Registry Cleanse — Pipeline Diagram\n                        </div>\n                        <span\n                          style=\"\n                            font-size: 11px;\n                            font-weight: 600;\n                            padding: 3px 9px;\n                            border-radius: 20px;\n                            background: var(--ok-lt);\n                            color: #3b6d11;\n                            border: 1px solid rgba(99, 153, 34, 0.2);\n                          \"\n                          >Healthy</span\n                        >\n                        <div\n                          style=\"\n                            margin-left: auto;\n                            font-size: 12px;\n                            color: var(--t3);\n                          \"\n                        >\n                          Click any node to inspect\n                        </div>\n                      </div>\n                      <div class=\"pipeline-diagram\">\n                        <div\n                          class=\"pd-node\"\n                          onclick=\"etlOpenNdPanel('source')\"\n                          id=\"etlpdn-source\"\n                        >\n                          <div class=\"pd-node-top blue\"></div>\n                          <div class=\"pd-node-icon blue\">\n                            <i class=\"ti ti-database\"></i>\n                          </div>\n                          <div class=\"pd-type blue\">Source</div>\n                          <div class=\"pd-name\">PostgreSQL</div>\n                          <div class=\"pd-sub\">labour_db.registrations</div>\n                        </div>\n                        <div class=\"pd-arrow\">\n                          <div class=\"pd-arrow-line\"></div>\n                          <div class=\"pd-arrow-head\"></div>\n                        </div>\n                        <div\n                          class=\"pd-node\"\n                          onclick=\"etlOpenNdPanel('cleanse')\"\n                          id=\"etlpdn-cleanse\"\n                        >\n                          <div class=\"pd-node-top purple\"></div>\n                          <div class=\"pd-node-icon purple\">\n                            <i class=\"ti ti-eraser\"></i>\n                          </div>\n                          <div class=\"pd-type purple\">Cleanse</div>\n                          <div class=\"pd-name\">Null Handler</div>\n                          <div class=\"pd-sub\">fill · flag · skip</div>\n                        </div>\n                        <div class=\"pd-arrow\">\n                          <div class=\"pd-arrow-line\"></div>\n                          <div class=\"pd-arrow-head\"></div>\n                        </div>\n                        <div\n                          class=\"pd-node\"\n                          onclick=\"etlOpenNdPanel('join')\"\n                          id=\"etlpdn-join\"\n                        >\n                          <div class=\"pd-node-top purple\"></div>\n                          <div class=\"pd-node-icon purple\">\n                            <i class=\"ti ti-git-merge\"></i>\n                          </div>\n                          <div class=\"pd-type purple\">Join</div>\n                          <div class=\"pd-name\">Sector Lookup</div>\n                          <div class=\"pd-sub\">sector_codes table</div>\n                        </div>\n                        <div class=\"pd-arrow\">\n                          <div class=\"pd-arrow-line\"></div>\n                          <div class=\"pd-arrow-head\"></div>\n                        </div>\n                        <div\n                          class=\"pd-node\"\n                          onclick=\"etlOpenNdPanel('filter')\"\n                          id=\"etlpdn-filter\"\n                        >\n                          <div class=\"pd-node-top orange\"></div>\n                          <div class=\"pd-node-icon orange\">\n                            <i class=\"ti ti-filter\"></i>\n                          </div>\n                          <div class=\"pd-type orange\">Filter</div>\n                          <div class=\"pd-name\">Date Range</div>\n                          <div class=\"pd-sub\">2024 – present</div>\n                        </div>\n                        <div class=\"pd-arrow\">\n                          <div class=\"pd-arrow-line\"></div>\n                          <div class=\"pd-arrow-head\"></div>\n                        </div>\n                        <div\n                          class=\"pd-node\"\n                          onclick=\"etlOpenNdPanel('dest')\"\n                          id=\"etlpdn-dest\"\n                        >\n                          <div class=\"pd-node-top green\"></div>\n                          <div class=\"pd-node-icon green\">\n                            <i class=\"ti ti-database\"></i>\n                          </div>\n                          <div class=\"pd-type green\">Destination</div>\n                          <div class=\"pd-name\">ClickHouse</div>\n                          <div class=\"pd-sub\">dwh.labour_clean</div>\n                        </div>\n                      </div>\n                      <!-- Node detail panel -->\n                      <div class=\"nd-panel\" id=\"etlNdPanel\">\n                        <div class=\"nd-panel-head\">\n                          <div class=\"nd-panel-title\" id=\"etlNdPanelTitle\">\n                            Node\n                          </div>\n                          <button class=\"nd-close\" onclick=\"etlCloseNdPanel()\">\n                            <i class=\"ti ti-x\"></i>\n                          </button>\n                        </div>\n                        <div class=\"nd-panel-body\" id=\"etlNdPanelBody\"></div>\n                      </div>\n                    </div>\n                    <!-- WS INPUT -->\n                    <div class=\"ws-input-area\" id=\"etlWsInputArea\">\n                      <div class=\"ws-quick-actions\">\n                        <div\n                          class=\"ws-qa\"\n                          onclick=\"\n                            etlWsAsk(\n                              'Auto-fix the empty string issue in nationality_code',\n                            )\n                          \"\n                        >\n                          <i class=\"ti ti-wand\"></i> Auto-fix nulls\n                        </div>\n                        <div\n                          class=\"ws-qa\"\n                          onclick=\"\n                            etlWsAsk('Show me a sample of today\\'s output data')\n                          \"\n                        >\n                          <i class=\"ti ti-table\"></i> Sample output\n                        </div>\n                        <div\n                          class=\"ws-qa\"\n                          onclick=\"\n                            etlWsAsk('Add a deduplication step to the pipeline')\n                          \"\n                        >\n                          <i class=\"ti ti-copy-off\"></i> Add dedup step\n                        </div>\n                        <div\n                          class=\"ws-qa\"\n                          onclick=\"\n                            etlWsAsk('Export the full pipeline schema as JSON')\n                          \"\n                        >\n                          <i class=\"ti ti-download\"></i> Export schema\n                        </div>\n                      </div>\n                      <div class=\"ws-input-inner\">\n                        <textarea\n                          class=\"ws-ta\"\n                          id=\"etlWsInput\"\n                          rows=\"1\"\n                          placeholder=\"Ask the pipeline anything, or give it an instruction…\"\n                          onkeydown=\"etlWsKey(event)\"\n                          oninput=\"autoResize(this)\"\n                        ></textarea>\n                        <button class=\"ws-send\" onclick=\"etlWsSend()\">\n                          <i class=\"ti ti-arrow-up\"></i>\n                        </button>\n                      </div>\n                    </div>\n                  </div>\n                  <!-- SETTINGS DRAWER -->\n                  <div class=\"etl-settings-drawer\" id=\"etlSettingsDrawer\">\n                    <div class=\"sd-head\">\n                      <h3>Pipeline settings</h3>\n                      <button class=\"sd-close\" onclick=\"etlToggleSettings()\">\n                        <i class=\"ti ti-x\"></i>\n                      </button>\n                    </div>\n                    <div class=\"sd-body\">\n                      <div class=\"sd-field\">\n                        <div class=\"sd-label\">Pipeline name</div>\n                        <div class=\"sd-val\">Labour Registry Cleanse</div>\n                      </div>\n                      <div class=\"sd-field\">\n                        <div class=\"sd-label\">Source</div>\n                        <div class=\"sd-val\">PostgreSQL</div>\n                        <div class=\"sd-val-sub\">10.0.0.42:5432 · labour_db</div>\n                      </div>\n                      <div class=\"sd-field\">\n                        <div class=\"sd-label\">Destination</div>\n                        <div class=\"sd-val\">ClickHouse</div>\n                        <div class=\"sd-val-sub\">dwh.labour_clean</div>\n                      </div>\n                      <div class=\"sd-field\">\n                        <div class=\"sd-label\">Transforms</div>\n                        <div class=\"sd-val\">3 steps</div>\n                        <div class=\"sd-val-sub\">\n                          Null handler · Sector join · Date filter\n                        </div>\n                      </div>\n                      <div class=\"sd-field\">\n                        <div class=\"sd-label\">Schedule</div>\n                        <div class=\"sd-val\">Daily at 06:00 GST</div>\n                      </div>\n                      <div class=\"sd-divider\"></div>\n                      <div class=\"sd-field\">\n                        <div class=\"sd-label\">Connection</div>\n                        <div class=\"sd-val\">\n                          Verified <span style=\"color: #0f6e56\">✓</span>\n                        </div>\n                        <div class=\"sd-val-sub\">\n                          Last tested today at 05:58 GST\n                        </div>\n                      </div>\n                      <div class=\"sd-field\">\n                        <div class=\"sd-label\">Visibility</div>\n                        <div class=\"sd-val\">Private</div>\n                      </div>\n                      <div class=\"sd-field\">\n                        <div class=\"sd-label\">Created</div>\n                        <div class=\"sd-val\">May 10, 2026</div>\n                        <div class=\"sd-val-sub\">by Unni</div>\n                      </div>\n                    </div>\n                    <div class=\"sd-footer\">\n                      <button\n                        class=\"btn btn-s btn-sm\"\n                        style=\"justify-content: center\"\n                        onclick=\"toast('Opening editor…', 'ti-edit')\"\n                      >\n                        <i class=\"ti ti-edit\"></i> Edit pipeline\n                      </button>\n                      <button\n                        class=\"btn btn-danger btn-sm\"\n                        style=\"justify-content: center\"\n                        onclick=\"\n                          toast('Pipeline deleted', 'ti-trash');\n                          etlToggleSettings();\n                          etlGoTo('etl-library');\n                        \"\n                      >\n                        <i class=\"ti ti-trash\"></i> Delete pipeline\n                      </button>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <!-- /etl-workspace -->\n            </div>";

      /* ── NAVIGATION ── */
      function etlGoTo(id) {
        document
          .querySelectorAll("#v-etl .etl-view")
          .forEach((v) => v.classList.remove("active"));
        const target = document.getElementById(id);
        if (target) target.classList.add("active");
        if (id === "etl-builder" && !etlBuilderStarted) etlStartBuilder();
      }
      function etlLibTab(el, tab) {
        document
          .querySelectorAll("#v-etl .lib-tab")
          .forEach((t) => t.classList.remove("active"));
        el.classList.add("active");
        document.getElementById("etl-tab-my").style.display =
          tab === "my" ? "" : "none";
        document.getElementById("etl-tab-tmpl").style.display =
          tab === "tmpl" ? "" : "none";
      }

      /* ── MODAL ── */
      let etlModalChoice = "priv";
      function etlOpenModal() {
        document.getElementById("etlSaveModal").classList.add("show");
      }
      function etlCloseModal() {
        document.getElementById("etlSaveModal").classList.remove("show");
      }
      function etlSelectModal(c) {
        etlModalChoice = c;
        document
          .getElementById("etlMoPriv")
          .classList.toggle("sel", c === "priv");
        document
          .getElementById("etlMoShared")
          .classList.toggle("sel", c === "shared");
      }
      function etlConfirmSave() {
        etlCloseModal();
        toast(
          etlModalChoice === "shared"
            ? "Pipeline shared with team"
            : "Pipeline saved to My Pipelines",
          "ti-check",
        );
        setTimeout(() => etlGoTo("etl-library"), 500);
      }

      /* ── WS TABS ── */
      function etlSwitchTab(tab) {
        const chatPane = document.getElementById("etlWsChatPane");
        const pipePane = document.getElementById("etlWsPipelinePane");
        const inputArea = document.getElementById("etlWsInputArea");
        document
          .getElementById("etl-tab-chat")
          .classList.toggle("active", tab === "chat");
        document
          .getElementById("etl-tab-pipeline")
          .classList.toggle("active", tab === "pipeline");
        if (tab === "chat") {
          chatPane.style.display = "";
          pipePane.classList.remove("show");
          inputArea.style.display = "";
        } else {
          chatPane.style.display = "none";
          pipePane.classList.add("show");
          inputArea.style.display = "none";
          etlCloseNdPanel();
        }
      }

      /* ── NODE DETAIL PANEL ── */
      const ETL_ND_DATA = {
        source: {
          title: "Source — PostgreSQL",
          body: `<div class="nd-field"><div class="nd-field-label">Type</div><div class="nd-field-val">PostgreSQL 15.2</div></div><div class="nd-field"><div class="nd-field-label">Host</div><div class="nd-field-val nd-field-sub">10.0.0.42:5432</div></div><div class="nd-field"><div class="nd-field-label">Database</div><div class="nd-field-val">labour_db</div></div><div class="nd-field"><div class="nd-field-label">Table</div><div class="nd-field-val nd-field-sub">public.registrations</div></div><div class="nd-field"><div class="nd-field-label">Connection</div><div class="nd-field-val" style="color:#0F6E56;">✓ Verified · 05:58 GST</div></div><div class="nd-field"><div class="nd-field-label">Rows (last run)</div><div class="nd-field-val">1,247,302</div></div>`,
        },
        cleanse: {
          title: "Transform — Null Handler",
          body: `<div class="nd-field"><div class="nd-field-label">Rule 1</div><div class="nd-field-val">Empty string → NULL</div><div class="nd-field-sub">nationality_code, sector_code</div></div><div class="nd-field"><div class="nd-field-label">Rule 2</div><div class="nd-field-val">NULL fill strategy</div><div class="nd-field-sub">Forward-fill from prior row</div></div><div class="nd-field"><div class="nd-field-label">On fail</div><div class="nd-field-val">Skip row · log warning</div></div><div class="nd-field"><div class="nd-field-label">Rows affected (last run)</div><div class="nd-field-val">0 skipped</div></div>`,
        },
        join: {
          title: "Transform — Sector Lookup",
          body: `<div class="nd-field"><div class="nd-field-label">Join type</div><div class="nd-field-val">LEFT JOIN</div></div><div class="nd-field"><div class="nd-field-label">Lookup table</div><div class="nd-field-sub">reference.sector_codes</div></div><div class="nd-field"><div class="nd-field-label">Join key</div><div class="nd-field-sub">sector_code = code</div></div><div class="nd-field"><div class="nd-field-label">Added columns</div><div class="nd-field-val">sector_name, sector_group</div></div>`,
        },
        filter: {
          title: "Transform — Date Filter",
          body: `<div class="nd-field"><div class="nd-field-label">Column</div><div class="nd-field-sub">registration_date</div></div><div class="nd-field"><div class="nd-field-label">Range</div><div class="nd-field-val">2024-01-01 → present</div></div><div class="nd-field"><div class="nd-field-label">Rows filtered out</div><div class="nd-field-val">0 (last run)</div></div>`,
        },
        dest: {
          title: "Destination — ClickHouse",
          body: `<div class="nd-field"><div class="nd-field-label">Type</div><div class="nd-field-val">ClickHouse 23.8</div></div><div class="nd-field"><div class="nd-field-label">Host</div><div class="nd-field-sub">dwh-ch.bayaan.internal:8123</div></div><div class="nd-field"><div class="nd-field-label">Table</div><div class="nd-field-sub">dwh.labour_clean</div></div><div class="nd-field"><div class="nd-field-label">Write mode</div><div class="nd-field-val">Append (insert new)</div></div><div class="nd-field"><div class="nd-field-label">Last write</div><div class="nd-field-val">06:04 GST today</div></div>`,
        },
      };
      function etlOpenNdPanel(key) {
        const d = ETL_ND_DATA[key];
        if (!d) return;
        document
          .querySelectorAll("#v-etl .pd-node")
          .forEach((n) => n.classList.remove("selected"));
        document.getElementById("etlpdn-" + key)?.classList.add("selected");
        document.getElementById("etlNdPanelTitle").textContent = d.title;
        document.getElementById("etlNdPanelBody").innerHTML = d.body;
        document.getElementById("etlNdPanel").classList.add("open");
      }
      function etlCloseNdPanel() {
        document.getElementById("etlNdPanel").classList.remove("open");
        document
          .querySelectorAll("#v-etl .pd-node")
          .forEach((n) => n.classList.remove("selected"));
      }

      /* ── SETTINGS DRAWER ── */
      function etlToggleSettings() {
        document.getElementById("etlSettingsDrawer").classList.toggle("open");
      }

      /* ── WS CHAT ── */
      function etlWsKey(e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          etlWsSend();
        }
      }
      function etlWsAsk(q) {
        document.getElementById("etlWsInput").value = q;
        etlWsSend();
      }
      function etlWsSend() {
        const inp = document.getElementById("etlWsInput");
        const v = inp.value.trim();
        if (!v) return;
        inp.value = "";
        inp.style.height = "auto";
        const c = document.getElementById("etlWsExtraMsgs");
        const um = document.createElement("div");
        um.className = "ws-msg user";
        um.innerHTML = `<div class="ws-msg-bubble">${etlEscHtml(v)}</div>`;
        c.appendChild(um);
        etlScrollWs();
        const tEl = document.createElement("div");
        tEl.className = "ws-msg agent";
        tEl.innerHTML = `${baiAvatarHtml("ws-msg-av agent", 30)}<div class="etl-typing"><div class="etl-td"></div><div class="etl-td"></div><div class="etl-td"></div></div>`;
        c.appendChild(tEl);
        etlScrollWs();
        setTimeout(
          () => {
            tEl.remove();
            const am = document.createElement("div");
            am.className = "ws-msg agent";
            am.innerHTML = `${baiAvatarHtml("ws-msg-av agent", 30)}<div class="ws-msg-bubble">${etlGetWsReply(v)}</div>`;
            c.appendChild(am);
            etlScrollWs();
          },
          900 + Math.random() * 500,
        );
      }
      function etlGetWsReply(q) {
        const l = q.toLowerCase();
        if (l.includes("auto-fix") || l.includes("empty string"))
          return `<p>Done. I've updated the <strong>Null Handler</strong> transform with two new rules:</p><ul><li>Empty strings are now treated as NULL before validation</li><li>NULL <code style="background:var(--gray-100);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:12px;">nationality_code</code> values will forward-fill from the prior row, or use <code style="background:var(--gray-100);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:12px;">"UNKNOWN"</code> if no prior row exists.</li></ul><p>The change takes effect on the next run. Want me to back-fill the 340 skipped rows from May 23?</p>`;
        if (l.includes("sample") || l.includes("output"))
          return `<p>Here's a sample from today's output (<strong>dwh.labour_clean</strong>, first 3 rows):</p><div class="code-block">registration_id | nationality | sector_name  | reg_date<br>───────────────────────────────────────────<br>REG-2026-084231 | AE          | Construction | 2026-05-25<br>REG-2026-084232 | IN          | Hospitality  | 2026-05-25<br>REG-2026-084233 | PK          | Construction | 2026-05-25</div><p>All columns are clean. Data quality score: <strong>99.2%</strong>.</p>`;
        if (l.includes("dedup") || l.includes("deduplication"))
          return `<p>I'll add a <strong>Deduplication</strong> step between the Sector Lookup and Date Filter nodes, deduplicating on <code style="background:var(--gray-100);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:12px;">registration_id</code>. Estimated impact: ~0.3% of rows per run. Should I apply this now?</p>`;
        if (l.includes("schema") || l.includes("export"))
          return `<p>Here's the output schema for <strong>dwh.labour_clean</strong>:</p><div class="code-block">registration_id  VARCHAR(20)  PK<br>nationality_code VARCHAR(3)<br>nationality      VARCHAR(60)<br>sector_code      VARCHAR(10)<br>sector_name      VARCHAR(80)<br>sector_group     VARCHAR(40)<br>registration_date DATE<br>_loaded_at       TIMESTAMP</div><p>Want me to generate a data dictionary?</p>`;
        return `<p>I've checked the <strong>Labour Registry Cleanse</strong> pipeline. Based on the latest run data and transform configuration, everything appears to be functioning within expected parameters. Let me know if you'd like to drill into a specific step or run.</p>`;
      }
      function etlScrollWs() {
        const c = document.getElementById("etlWsChatPane");
        if (c) c.scrollTop = c.scrollHeight;
      }

      /* ══════════════════════════════════════
   ETL BUILDER ENGINE
══════════════════════════════════════ */
      const ETL_STEPS = [
        {
          key: "name",
          isNameStep: true,
          msg: `Let's build your data pipeline. First — **what do you want to call it?**\n\nGive it a clear name so you can find it easily later.`,
          chips: [],
          cfIcon: "gray",
          cfIconName: "ti-tag",
          cfLabel: "Pipeline name",
          followUp: (v) =>
            `**"${v}"** — great name. Now let's connect your data source.`,
          fsUpdate: () => null,
        },
        {
          key: "source",
          msg: `Where is the **source data** coming from?`,
          chips: [
            { i: "ti-brand-postgresql", l: "PostgreSQL" },
            { i: "ti-database", l: "ClickHouse" },
            { i: "ti-database", l: "MySQL" },
            { i: "ti-database", l: "Microsoft SQL Server" },
            { i: "ti-file-spreadsheet", l: "CSV / Excel upload" },
            { i: "ti-api", l: "REST API" },
          ],
          cfIcon: "blue",
          cfIconName: "ti-database",
          cfLabel: "Source type",
          followUp: (v) =>
            v.includes("CSV") || v.includes("Excel")
              ? `Got it — **${v}**. No connection needed, you'll upload files directly. Let's set up your destination.`
              : `**${v}** selected. Let me collect the connection details.`,
          fsUpdate: (cfg) =>
            etlAddFsNode(
              "source",
              "blue",
              "ti-database",
              "Source",
              cfg.source,
              "—",
            ),
          skipConnect: (v) => v.includes("CSV") || v.includes("Excel"),
        },
        {
          key: "connection",
          isConnectStep: true,
          msg: `__CONNECT_STEP__`,
          chips: [],
          cfIcon: "teal",
          cfIconName: "ti-plug",
          cfLabel: "Connection",
          followUp: (v) =>
            `Connection verified ✓ — **${v}** is live and ready.`,
          fsUpdate: (cfg) => {
            const el = document.getElementById("etl-fsn-source");
            if (el)
              el.querySelector(".fs-node-sub").textContent =
                cfg.connection || "connected";
          },
        },
        {
          key: "destination",
          msg: `Where should the transformed data **land**?`,
          chips: [
            { i: "ti-database", l: "ClickHouse (Bayaan DWH)" },
            { i: "ti-brand-postgresql", l: "PostgreSQL" },
            { i: "ti-chart-bar", l: "Tableau extract" },
            { i: "ti-table", l: "Power BI dataset" },
            { i: "ti-file-analytics", l: "CSV / Flat file" },
            { i: "ti-api", l: "REST API endpoint" },
          ],
          cfIcon: "green",
          cfIconName: "ti-database",
          cfLabel: "Destination",
          followUp: (v) =>
            `Data will land in **${v}**. Now let's define what happens in between.`,
          fsUpdate: (cfg) =>
            etlAddFsNode(
              "dest",
              "green",
              "ti-database",
              "Destination",
              cfg.destination,
              "—",
            ),
        },
        {
          key: "transform",
          msg: `What **transformations** should happen to the data? Pick all that apply.`,
          chips: [
            { i: "ti-eraser", l: "Cleanse nulls & fix data types" },
            { i: "ti-git-merge", l: "Join with another table" },
            { i: "ti-filter", l: "Filter rows by condition" },
            { i: "ti-calculator", l: "Aggregate & summarise" },
            { i: "ti-copy-off", l: "Deduplicate records" },
            { i: "ti-wand", l: "AI-suggest transforms" },
          ],
          multi: true,
          cfIcon: "purple",
          cfIconName: "ti-wand",
          cfLabel: "Transforms",
          followUp: (v) =>
            `I'll apply: **${v}**. Bayaan will run these in sequence on every pipeline execution.`,
          fsUpdate: (cfg) =>
            etlAddFsNode(
              "transform",
              "purple",
              "ti-filter",
              "Transform",
              cfg.transform,
              "in sequence",
            ),
        },
        {
          key: "schedule",
          msg: `When should the pipeline **run**?`,
          chips: [
            { i: "ti-calendar", l: "Daily at 06:00 GST" },
            { i: "ti-clock", l: "Every hour" },
            { i: "ti-calendar-week", l: "Weekly on Monday" },
            { i: "ti-refresh", l: "When source data updates" },
            { i: "ti-player-play", l: "Manual runs only" },
          ],
          cfIcon: "amber",
          cfIconName: "ti-clock",
          cfLabel: "Schedule",
          followUp: (v) =>
            `Scheduled for **${v}**. All set — let me put together your pipeline.`,
          fsUpdate: () => null,
        },
      ];

      let etlBuilderStarted = false,
        etlBStep = 0,
        etlBConfig = {},
        etlBTyping = false,
        etlSelectedChips = [];
      const etlFsNodeIds = {};

      function etlAddFsNode(id, color, icon, type, name, sub) {
        const container = document.getElementById("etlFsNodes");
        if (!container) return;
        const placeholder = container.querySelector(".fs-placeholder");
        if (placeholder) placeholder.remove();
        if (etlFsNodeIds[id]) {
          const el = document.getElementById("etl-fsn-" + id);
          if (el) {
            el.querySelector(".fs-node-name").textContent = name;
            el.querySelector(".fs-node-sub").textContent = sub;
          }
          return;
        }
        if (Object.keys(etlFsNodeIds).length > 0) {
          const conn = document.createElement("div");
          conn.style.cssText =
            "display:flex;align-items:flex-start;gap:12px;opacity:1;";
          const lineWrap = document.createElement("div");
          lineWrap.className = "fs-node-line";
          const connector = document.createElement("div");
          connector.className = "fs-node-connector";
          connector.style.minHeight = "16px";
          lineWrap.appendChild(connector);
          const lbl = document.createElement("div");
          lbl.style.cssText =
            "font-size:11px;color:var(--t3);padding-top:0;padding-bottom:14px;display:flex;align-items:center;gap:5px;";
          lbl.innerHTML = `<i class="ti ti-arrow-down" style="font-size:11px;color:var(--gray-300);"></i>`;
          conn.appendChild(lineWrap);
          conn.appendChild(lbl);
          container.appendChild(conn);
        }
        const node = document.createElement("div");
        node.className = "fs-node";
        node.id = "etl-fsn-" + id;
        node.innerHTML = `<div class="fs-node-line"><div class="fs-node-dot ${color}"></div>${Object.keys(etlFsNodeIds).length > 0 ? '<div class="fs-node-connector" style="min-height:0;"></div>' : ""}</div><div class="fs-node-body"><div class="fs-node-type ${color}">${type}</div><div class="fs-node-name">${etlEscHtml(name)}</div><div class="fs-node-sub">${etlEscHtml(sub)}</div></div>`;
        container.appendChild(node);
        etlFsNodeIds[id] = true;
        setTimeout(() => node.classList.add("in"), 50);
      }

      function etlStartBuilder() {
        etlBuilderStarted = true;
        etlBStep = 0;
        etlBConfig = {};
        etlBTyping = false;
        etlSelectedChips = [];
        Object.keys(etlFsNodeIds).forEach((k) => delete etlFsNodeIds[k]);
        document.getElementById("etlBuilderMsgs").innerHTML = "";
        document.getElementById("etlConfigStrip").innerHTML = "";
        document.getElementById("etlFsNodes").innerHTML =
          '<div class="fs-placeholder">Your pipeline will take shape here as you answer the questions on the left…</div>';
        document.getElementById("etlBpStatus").textContent = "Configuring…";
        document.getElementById("etlBpStatus").className = "bp-status";
        document.getElementById("etlBpFinishBtn").style.display = "none";
        etlResetPills();
        etlShowTyping(() => {
          const s = ETL_STEPS[0];
          if (s.isNameStep) {
            etlShowNameInput(null);
          } else {
            etlAddMsg("ai", s.msg, s.chips, s.multi);
          }
          etlSetPill(0, "active");
        });
      }
      function etlResetPills() {
        for (let i = 0; i < 7; i++) {
          const p = document.getElementById("etlsp" + i);
          if (p) {
            p.className = "step-pill";
            p.querySelector(".pill-num-inner").textContent = i + 1;
          }
        }
      }
      function etlSetPill(idx, state) {
        const p = document.getElementById("etlsp" + idx);
        if (!p) return;
        if (state === "done") {
          p.className = "step-pill done";
          p.querySelector(".pill-num-inner").textContent = "✓";
        } else if (state === "active") {
          p.className = "step-pill active";
        }
      }

      /* ── NAME INLINE ── */
      function etlShowNameInput(suggested) {
        const c = document.getElementById("etlBuilderMsgs");
        const aiMsg = document.createElement("div");
        aiMsg.className = "msg ai";
        aiMsg.innerHTML = `${baiAvatarHtml("msg-av ai", 30)}<div class="msg-body"><div class="msg-bubble"><p>${etlMdHtml(ETL_STEPS[0].msg)}</p></div></div>`;
        c.appendChild(aiMsg);
        const card = document.createElement("div");
        card.className = "name-inline";
        card.id = "etl-name-card";
        card.innerHTML = `<div class="name-inline-label">Pipeline name</div>
    <div class="name-input-row">
      <input class="name-input-field" id="etlNameField" type="text" placeholder="e.g. Labour Registry Cleanse" value="${etlEscHtml(suggested || "")}" onkeydown="if(event.key==='Enter'){event.preventDefault();etlConfirmName();}"/>
      <button class="btn btn-p btn-sm" onclick="etlConfirmName()"><i class="ti ti-check"></i> Set name</button>
    </div>
    <div class="name-hint">Give it a clear, descriptive name — you can always rename it later.</div>`;
        c.appendChild(card);
        c.scrollTop = c.scrollHeight;
        setTimeout(() => document.getElementById("etlNameField")?.focus(), 60);
      }
      function etlConfirmName() {
        const inp = document.getElementById("etlNameField");
        if (!inp) return;
        const v = inp.value.trim();
        if (!v) return;
        document.getElementById("etl-name-card")?.remove();
        etlProcessAnswer(v);
      }

      /* ── DB CONNECT CARD ── */
      function etlShowConnectCard(sourceType) {
        const c = document.getElementById("etlBuilderMsgs");
        const aiMsg = document.createElement("div");
        aiMsg.className = "msg ai";
        aiMsg.innerHTML = `${baiAvatarHtml("msg-av ai", 30)}<div class="msg-body"><div class="msg-bubble"><p>Let's connect to your <strong>${etlEscHtml(sourceType)}</strong> instance. Fill in the details — credentials are encrypted and never stored in plain text.</p></div></div>`;
        c.appendChild(aiMsg);
        const card = document.createElement("div");
        card.className = "inline-card";
        card.id = "etl-conn-card";
        card.innerHTML = `<div class="ic-label">Connection details</div>
    <div class="ic-row">
      <div class="ic-field"><label>Host / IP</label><input class="mono" id="etl-db-host" placeholder="10.0.0.42" value="10.0.0.42"/></div>
      <div class="ic-field"><label>Port</label><input class="mono" id="etl-db-port" placeholder="5432" value="${etlGetDefaultPort(sourceType)}"/></div>
    </div>
    <div class="ic-field"><label>Database name</label><input class="mono" id="etl-db-name" placeholder="my_database" value="labour_db"/></div>
    <div class="ic-row">
      <div class="ic-field"><label>Username</label><input class="mono" id="etl-db-user" placeholder="db_user" value="bayaan_reader"/></div>
      <div class="ic-field"><label>Password</label><input type="password" id="etl-db-pass" placeholder="••••••••" value="••••••••"/></div>
    </div>
    <div class="ic-actions">
      <button class="btn btn-s btn-sm" onclick="etlTestConnection()"><i class="ti ti-plug"></i> Test connection</button>
      <button class="btn btn-p btn-sm" onclick="etlConfirmConnection()"><i class="ti ti-check"></i> Connect</button>
      <span class="conn-status" id="etlConnStatus"></span>
    </div>`;
        c.appendChild(card);
        c.scrollTop = c.scrollHeight;
      }
      function etlGetDefaultPort(src) {
        if (src.includes("MySQL")) return "3306";
        if (src.includes("SQL Server")) return "1433";
        if (src.includes("ClickHouse")) return "8123";
        return "5432";
      }
      function etlTestConnection() {
        const s = document.getElementById("etlConnStatus");
        s.className = "conn-status testing";
        s.innerHTML = '<i class="ti ti-loader"></i> Testing…';
        setTimeout(() => {
          s.className = "conn-status ok";
          s.innerHTML = '<i class="ti ti-check"></i> Connected';
        }, 1400);
      }
      function etlConfirmConnection() {
        const host = document.getElementById("etl-db-host")?.value || "host";
        const db = document.getElementById("etl-db-name")?.value || "db";
        document.getElementById("etl-conn-card")?.remove();
        etlProcessAnswer(`${host} · ${db}`);
      }

      /* ── MULTI-SELECT ── */
      function etlShowMultiConfirm() {
        const existing = document.getElementById("etl-multi-confirm");
        if (existing) return;
        const c = document.getElementById("etlBuilderMsgs");
        const wrap = document.createElement("div");
        wrap.id = "etl-multi-confirm";
        wrap.style.cssText = "margin-left:40px;margin-top:8px;";
        const btn = document.createElement("button");
        btn.className = "btn btn-p btn-sm";
        btn.innerHTML = '<i class="ti ti-check"></i> Confirm transforms';
        btn.onclick = etlConfirmMulti;
        wrap.appendChild(btn);
        c.appendChild(wrap);
        c.scrollTop = c.scrollHeight;
      }
      function etlConfirmMulti() {
        if (!etlSelectedChips.length) return;
        document.getElementById("etl-multi-confirm")?.remove();
        etlProcessAnswer(etlSelectedChips.join(", "));
      }

      /* ── CORE ANSWER PROCESSOR ── */
      function etlBuilderKey(e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          etlBuilderSend();
        }
      }
      function etlBuilderSend() {
        const v = document.getElementById("etlBuilderInput").value.trim();
        if (!v || etlBTyping) return;
        document.getElementById("etlBuilderInput").value = "";
        document.getElementById("etlBuilderInput").style.height = "auto";
        etlProcessAnswer(v);
      }
      function etlProcessAnswer(val) {
        etlRemoveChipsAnchor();
        const step = ETL_STEPS[etlBStep];
        etlBConfig[step.key] = val;
        etlAddMsg("user", "<p>" + etlEscHtml(val) + "</p>");
        etlSetPill(etlBStep, "done");
        etlAddConfigField(step, val);
        if (step.fsUpdate) step.fsUpdate(etlBConfig);
        etlSelectedChips = [];
        etlBStep++;
        if (etlBStep < ETL_STEPS.length && ETL_STEPS[etlBStep].isConnectStep) {
          const prev = ETL_STEPS[etlBStep - 1];
          if (prev.skipConnect && prev.skipConnect(val)) {
            etlBStep++;
          }
        }
        if (etlBStep < ETL_STEPS.length) {
          const next = ETL_STEPS[etlBStep];
          etlShowTyping(() => {
            etlAddMsg("ai", step.followUp(val));
            setTimeout(
              () =>
                etlShowTyping(() => {
                  if (next.isConnectStep) {
                    etlShowConnectCard(etlBConfig.source);
                    etlSetPill(etlBStep, "active");
                  } else {
                    etlAddMsg("ai", next.msg, next.chips, next.multi);
                    etlSetPill(etlBStep, "active");
                  }
                }),
              500,
            );
          });
        } else {
          etlShowTyping(() => {
            etlAddMsg("ai", step.followUp(val));
            setTimeout(() => etlShowTyping(() => etlFinishBuilder()), 700);
          });
        }
      }
      function etlFinishBuilder() {
        const name = etlBConfig.name || "New Pipeline";
        etlAddMsg(
          "ai",
          `✅ **"${name}" is ready to save!**\n\nReview the data flow on the right. When you're happy, click **Save Pipeline** to choose who can run it.`,
        );
        etlSetPill(6, "active");
        document.getElementById("etlBpStatus").textContent = "Ready to save";
        document.getElementById("etlBpStatus").className = "bp-status ready";
        document.getElementById("etlBpFinishBtn").style.display = "";
      }
      function etlAddConfigField(step, val) {
        const strip = document.getElementById("etlConfigStrip");
        const row = document.createElement("div");
        row.className = "cf-row";
        const mono = step.key === "connection" ? " cf-mono" : "";
        row.innerHTML = `<div class="cf-icon ${step.cfIcon}"><i class="ti ${step.cfIconName}"></i></div><div class="cf-content"><div class="cf-label">${step.cfLabel}</div><div class="cf-value${mono}">${etlEscHtml(val)}</div></div>`;
        strip.appendChild(row);
        setTimeout(() => row.classList.add("in"), 50);
      }

      /* ── SHARED CHAT HELPERS ── */
      function etlAddMsg(role, html, chips, isMulti) {
        const c = document.getElementById("etlBuilderMsgs");
        const wrap = document.createElement("div");
        wrap.className = "msg " + role;
        const body = document.createElement("div");
        body.className = "msg-body";
        const bubble = document.createElement("div");
        bubble.className = "msg-bubble";
        bubble.innerHTML = etlMdHtml(html);
        body.appendChild(bubble);
        if (role === "ai") {
          wrap.appendChild(baiAvatarEl("msg-av ai", 30));
          wrap.appendChild(body);
        } else {
          wrap.appendChild(body);
        }
        c.appendChild(wrap);
        if (chips && chips.length) {
          const anchor = document.createElement("div");
          anchor.className = "msg";
          anchor.id = "etl-chips-anchor";
          const sp = document.createElement("div");
          sp.style.width = "40px";
          const row = document.createElement("div");
          row.className = "chips-row";
          chips.forEach((ch) => {
            const btn = document.createElement("button");
            btn.className = "chip";
            btn.innerHTML = `<i class="ti ${ch.i}"></i>${ch.l}`;
            btn.dataset.v = ch.l;
            btn.onclick = () => {
              if (!isMulti) {
                document
                  .querySelectorAll("#v-etl .chip")
                  .forEach((x) => x.classList.remove("sel"));
                btn.classList.add("sel");
                setTimeout(() => etlProcessAnswer(ch.l), 250);
              } else {
                btn.classList.toggle("sel");
                etlSelectedChips = Array.from(
                  document.querySelectorAll("#v-etl .chip.sel"),
                ).map((x) => x.dataset.v);
                if (etlSelectedChips.length) etlShowMultiConfirm();
                else document.getElementById("etl-multi-confirm")?.remove();
              }
            };
            row.appendChild(btn);
          });
          anchor.appendChild(sp);
          anchor.appendChild(row);
          c.appendChild(anchor);
        }
        c.scrollTop = c.scrollHeight;
      }
      function etlRemoveChipsAnchor() {
        document.getElementById("etl-chips-anchor")?.remove();
      }
      function etlShowTyping(cb) {
        etlBTyping = true;
        const c = document.getElementById("etlBuilderMsgs");
        const el = document.createElement("div");
        el.id = "etl-typing-ind";
        el.className = "msg ai";
        el.innerHTML = `${baiAvatarHtml("msg-av ai", 30)}<div class="etl-typing"><div class="etl-td"></div><div class="etl-td"></div><div class="etl-td"></div></div>`;
        c.appendChild(el);
        c.scrollTop = c.scrollHeight;
        setTimeout(
          () => {
            el.remove();
            etlBTyping = false;
            cb();
          },
          800 + Math.random() * 400,
        );
      }
      function etlMdHtml(t) {
        if (!t) return "";
        return t
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n\n/g, "</p><p>")
          .replace(/\n/g, "<br>")
          .replace(/^/, "<p>")
          .replace(/$/, "</p>");
      }
      function etlEscHtml(s) {
        return (s || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }
