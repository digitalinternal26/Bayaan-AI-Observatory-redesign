// Agent Studio bundle
window.WB_AGENT_STUDIO_HTML = "            <div class=\"view\" id=\"v-agent\">\n              <!-- VIEW 1: LIBRARY -->\n              <div class=\"av-view active\" id=\"av-library\">\n                <div class=\"lib-body\">\n                  <div class=\"lib-header\">\n                    <div class=\"lib-header-left\">\n                      <h1>Agent Studio</h1>\n                      <p>\n                        Create, manage, and run your AI agents ” each one a\n                        specialised analyst working for you.\n                      </p>\n                    </div>\n                    <button\n                      class=\"ag-btn ag-btn-primary ag-btn-sm\"\n                      onclick=\"agentGoTo('av-builder')\"\n                    >\n                      <i class=\"ti ti-plus\"></i> New Agent\n                    </button>\n                  </div>\n\n                  <div class=\"lib-tabs\">\n                    <div class=\"lib-tab active\" onclick=\"agLibTab(this, 'my')\">\n                      My Agents\n                    </div>\n                    <div class=\"lib-tab\" onclick=\"agLibTab(this, 'pub')\">\n                      Published Library\n                    </div>\n                  </div>\n\n                  <!-- MY AGENTS -->\n                  <div id=\"ag-tab-my\">\n                    <div class=\"ag-section-label\">Active agents (3)</div>\n                    <div class=\"agents-grid\" style=\"margin-bottom: 28px\">\n                      <div\n                        class=\"new-agent-card\"\n                        onclick=\"agentCreateNew()\"\n                      >\n                        <div class=\"nac-icon\"><i class=\"ti ti-plus\"></i></div>\n                        <div class=\"nac-label\">Create new agent</div>\n                        <div class=\"nac-sub\">\n                          Build a custom agent with AI assistance\n                        </div>\n                      </div>\n\n                      <div\n                        class=\"agent-card color-blue\"\n                        onclick=\"agentGoTo('av-workspace')\"\n                      >\n                        <div class=\"ac-head\">\n                          <div class=\"ac-icon blue\">\n                            <i class=\"ti ti-alert-triangle\"></i>\n                          </div>\n                          <div class=\"ac-meta\">\n                            <div class=\"ac-name\">Labour Anomaly Sentinel</div>\n                            <div class=\"ac-domain\">Labour Market</div>\n                          </div>\n                          <span class=\"ac-badge running\"\n                            ><i class=\"ti ti-clock\"></i> Running</span\n                          >\n                        </div>\n                        <div class=\"ac-desc\">\n                          Monitors the Labour Registry daily and flags\n                          statistical anomalies using Ïƒ > 2.0 threshold. Sends\n                          email digest at 06:00 GST.\n                        </div>\n                        <div class=\"ac-stats\">\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">14</div>\n                            <div class=\"ac-stat-lbl\">Runs</div>\n                          </div>\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">3</div>\n                            <div class=\"ac-stat-lbl\">Alerts</div>\n                          </div>\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">1.2M</div>\n                            <div class=\"ac-stat-lbl\">Rows/run</div>\n                          </div>\n                        </div>\n                        <div class=\"ac-footer\">\n                          <div class=\"ac-last\">\n                            <i class=\"ti ti-clock\"></i> Last run 06:02 GST today\n                          </div>\n                          <div class=\"ac-actions\">\n                            <button\n                              class=\"ag-btn ag-btn-ghost ag-btn-xs\"\n                              onclick=\"\n                                event.stopPropagation();\n                                toast('Running¦', 'ti-player-play');\n                              \"\n                            >\n                              <i class=\"ti ti-player-play\"></i>\n                            </button>\n                            <button\n                              class=\"ag-btn ag-btn-ghost ag-btn-xs\"\n                              onclick=\"\n                                event.stopPropagation();\n                                agentGoTo('av-workspace');\n                              \"\n                            >\n                              <i class=\"ti ti-message-chatbot\"></i> Open\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n\n                      <div class=\"agent-card color-teal\">\n                        <div class=\"ac-head\">\n                          <div class=\"ac-icon teal\">\n                            <i class=\"ti ti-chart-line\"></i>\n                          </div>\n                          <div class=\"ac-meta\">\n                            <div class=\"ac-name\">CPI Trend Monitor</div>\n                            <div class=\"ac-domain\">CPI & Inflation</div>\n                          </div>\n                          <span class=\"ac-badge private\"\n                            ><i class=\"ti ti-lock\"></i> Private</span\n                          >\n                        </div>\n                        <div class=\"ac-desc\">\n                          Tracks month-on-month CPI movement across essential\n                          and non-essential categories. Generates weekly summary\n                          reports automatically.\n                        </div>\n                        <div class=\"ac-stats\">\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">6</div>\n                            <div class=\"ac-stat-lbl\">Runs</div>\n                          </div>\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">0</div>\n                            <div class=\"ac-stat-lbl\">Alerts</div>\n                          </div>\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">4</div>\n                            <div class=\"ac-stat-lbl\">Reports</div>\n                          </div>\n                        </div>\n                        <div class=\"ac-footer\">\n                          <div class=\"ac-last\">\n                            <i class=\"ti ti-clock\"></i> Last run 2 days ago\n                          </div>\n                          <div class=\"ac-actions\">\n                            <button\n                              class=\"ag-btn ag-btn-ghost ag-btn-xs\"\n                              onclick=\"toast('Running¦', 'ti-player-play')\"\n                            >\n                              <i class=\"ti ti-player-play\"></i>\n                            </button>\n                            <button class=\"ag-btn ag-btn-ghost ag-btn-xs\">\n                              <i class=\"ti ti-message-chatbot\"></i> Open\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n\n                      <div class=\"agent-card color-amber\">\n                        <div class=\"ac-head\">\n                          <div class=\"ac-icon amber\">\n                            <i class=\"ti ti-chart-area\"></i>\n                          </div>\n                          <div class=\"ac-meta\">\n                            <div class=\"ac-name\">GDP Forecast Agent</div>\n                            <div class=\"ac-domain\">Economic</div>\n                          </div>\n                          <span class=\"ac-badge published\"\n                            ><i class=\"ti ti-world\"></i> Published</span\n                          >\n                        </div>\n                        <div class=\"ac-desc\">\n                          Generates quarterly GDP forecasts using regression\n                          analysis on National Accounts data. Compares against\n                          GCC peers automatically.\n                        </div>\n                        <div class=\"ac-stats\">\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">24</div>\n                            <div class=\"ac-stat-lbl\">Runs</div>\n                          </div>\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">12</div>\n                            <div class=\"ac-stat-lbl\">Users</div>\n                          </div>\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">8</div>\n                            <div class=\"ac-stat-lbl\">Reports</div>\n                          </div>\n                        </div>\n                        <div class=\"ac-footer\">\n                          <div class=\"ac-last\">\n                            <i class=\"ti ti-clock\"></i> Last run yesterday\n                          </div>\n                          <div class=\"ac-actions\">\n                            <button\n                              class=\"ag-btn ag-btn-ghost ag-btn-xs\"\n                              onclick=\"toast('Running¦', 'ti-player-play')\"\n                            >\n                              <i class=\"ti ti-player-play\"></i>\n                            </button>\n                            <button class=\"ag-btn ag-btn-ghost ag-btn-xs\">\n                              <i class=\"ti ti-message-chatbot\"></i> Open\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n\n                  <!-- PUBLISHED tab (hidden) -->\n                  <div id=\"ag-tab-pub\" style=\"display: none\">\n                    <div class=\"ag-section-label\">\n                      Published by the community (2)\n                    </div>\n                    <div class=\"agents-grid\">\n                      <div class=\"agent-card color-purple\">\n                        <div class=\"ac-head\">\n                          <div class=\"ac-icon purple\">\n                            <i class=\"ti ti-file-description\"></i>\n                          </div>\n                          <div class=\"ac-meta\">\n                            <div class=\"ac-name\">Policy Brief Generator</div>\n                            <div class=\"ac-domain\">Multi-domain</div>\n                          </div>\n                          <span class=\"ac-badge published\"\n                            ><i class=\"ti ti-world\"></i> Library</span\n                          >\n                        </div>\n                        <div class=\"ac-desc\">\n                          Drafts structured policy briefs from observatory data.\n                          Supports multiple domains and customisable output\n                          templates.\n                        </div>\n                        <div class=\"ac-stats\">\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">47</div>\n                            <div class=\"ac-stat-lbl\">Users</div>\n                          </div>\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">4.8</div>\n                            <div class=\"ac-stat-lbl\">Rating</div>\n                          </div>\n                        </div>\n                        <div class=\"ac-footer\">\n                          <div class=\"ac-last\">\n                            <i class=\"ti ti-user\"></i> By Analytics Team\n                          </div>\n                          <div class=\"ac-actions\">\n                            <button\n                              class=\"ag-btn ag-btn-primary ag-btn-xs\"\n                              onclick=\"\n                                toast('Agent added to My Agents', 'ti-check')\n                              \"\n                            >\n                              Use this agent\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"agent-card color-teal\">\n                        <div class=\"ac-head\">\n                          <div class=\"ac-icon teal\">\n                            <i class=\"ti ti-building\"></i>\n                          </div>\n                          <div class=\"ac-meta\">\n                            <div class=\"ac-name\">Construction Cost Tracker</div>\n                            <div class=\"ac-domain\">Construction</div>\n                          </div>\n                          <span class=\"ac-badge published\"\n                            ><i class=\"ti ti-world\"></i> Library</span\n                          >\n                        </div>\n                        <div class=\"ac-desc\">\n                          Monitors construction cost indices, flags unusual\n                          movements, and benchmarks against regional data.\n                        </div>\n                        <div class=\"ac-stats\">\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">29</div>\n                            <div class=\"ac-stat-lbl\">Users</div>\n                          </div>\n                          <div class=\"ac-stat\">\n                            <div class=\"ac-stat-val\">4.5</div>\n                            <div class=\"ac-stat-lbl\">Rating</div>\n                          </div>\n                        </div>\n                        <div class=\"ac-footer\">\n                          <div class=\"ac-last\">\n                            <i class=\"ti ti-user\"></i> By SCAD Analytics\n                          </div>\n                          <div class=\"ac-actions\">\n                            <button\n                              class=\"ag-btn ag-btn-primary ag-btn-xs\"\n                              onclick=\"\n                                toast('Agent added to My Agents', 'ti-check')\n                              \"\n                            >\n                              Use this agent\n                            </button>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- VIEW 2: CONVERSATIONAL BUILDER -->\n              <div class=\"av-view av-builder\" id=\"av-builder\">\n                <!-- LEFT: CHAT -->\n                <div class=\"builder-chat\">\n                  <div class=\"builder-chat-top\">\n                    <div class=\"bct-title\">\n                      Build your agent <span class=\"ai-badge\">BAYAAN AI</span>\n                    </div>\n                    <div class=\"bct-sub\">\n                      Answer a few questions ” your agent builds itself as you\n                      go\n                    </div>\n                  </div>\n                  <div class=\"step-pills\" id=\"agStepPills\">\n                    <div class=\"step-pill active\" id=\"agsp0\">\n                      <div class=\"pill-num\">\n                        <span class=\"pill-num-inner\">1</span>\n                      </div>\n                      Purpose\n                    </div>\n                    <div class=\"step-pill\" id=\"agsp1\">\n                      <div class=\"pill-num\">\n                        <span class=\"pill-num-inner\">2</span>\n                      </div>\n                      Name\n                    </div>\n                    <div class=\"step-pill\" id=\"agsp2\">\n                      <div class=\"pill-num\">\n                        <span class=\"pill-num-inner\">3</span>\n                      </div>\n                      Data\n                    </div>\n                    <div class=\"step-pill\" id=\"agsp3\">\n                      <div class=\"pill-num\">\n                        <span class=\"pill-num-inner\">4</span>\n                      </div>\n                      Trigger\n                    </div>\n                    <div class=\"step-pill\" id=\"agsp4\">\n                      <div class=\"pill-num\">\n                        <span class=\"pill-num-inner\">5</span>\n                      </div>\n                      Action\n                    </div>\n                    <div class=\"step-pill\" id=\"agsp5\">\n                      <div class=\"pill-num\">\n                        <span class=\"pill-num-inner\">6</span>\n                      </div>\n                      Visibility\n                    </div>\n                    <div class=\"step-pill\" id=\"agsp6\">\n                      <div class=\"pill-num\">\n                        <span class=\"pill-num-inner\">7</span>\n                      </div>\n                      Confirm\n                    </div>\n                  </div>\n                  <div class=\"chat-msgs\" id=\"agBuilderMsgs\"></div>\n                  <div class=\"bai-input-area\">\n                    <div class=\"bai-input-row\">\n                      <textarea\n                        class=\"bai-input\"\n                        id=\"agBuilderInput\"\n                        rows=\"2\"\n                        placeholder=\"Type your answer or tap a suggestion…\"\n                        onkeydown=\"agBuilderKey(event)\"\n                        oninput=\"autoResize(this)\"\n                      ></textarea>\n                      <button\n                        type=\"button\"\n                        class=\"bai-send-btn\"\n                        id=\"agBuilderSendBtn\"\n                        onclick=\"agBuilderSend()\"\n                        title=\"Send\"\n                      >\n                        <i class=\"ti ti-send\"></i>\n                      </button>\n                    </div>\n                  </div>\n                </div>\n                <!-- RIGHT: LIVE SUMMARY -->\n                <div class=\"builder-summary\">\n                  <div class=\"bs-header\">\n                    <i\n                      class=\"ti ti-robot\"\n                      style=\"font-size: 16px; color: var(--t3)\"\n                    ></i>\n                    <span class=\"bs-title\">Agent Preview</span>\n                    <span class=\"bs-status\" id=\"agBsStatus\">Configuring¦</span>\n                    <div style=\"margin-left: auto; display: flex; gap: 8px\">\n                      <button\n                        class=\"ag-btn ag-btn-ghost ag-btn-sm\"\n                        onclick=\"agentGoTo('av-library')\"\n                      >\n                        <i class=\"ti ti-x\"></i> Cancel\n                      </button>\n                      <button\n                        class=\"ag-btn ag-btn-primary ag-btn-sm\"\n                        id=\"agBsFinishBtn\"\n                        style=\"display: none\"\n                        onclick=\"agOpenModal()\"\n                      >\n                        <i class=\"ti ti-rocket\"></i> Save Agent\n                      </button>\n                    </div>\n                  </div>\n                  <div class=\"bs-body\">\n                    <div class=\"nl-summary\" id=\"agNlSummary\">\n                      <div class=\"nl-label\">\n                        <i class=\"ti ti-sparkles\"></i> Agent description\n                      </div>\n                      <div class=\"nl-text\" id=\"agNlText\">\n                        <span class=\"nl-placeholder\"\n                          >Your agent's purpose will appear here as you answer\n                          the questions¦</span\n                        >\n                      </div>\n                    </div>\n                    <div class=\"config-fields\" id=\"agConfigFields\"></div>\n                  </div>\n                </div>\n              </div>\n\n              <!-- VIEW 3: AGENT WORKSPACE -->\n              <div class=\"av-view av-workspace\" id=\"av-workspace\">\n                <!-- LEFT SIDEBAR -->\n                <div class=\"ws-sidebar\">\n                  <div class=\"ws-sidebar-top\">\n                    <div class=\"ws-agent-info\">\n                      <div class=\"wai-icon\">\n                        <i class=\"ti ti-alert-triangle\"></i>\n                      </div>\n                      <div>\n                        <div class=\"wai-name\">Labour Anomaly Sentinel</div>\n                        <div class=\"wai-domain\">Labour Market Â· Daily</div>\n                      </div>\n                    </div>\n                    <div class=\"ws-status-row\">\n                      <div class=\"ws-status-dot\"></div>\n                      <div class=\"ws-status-txt\">Active</div>\n                      <div class=\"ws-status-time\">Next run 06:00 GST</div>\n                    </div>\n                  </div>\n                  <div class=\"ws-sidebar-mid\">\n                    <div class=\"ws-sec-label\">Run History</div>\n                    <div class=\"run-item active\">\n                      <div class=\"run-item-top\">\n                        <div class=\"run-item-title\">Today ” 06:02 GST</div>\n                      </div>\n                      <div class=\"run-item-sub\">1,247,302 rows scanned</div>\n                      <span class=\"run-badge alert\"\n                        ><i class=\"ti ti-alert-triangle\"></i> 3 anomalies</span\n                      >\n                    </div>\n                    <div class=\"run-item\">\n                      <div class=\"run-item-top\">\n                        <div class=\"run-item-title\">Yesterday ” 06:01 GST</div>\n                      </div>\n                      <div class=\"run-item-sub\">1,241,891 rows scanned</div>\n                      <span class=\"run-badge ok\"\n                        ><i class=\"ti ti-check\"></i> All normal</span\n                      >\n                    </div>\n                    <div class=\"run-item\">\n                      <div class=\"run-item-top\">\n                        <div class=\"run-item-title\">May 23 ” 06:00 GST</div>\n                      </div>\n                      <div class=\"run-item-sub\">1,238,445 rows scanned</div>\n                      <span class=\"run-badge alert\"\n                        ><i class=\"ti ti-alert-triangle\"></i> 1 anomaly</span\n                      >\n                    </div>\n                    <div class=\"ws-sec-label\" style=\"margin-top: 8px\">\n                      Your conversations\n                    </div>\n                    <div class=\"run-item\">\n                      <div class=\"run-item-top\">\n                        <div class=\"run-item-title\">\n                          Asked about May 23 spike\n                        </div>\n                      </div>\n                      <div class=\"run-item-sub\">Yesterday at 09:14</div>\n                    </div>\n                    <div class=\"run-item\">\n                      <div class=\"run-item-top\">\n                        <div class=\"run-item-title\">Requested PDF report</div>\n                      </div>\n                      <div class=\"run-item-sub\">May 22 at 14:30</div>\n                    </div>\n                  </div>\n                  <div class=\"ws-sidebar-bottom\">\n                    <button\n                      class=\"ws-settings-btn\"\n                      onclick=\"agToggleSettings()\"\n                    >\n                      <i class=\"ti ti-settings\"></i>\n                      <span>Agent settings</span>\n                      <i\n                        class=\"ti ti-chevron-right\"\n                        style=\"\n                          margin-left: auto;\n                          font-size: 13px;\n                          color: var(--t3);\n                        \"\n                      ></i>\n                    </button>\n                  </div>\n                </div>\n\n                <!-- MAIN CHAT -->\n                <div class=\"ws-main\">\n                  <div class=\"ws-main-header\">\n                    <button\n                      class=\"ag-btn ag-btn-ghost ag-btn-xs\"\n                      onclick=\"agentGoTo('av-library')\"\n                      style=\"margin-right: 4px\"\n                    >\n                      <i class=\"ti ti-arrow-left\"></i>\n                    </button>\n                    <div>\n                      <div class=\"ws-agent-label\">Labour Anomaly Sentinel</div>\n                      <div class=\"ws-agent-desc\">\n                        Ask anything about labour market anomalies, or give it\n                        new instructions\n                      </div>\n                    </div>\n                    <button\n                      class=\"ag-btn ag-btn-primary ag-btn-sm ws-run-btn\"\n                      onclick=\"toast('Running agent now¦', 'ti-player-play')\"\n                    >\n                      <i class=\"ti ti-player-play\"></i> Run now\n                    </button>\n                    <button\n                      class=\"ag-btn ag-btn-ghost ag-btn-sm\"\n                      onclick=\"agToggleSettings()\"\n                    >\n                      <i class=\"ti ti-settings\"></i> Settings\n                    </button>\n                  </div>\n\n                  <div class=\"ws-chat\" id=\"agWsChat\">\n                    <div class=\"finding-card alert fade-up\">\n                      <div class=\"fc-head\">\n                        <div class=\"fc-icon alert\">\n                          <i class=\"ti ti-alert-triangle\"></i>\n                        </div>\n                        <div>\n                          <div class=\"fc-title\">\n                            3 anomalies detected ” Today's run\n                          </div>\n                        </div>\n                        <div class=\"fc-time\">06:02 GST</div>\n                      </div>\n                      <div class=\"fc-body\">\n                        I scanned <strong>1,247,302 records</strong> from the\n                        Labour Registry and found 3 data points exceeding the Ïƒ\n                        > 2.0 threshold. The most significant anomaly is in the\n                        <strong>Construction sector</strong> where daily\n                        registrations dropped 34% from the 90-day baseline.\n                      </div>\n                      <div class=\"fc-metrics\">\n                        <div class=\"fc-metric\">\n                          <div class=\"fc-metric-val\" style=\"color: var(--err)\">\n                            âˆ’34%\n                          </div>\n                          <div class=\"fc-metric-lbl\">\n                            Construction registrations\n                          </div>\n                        </div>\n                        <div class=\"fc-metric\">\n                          <div class=\"fc-metric-val\">Ïƒ 3.2</div>\n                          <div class=\"fc-metric-lbl\">Deviation score</div>\n                        </div>\n                        <div class=\"fc-metric\">\n                          <div class=\"fc-metric-val\">2 others</div>\n                          <div class=\"fc-metric-lbl\">Minor anomalies</div>\n                        </div>\n                      </div>\n                      <div class=\"fc-actions\">\n                        <button\n                          class=\"ag-btn ag-btn-ghost ag-btn-xs\"\n                          onclick=\"\n                            agWsAsk(\n                              'Tell me more about the construction sector drop',\n                            )\n                          \"\n                        >\n                          <i class=\"ti ti-search\"></i> Deep dive\n                        </button>\n                        <button\n                          class=\"ag-btn ag-btn-ghost ag-btn-xs\"\n                          onclick=\"\n                            agWsAsk(\n                              'Generate a PDF report of today\\'s findings',\n                            )\n                          \"\n                        >\n                          <i class=\"ti ti-download\"></i> Export report\n                        </button>\n                        <button\n                          class=\"ag-btn ag-btn-ghost ag-btn-xs\"\n                          onclick=\"\n                            agWsAsk(\n                              'How does this compare to the May 23 anomaly?',\n                            )\n                          \"\n                        >\n                          <i class=\"ti ti-history\"></i> Compare history\n                        </button>\n                      </div>\n                    </div>\n                    <div\n                      class=\"ws-msg agent fade-up\"\n                      style=\"animation-delay: 0.1s\"\n                    >\n                      <img class=\"ws-msg-av agent\" src=\"./assets/ai-chat-thumb.svg\" alt=\"Bayaan AI\" width=\"30\" height=\"30\" />\n                      <div class=\"ws-msg-bubble\">\n                        <p>\n                          I've summarised today's findings above. I'm ready to\n                          dig deeper ” ask me about any anomaly, request a\n                          breakdown by sector or nationality, or ask me to\n                          adjust my detection threshold for future runs.\n                        </p>\n                      </div>\n                    </div>\n                    <div id=\"agWsExtraMessages\"></div>\n                  </div>\n\n                  <div class=\"ws-input-area\">\n                    <div class=\"ws-quick-actions\">\n                      <div\n                        class=\"ws-qa\"\n                        onclick=\"\n                          agWsAsk('Generate a PDF report of today\\'s findings')\n                        \"\n                      >\n                        <i class=\"ti ti-download\"></i> Export PDF\n                      </div>\n                      <div\n                        class=\"ws-qa\"\n                        onclick=\"\n                          agWsAsk('Change the schedule to run every 6 hours')\n                        \"\n                      >\n                        <i class=\"ti ti-clock\"></i> Change schedule\n                      </div>\n                      <div\n                        class=\"ws-qa\"\n                        onclick=\"agWsAsk('Show me last week\\'s anomaly trend')\"\n                      >\n                        <i class=\"ti ti-chart-line\"></i> Weekly trend\n                      </div>\n                      <div\n                        class=\"ws-qa\"\n                        onclick=\"\n                          agWsAsk('Draft a notification email to the team')\n                        \"\n                      >\n                        <i class=\"ti ti-mail\"></i> Draft email\n                      </div>\n                    </div>\n                    <div class=\"bai-input-composer\">\n                      <textarea\n                        class=\"bai-input\"\n                        id=\"agWsInput\"\n                        rows=\"1\"\n                        placeholder=\"Ask the agent anything, or give it an instruction…\"\n                        onkeydown=\"agWsKey(event)\"\n                        oninput=\"autoResize(this)\"\n                      ></textarea>\n                      <div class=\"bai-input-toolbar\">\n                        <div class=\"bai-input-toolbar-left\"></div>\n                        <button\n                          type=\"button\"\n                          class=\"bai-send-btn\"\n                          onclick=\"agWsSend()\"\n                          title=\"Send\"\n                        >\n                          <i class=\"ti ti-send\"></i>\n                        </button>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n\n                <!-- SETTINGS DRAWER -->\n                <div class=\"settings-drawer\" id=\"agSettingsDrawer\">\n                  <div class=\"sd-head\">\n                    <h3>Agent settings</h3>\n                    <button class=\"sd-close\" onclick=\"agToggleSettings()\">\n                      <i class=\"ti ti-x\"></i>\n                    </button>\n                  </div>\n                  <div class=\"sd-body\">\n                    <div class=\"sd-field\">\n                      <div class=\"sd-label\">Agent name</div>\n                      <div class=\"sd-val\">Labour Anomaly Sentinel</div>\n                    </div>\n                    <div class=\"sd-field\">\n                      <div class=\"sd-label\">Purpose</div>\n                      <div class=\"sd-val\">Anomaly Detection</div>\n                      <div class=\"sd-val-sub\">Labour Market Â· ClickHouse</div>\n                    </div>\n                    <div class=\"sd-field\">\n                      <div class=\"sd-label\">Schedule</div>\n                      <div class=\"sd-val\">Daily at 06:00 GST</div>\n                    </div>\n                    <div class=\"sd-field\">\n                      <div class=\"sd-label\">Detection threshold</div>\n                      <div class=\"sd-val\">Ïƒ > 2.0 (standard)</div>\n                    </div>\n                    <div class=\"sd-field\">\n                      <div class=\"sd-label\">Output</div>\n                      <div class=\"sd-val\">Email digest + Dashboard</div>\n                    </div>\n                    <div class=\"sd-divider\"></div>\n                    <div class=\"sd-field\">\n                      <div class=\"sd-label\">Visibility</div>\n                      <div class=\"sd-val\">Private ” only you</div>\n                    </div>\n                    <div class=\"sd-field\">\n                      <div class=\"sd-label\">Created</div>\n                      <div class=\"sd-val\">May 11, 2026</div>\n                      <div class=\"sd-val-sub\">by Unni</div>\n                    </div>\n                    <div class=\"sd-divider\"></div>\n                    <button\n                      class=\"ag-btn ag-btn-ghost ag-btn-sm\"\n                      style=\"\n                        width: 100%;\n                        justify-content: center;\n                        margin-bottom: 8px;\n                      \"\n                      onclick=\"\n                        toast('Publishing for review', 'ti-world');\n                        agToggleSettings();\n                      \"\n                    >\n                      <i class=\"ti ti-world\"></i> Publish to Library\n                    </button>\n                  </div>\n                  <div class=\"sd-footer\">\n                    <button\n                      class=\"ag-btn ag-btn-ghost ag-btn-sm\"\n                      style=\"justify-content: center\"\n                      onclick=\"toast('Opening editor¦', 'ti-edit')\"\n                    >\n                      <i class=\"ti ti-edit\"></i> Edit configuration\n                    </button>\n                    <button\n                      class=\"ag-btn ag-btn-danger ag-btn-sm\"\n                      style=\"justify-content: center\"\n                      onclick=\"\n                        toast('Agent deleted', 'ti-trash');\n                        agToggleSettings();\n                        agentGoTo('av-library');\n                      \"\n                    >\n                      <i class=\"ti ti-trash\"></i> Delete agent\n                    </button>\n                  </div>\n                </div>\n              </div>\n            </div>\n            <!-- /v-agent -->\n";

/* â”€â”€ AGENT STUDIO â”€â”€ */
function agentGoTo(id) {
  document
    .querySelectorAll("#v-agent .av-view")
    .forEach((v) => v.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
  if (id === "av-builder") agStartBuilder();
}
function agentCreateNew() {
  agentGoTo("av-builder");
}
function agLibTab(el, tab) {
  document
    .querySelectorAll("#v-agent .lib-tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("ag-tab-my").style.display =
    tab === "my" ? "" : "none";
  document.getElementById("ag-tab-pub").style.display =
    tab === "pub" ? "" : "none";
}
/* Modal */
let agModalChoice = "priv";
function agOpenModal() {
  document.getElementById("agentSaveModal").classList.add("show");
}
function agCloseModal() {
  document.getElementById("agentSaveModal").classList.remove("show");
}
function agSelectModal(c) {
  agModalChoice = c;
  document
    .getElementById("agMoPriv")
    .classList.toggle("sel", c === "priv");
  document.getElementById("agMoPub").classList.toggle("sel", c === "pub");
}
function agConfirmSave() {
  agCloseModal();
  const msg =
    agModalChoice === "pub"
      ? "Agent submitted for governance review ” will appear in Library once approved"
      : "Agent saved to My Agents";
  toast(msg, "ti-check");
  setTimeout(() => agentGoTo("av-library"), 500);
}
/* Builder conversation engine */
const AG_STEPS = [
  {
    key: "purpose",
    msg: `Hi! I'm going to help you build an agent in a few quick questions. ðŸŽ¯\n\n**What should this agent do for you?**`,
    chips: [
      { i: "ti-alert-triangle", l: "Detect anomalies in data" },
      { i: "ti-chart-line", l: "Monitor trends over time" },
      { i: "ti-file-description", l: "Generate reports automatically" },
      { i: "ti-bell", l: "Send alerts when thresholds are crossed" },
      { i: "ti-chart-area", l: "Forecast future values" },
      { i: "ti-layout-dashboard", l: "Keep a dashboard up to date" },
    ],
    cfIcon: "purple",
    cfIconName: "ti-target",
    cfLabel: "Purpose",
    followUp: (v) =>
      `Got it ” **${v}**. That's a clear use case I can build around.`,
    nlUpdate: (cfg) =>
      `This agent will <span class="nl-hi">${cfg.purpose?.toLowerCase()}</span>¦`,
    isNameStep: false,
  },
  {
    key: "name",
    msg: "__NAME_STEP__",
    chips: [],
    isNameStep: true,
    cfIcon: "gray",
    cfIconName: "ti-tag",
    cfLabel: "Agent name",
    followUp: (v) => `Great name ” **"${v}"** it is.`,
    nlUpdate: (cfg) =>
      `<span class="nl-hi">${cfg.name}</span> will ${cfg.purpose?.toLowerCase()}¦`,
  },
  {
    key: "domain",
    msg: `Which **data domain** should it work with?`,
    chips: [
      { i: "ti-users", l: "Labour Market" },
      { i: "ti-building-bank", l: "Economic & GDP" },
      { i: "ti-shopping-cart", l: "Trade & Imports" },
      { i: "ti-home", l: "CPI & Inflation" },
      { i: "ti-building", l: "Construction" },
    ],
    cfIcon: "blue",
    cfIconName: "ti-database",
    cfLabel: "Data domain",
    followUp: (v) =>
      `**${v}** ” I'll connect to the relevant Bayaan datasets for that domain.`,
    nlUpdate: (cfg) =>
      `<span class="nl-hi">${cfg.name}</span> will ${cfg.purpose?.toLowerCase()} across <span class="nl-hi">${cfg.domain}</span> data¦`,
  },
  {
    key: "trigger",
    msg: `When should the agent **run automatically**?`,
    chips: [
      { i: "ti-calendar", l: "Daily at 06:00 GST" },
      { i: "ti-clock", l: "Every hour" },
      { i: "ti-calendar-week", l: "Weekly on Monday" },
      { i: "ti-refresh", l: "When new data arrives" },
      { i: "ti-player-play", l: "Only when I ask" },
    ],
    cfIcon: "amber",
    cfIconName: "ti-clock",
    cfLabel: "Schedule",
    followUp: (v) =>
      `Scheduled for **${v}**. Every run, it'll process the latest data automatically.`,
    nlUpdate: (cfg) =>
      `<span class="nl-hi">${cfg.name || "Your agent"}</span> will ${cfg.purpose?.toLowerCase()} across <span class="nl-hi">${cfg.domain}</span> data, running <span class="nl-hi">${cfg.trigger?.toLowerCase()}</span>¦`,
  },
  {
    key: "action",
    msg: `When the agent finds something, what should it **do**?`,
    chips: [
      { i: "ti-mail", l: "Send me an email digest" },
      { i: "ti-bell", l: "Push an alert to my dashboard" },
      { i: "ti-file-analytics", l: "Generate a PDF report" },
      { i: "ti-brand-teams", l: "Send a Teams notification" },
      { i: "ti-wand", l: "Let me decide per run" },
    ],
    cfIcon: "teal",
    cfIconName: "ti-send",
    cfLabel: "On finding",
    followUp: (v) => `Perfect ” **${v}** when something is detected.`,
    nlUpdate: (cfg) =>
      `<span class="nl-hi">${cfg.name || "Your agent"}</span> will ${cfg.purpose?.toLowerCase()} across <span class="nl-hi">${cfg.domain}</span> data, running <span class="nl-hi">${cfg.trigger?.toLowerCase()}</span>, and will <span class="nl-hi">${cfg.action?.toLowerCase()}</span>.`,
  },
  {
    key: "visibility",
    msg: `Almost there ” **who should have access** to this agent?`,
    chips: [
      { i: "ti-lock", l: "Just me (private)" },
      { i: "ti-users", l: "My team" },
      { i: "ti-world", l: "Publish to the Agent Library" },
    ],
    cfIcon: "green",
    cfIconName: "ti-eye",
    cfLabel: "Visibility",
    followUp: (v) => `Got it ” **${v}**.`,
    nlUpdate: (cfg) =>
      `<span class="nl-hi">${cfg.name || "Your agent"}</span> will ${cfg.purpose?.toLowerCase()} across <span class="nl-hi">${cfg.domain}</span> data, running <span class="nl-hi">${cfg.trigger?.toLowerCase()}</span>, and will <span class="nl-hi">${cfg.action?.toLowerCase()}</span>. Visible to: <span class="nl-hi">${cfg.visibility?.toLowerCase()}</span>.`,
  },
];
let agBuilderStarted = false;
let agBStep = 0;
let agBConfig = {};
let agBTyping = false;
function agStartBuilder() {
  agBTyping = false;
  agBuilderStarted = true;
  agBStep = 0;
  agBConfig = {};
  document.getElementById("ag-name-input-card")?.remove();
  document.getElementById("ag-typing-ind")?.remove();
  agRemoveChips();
  const builderInput = document.getElementById("agBuilderInput");
  if (builderInput) {
    builderInput.value = "";
    builderInput.style.height = "auto";
  }
  document.getElementById("agBuilderMsgs").innerHTML = "";
  document.getElementById("agConfigFields").innerHTML = "";
  document.getElementById("agNlText").innerHTML =
    '<span class="nl-placeholder">Your agent\'s purpose will appear here as you answer the questions¦</span>';
  document.getElementById("agBsStatus").textContent = "Configuring¦";
  document.getElementById("agBsStatus").className = "bs-status";
  document.getElementById("agBsFinishBtn").style.display = "none";
  agResetPills();
  agShowTyping("agBuilderMsgs", () => {
    agAddMsg("agBuilderMsgs", "ai", AG_STEPS[0].msg, AG_STEPS[0].chips);
    agSetPill(0, "active");
  });
}
function agResetPills() {
  for (let i = 0; i < 7; i++) {
    const p = document.getElementById("agsp" + i);
    p.className = "step-pill";
    p.querySelector(".pill-num-inner").textContent = i + 1;
  }
}
function agSetPill(idx, state) {
  const p = document.getElementById("agsp" + idx);
  if (!p) return;
  if (state === "done") {
    p.className = "step-pill done";
    p.querySelector(".pill-num-inner").textContent = "âœ“";
  } else if (state === "active") {
    p.className = "step-pill active";
  }
}
function agBuilderKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    agBuilderSend();
  }
}
function agBuilderSend() {
  const v = document.getElementById("agBuilderInput").value.trim();
  if (!v || agBTyping) return;
  document.getElementById("agBuilderInput").value = "";
  document.getElementById("agBuilderInput").style.height = "auto";
  agProcessAnswer(v);
}
function agShowNameInput(suggested) {
  const c = document.getElementById("agBuilderMsgs");
  const wrap = document.createElement("div");
  wrap.id = "ag-name-input-card";
  wrap.style.cssText =
    "margin-top:4px;padding:14px;background:var(--gray-50);border:1px solid var(--border);border-radius:14px;max-width:330px;margin-left:40px;";
  wrap.innerHTML = `<div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--t3);margin-bottom:8px;">Agent name</div><div style="display:flex;gap:8px;align-items:center;"><input id="agNameInputField" type="text" value="${agEscHtml(suggested)}" style="flex:1;padding:8px 11px;border:1.5px solid var(--acc-md);border-radius:10px;font-family:var(--font);font-size:14px;font-weight:600;color:var(--t1);background:var(--white);outline:none;" onkeydown="if(event.key==='Enter'){event.preventDefault();agConfirmName();}" onfocus="this.select()"/><button class="ag-btn ag-btn-primary ag-btn-sm" onclick="agConfirmName()" style="flex-shrink:0;"><i class="ti ti-check"></i> Use this</button></div><div style="font-size:11.5px;color:var(--t3);margin-top:7px;">AI suggested name ” edit it freely or type your own.</div>`;
  c.appendChild(wrap);
  c.scrollTop = c.scrollHeight;
  setTimeout(
    () => document.getElementById("agNameInputField")?.focus(),
    60,
  );
}
function agConfirmName() {
  const inp = document.getElementById("agNameInputField");
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) return;
  document.getElementById("ag-name-input-card")?.remove();
  agProcessAnswer(val);
}
function agProcessAnswer(val) {
  agRemoveChips();
  const step = AG_STEPS[agBStep];
  agBConfig[step.key] = val;
  agAddMsg("agBuilderMsgs", "user", "<p>" + agEscHtml(val) + "</p>");
  agSetPill(agBStep, "done");
  agAddConfigField(step, val);
  agUpdateNL(step.nlUpdate(agBConfig));
  agBStep++;
  if (agBStep < AG_STEPS.length) {
    const next = AG_STEPS[agBStep];
    agShowTyping("agBuilderMsgs", () => {
      agAddMsg("agBuilderMsgs", "ai", step.followUp(val));
      setTimeout(
        () =>
          agShowTyping("agBuilderMsgs", () => {
            if (next.isNameStep) {
              const suggested = agMakeName();
              agAddMsg(
                "agBuilderMsgs",
                "ai",
                `Nice. Now let's **give your agent a name**.\n\nBased on what you described, I'd suggest:`,
              );
              agShowNameInput(suggested);
              agSetPill(agBStep, "active");
            } else {
              agAddMsg("agBuilderMsgs", "ai", next.msg, next.chips);
              agSetPill(agBStep, "active");
            }
          }),
        500,
      );
    });
  } else {
    agShowTyping("agBuilderMsgs", () => {
      agAddMsg("agBuilderMsgs", "ai", step.followUp(val));
      setTimeout(
        () => agShowTyping("agBuilderMsgs", () => agFinishBuilder()),
        700,
      );
    });
  }
}
function agFinishBuilder() {
  const name = agBConfig.name || agMakeName();
  agAddMsg(
    "agBuilderMsgs",
    "ai",
    `âœ… **"${name}" is ready!**\n\nReview the summary on the right ” if everything looks good, click **Save Agent** to choose who can access it.`,
  );
  agSetPill(6, "active");
  document.getElementById("agBsStatus").textContent = "Ready to save";
  document.getElementById("agBsStatus").className = "bs-status ready";
  document.getElementById("agBsFinishBtn").style.display = "";
}
function agMakeName() {
  const p = agBConfig.purpose || "";
  const d = agBConfig.domain || "";
  const dS = d.split(" ")[0];
  if (p.includes("anomal") || p.includes("Detect"))
    return `${dS} Anomaly Sentinel`;
  if (p.includes("trend") || p.includes("Monitor"))
    return `${dS} Trend Monitor`;
  if (p.includes("report") || p.includes("Generate"))
    return `${dS} Report Agent`;
  if (p.includes("alert") || p.includes("Alert"))
    return `${dS} Alert Agent`;
  if (p.includes("orecast")) return `${dS} Forecast Agent`;
  return `${dS} Intelligence Agent`;
}
function agAddConfigField(step, val) {
  const wrap = document.getElementById("agConfigFields");
  const row = document.createElement("div");
  row.className = "cf-row";
  row.innerHTML = `<div class="cf-icon ${step.cfIcon}"><i class="ti ${step.cfIconName}"></i></div><div class="cf-content"><div class="cf-label">${step.cfLabel}</div><div class="cf-value">${agEscHtml(val)}</div></div>`;
  wrap.appendChild(row);
  setTimeout(() => row.classList.add("in"), 50);
}
function agUpdateNL(html) {
  document.getElementById("agNlText").innerHTML = html;
}
/* Builder chat helpers */
function agAddMsg(containerId, role, text, chips) {
  const c = document.getElementById(containerId);
  const wrap = document.createElement("div");
  wrap.className = "b-msg " + role;
  const body = document.createElement("div");
  body.className = "b-msg-body";
  const bubble = document.createElement("div");
  bubble.className = "b-msg-bubble";
  bubble.innerHTML = agMdHtml(text);
  body.appendChild(bubble);
  if (role === "ai") {
    wrap.appendChild(baiAvatarEl("b-msg-av ai", 30));
    wrap.appendChild(body);
  } else {
    wrap.appendChild(body);
  }
  c.appendChild(wrap);
  if (chips && chips.length) {
    const chipsWrap = document.createElement("div");
    chipsWrap.className = "b-msg";
    chipsWrap.id = "ag-chips-anchor";
    const sp = document.createElement("div");
    sp.style.width = "40px";
    const row = document.createElement("div");
    row.className = "b-chips-row";
    chips.forEach((ch) => {
      const btn = document.createElement("button");
      btn.className = "b-chip";
      btn.innerHTML = `<i class="ti ${ch.i}"></i>${ch.l}`;
      btn.onclick = () => {
        document
          .querySelectorAll("#v-agent .b-chip")
          .forEach((x) => x.classList.remove("sel"));
        btn.classList.add("sel");
        setTimeout(() => agProcessAnswer(ch.l), 260);
      };
      row.appendChild(btn);
    });
    chipsWrap.appendChild(sp);
    chipsWrap.appendChild(row);
    c.appendChild(chipsWrap);
  }
  c.scrollTop = c.scrollHeight;
}
function agRemoveChips() {
  const el = document.getElementById("ag-chips-anchor");
  if (el) el.remove();
}
function agShowTyping(containerId, cb) {
  agBTyping = true;
  const c = document.getElementById(containerId);
  const el = document.createElement("div");
  el.id = "ag-typing-ind";
  el.className = "b-msg ai";
  el.innerHTML = `${baiAvatarHtml("b-msg-av ai", 30)}<div class="b-typing"><div class="btd"></div><div class="btd"></div><div class="btd"></div></div>`;
  c.appendChild(el);
  c.scrollTop = c.scrollHeight;
  setTimeout(
    () => {
      el.remove();
      agBTyping = false;
      cb();
    },
    800 + Math.random() * 400,
  );
}
function agMdHtml(t) {
  return t
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/^(.)/, "<p>$1")
    .replace(/(.)$/, "$1</p>");
}
function agEscHtml(s) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
/* Workspace */
function agWsKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    agWsSend();
  }
}
function agWsAsk(q) {
  document.getElementById("agWsInput").value = q;
  agWsSend();
}
function agWsSend() {
  const inp = document.getElementById("agWsInput");
  const v = inp.value.trim();
  if (!v) return;
  inp.value = "";
  inp.style.height = "auto";
  const container = document.getElementById("agWsExtraMessages");
  const userMsg = document.createElement("div");
  userMsg.className = "ws-msg user";
  userMsg.innerHTML = `<div class="ws-msg-bubble">${agEscHtml(v)}</div>`;
  container.appendChild(userMsg);
  agScrollWs();
  const typingEl = document.createElement("div");
  typingEl.className = "ws-msg agent";
  typingEl.innerHTML = `${baiAvatarHtml("ws-msg-av agent", 30)}<div class="b-typing"><div class="btd"></div><div class="btd"></div><div class="btd"></div></div>`;
  container.appendChild(typingEl);
  agScrollWs();
  setTimeout(
    () => {
      typingEl.remove();
      const resp = agGetReply(v);
      const agentMsg = document.createElement("div");
      agentMsg.className = "ws-msg agent";
      agentMsg.innerHTML = `${baiAvatarHtml("ws-msg-av agent", 30)}<div class="ws-msg-bubble">${resp}</div>`;
      container.appendChild(agentMsg);
      agScrollWs();
    },
    1000 + Math.random() * 600,
  );
}
function agGetReply(q) {
  const ql = q.toLowerCase();
  if (ql.includes("pdf") || ql.includes("report"))
    return `<p>Generating the PDF report for today's run now. It will include:</p><ul><li>Executive summary of all 3 anomalies</li><li>Sector-by-sector breakdown with trend charts</li><li>Comparison against the past 90-day baseline</li></ul><p>The report will be ready in a few seconds and emailed to you.</p>`;
  if (ql.includes("schedule") || ql.includes("6 hour"))
    return `<p>I've updated the schedule from <strong>daily at 06:00 GST</strong> to <strong>every 6 hours</strong>. This change takes effect from the next scheduled run.</p>`;
  if (ql.includes("trend") || ql.includes("week"))
    return `<p>Last week's anomaly summary:</p><ul><li><strong>Mon“Wed:</strong> All clear</li><li><strong>Thu May 22:</strong> Minor anomaly in Hospitality (Ïƒ 2.1), self-corrected</li><li><strong>Fri May 23:</strong> Construction spike (Ïƒ 2.4) ” similar pattern to today</li></ul><p>There's a recurring Friday-Monday pattern in Construction data worth investigating.</p>`;
  if (
    ql.includes("email") ||
    ql.includes("notification") ||
    ql.includes("draft")
  )
    return `<p>Draft notification:</p><p style="background:var(--gray-50);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:12.5px;margin-top:8px;"><strong>Subject:</strong> Labour Registry ” Anomaly Alert, May 25<br><br>Team,<br><br>The Labour Anomaly Sentinel detected 3 anomalies in today's 06:00 GST run. Most significant: Construction sector registrations fell 34% below the 90-day baseline (Ïƒ 3.2).<br><br>” Bayaan Sentinel</p>`;
  if (ql.includes("construction") || ql.includes("deep dive"))
    return `<p>Deeper look at the Construction sector anomaly:</p><ul><li><strong>Today's value:</strong> 847 registrations (baseline avg: 1,282)</li><li><strong>Deviation:</strong> Ïƒ 3.2 ” highest since March 2024</li><li><strong>Sub-sector breakdown:</strong> Civil works (âˆ’41%), Building works (âˆ’28%), Specialist trades (âˆ’12%)</li></ul>`;
  return `<p>I've analysed that across the Labour Registry data. The patterns appear consistent with the anomalies I flagged. Let me know if you'd like a deeper breakdown or a specific report format.</p>`;
}
function agScrollWs() {
  const c = document.getElementById("agWsChat");
  c.scrollTop = c.scrollHeight;
}
function agToggleSettings() {
  document.getElementById("agSettingsDrawer").classList.toggle("open");
}
