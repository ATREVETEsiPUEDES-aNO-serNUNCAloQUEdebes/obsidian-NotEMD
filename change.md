# Notemd Change Log

This document summarizes the major functional and architectural changes implemented.

---

## 1.9.2

### Highlights

- Sidebar footer scrolling and API observability styling are restored, so request activity no longer crowds out log output in the shipped sidebar layout.
- Local knowledge inspect now exposes bounded query diagnostics, including low-signal navigation-note cautions for `index.*` and related basename-derived queries.
- Maintainer CLI docs and examples now use the correct vault-relative path contract, and Chapter Split + TOC now has dedicated showcase documentation.

### New Features

- Added dedicated Chapter Split + TOC spotlight docs, docs-home entry points, and showcase artwork so the feature is now part of the repository’s visible shipped surface instead of only maintainer-facing references.
- Extended `local-knowledge.inspect` explainability with `queryDiagnostics`, including the derived basename, bounded stripped-source length used for diagram-source derivation, and cautions for generic navigation-like source names.
- Expanded maintainer CLI help and capability-matrix guidance so `--vault docs` examples consistently demonstrate vault-relative `sourcePath` and `knowledgePaths` inputs.
- Added maintainer inspect examples for broader docs-vault local knowledge checks, covering explicit research queries, cross-folder batch-title source paths, and diagram-source retrieval with bounded `topK` / `slidingWindowSize` overrides.

### Fixes

- Fixed the sidebar footer container so the log/API region can scroll vertically again instead of getting pinned behind oversized activity content.
- Fixed the maintainer docs-vault examples that previously used repo-relative `docs/...` paths, which could mislead local knowledge inspection and chapter-split invocations in a real `--vault docs` run.
- Fixed Stage-C documentation drift by keeping local knowledge fixture coverage, maintainer helper output, and bilingual CLI capability docs aligned around the same vault-relative example payloads.
- Fixed chronicle refresh helper authorship so release-driven chronicle updates preserve maintainer identity instead of falling back to a bot identity.

### Verification

- Revalidated with serial `npm run chronicle:sync-repo-saga` / `npm run chronicle:update -- --tag 1.9.2`, `npm run build`, `npm test -- --runInBand`, `npm run audit:i18n-ui`, `npm run audit:render-host`, `obsidian help`, `obsidian-cli help`, and `git diff --check` before cutting the release.

## 1.9.1

### Highlights

- Provider settings now converge on a cleaner required-fields-first surface while preserving saved advanced overrides and discovery metadata behavior.
- Fetch-model-list now covers a broader bounded set of provider catalog shapes and keeps discovered output-token ceilings scoped to provider overrides instead of global `Max tokens`.
- Release-facing truth is synchronized for the full `1.9.0..1.9.1` delta, including bilingual release notes, welcome digest, version markers, and chronicle references.

### New Features

- Expanded bounded provider model discovery across more OpenAI-compatible endpoint families, additional registry envelopes, continuation tokens, and hosted-provider-specific catalog shapes.
- Added clearer provider settings guidance so model-aware token notices distinguish provider output-token overrides from the global runtime `Max tokens` budget.
- Preserved provider-scoped `maxOutputTokens` autofill as the discovery lane while keeping manual typed-model edits responsible for global model-aware token guidance.
- Extended Stage-C local knowledge-base routing and inspect/evaluation semantics so task-scoped retrieval sources and failure-state visibility stay explicit.
- Deepened the diagram semantic-verification lane and kept packaging/runtime boundary checks fail-closed on current `main`.

### Fixes

- Fixed discovered-model apply so it no longer silently rewrites the global `Max tokens` field when the real change belongs to the active provider override.
- Fixed unresolved discovered-model ceilings so an existing valid provider override is preserved instead of being cleared or degraded.
- Fixed release-modal recent update content so the latest two entries now match the shipped version boundary and localized text bundle.
- Fixed advanced provider-panel persistence so saved advanced overrides still surface after reopening settings.
- Realigned progress/planning docs with the actual shipped provider-settings architecture rather than the older global token-sync wording.

### Verification

- Revalidated with `npm run build`, `npm test -- --runInBand`, `npm run audit:i18n-ui`, `npm run audit:render-host`, `obsidian help`, `obsidian-cli help`, local Obsidian hot reload/runtime inspection, and `git diff --check` before cutting the release.

## 1.9.0

### Highlights

- Provider settings now converge on a metadata-driven core/advanced split, and supported providers can fetch transient model suggestions without creating a second persisted provider catalog.
- Developer-gated advanced batch folder selection now supports saved profiles, one-run overrides, preset chips, and inline file preview before execution.
- Developer-gated relaxed input file restrictions now land as a shared runtime contract for selected source-preserving tasks, including PDF text extraction through Obsidian's PDF runtime.
- Release-facing version truth, welcome digest, release notes, and chronicle refresh are synchronized at the `1.9.0` boundary.

### New Features

- Added provider-field taxonomy metadata (`core`, `contextual`, `advanced`, `developer`) so the provider settings panel can render required/default-visible controls separately from secondary tuning controls.
- Added lightweight in-settings model discovery for a broader bounded set of official providers: selected OpenAI-compatible `/models` presets (including LM Studio plus Qwen/Doubao/Moonshot/GLM/SiliconFlow/Groq/Fireworks/Nebius/Cerebras/OpenRouter/Requesty families), Together's dedicated `/models` response shape, Anthropic `GET /models`, Ollama tags, and Google Gemini model listing. Discovery results are transient suggestions only; persisted provider state still uses the existing manual `model` string.
- Extended the generic `OpenAI Compatible` preset so known official hosts can also reuse upstream provider token-cap metadata for bare model IDs. That keeps `Fetch model list`, provider output-token autofill, and model-aware guidance aligned even when users choose plain IDs such as `gpt-4o`, `qwen3-coder-plus`, or `mimo-v2.5-pro` instead of provider-prefixed gateway IDs.
- Expanded the bounded OpenAI-compatible preset set with `LiteLLM`, `Nebius`, `Cerebras`, `Hugging Face`, and `Vercel AI Gateway`, while keeping discovery support honest per endpoint family rather than over-claiming generic `/models` parity. Hugging Face now participates in the shared bounded `/models` discovery path, while Azure OpenAI remains manual-first because deployment names are required.
- Upgraded `Vercel AI Gateway` model discovery from a single-source registry lookup to a bounded dual-source merge of the official `/v1/models` catalog plus `v3/ai/config`, so fetch-model-list stays usable even when one gateway catalog surface is temporarily incomplete or unavailable.
- Extended fetch-model-list coverage with `OpenRouter`'s bounded chat + embedding catalog merge, `LiteLLM`'s bounded `/models` + `/model/info` merge, Huawei Cloud MaaS's dedicated `v2/models` registry endpoint, bounded paginated traversal for Anthropic and Google model catalogs, and broader OpenAI-compatible schema parsing for `models[]`, `list`/`items`, object-shaped catalogs, `model_id`, and endpoint-type-style responses.
- Extended the transient model-discovery parser again so fetched rows can preserve display labels plus max-output-token hints when providers expose them, and so broader registries can be filtered using capability/modality/status metadata instead of only brittle model-name heuristics. This reduces audio/image/unavailable entries leaking into text-generation model suggestions while preserving manual model entry as the fallback path.
- Expanded that bounded parser once more so `fetch model list` can also consume hosted `types` classifiers, nested `data`/`result` catalogs, and LiteLLM-style `litellm_params` + `model_info` payloads, which keeps real-world gateway registries and proxy metadata aligned with the in-settings model picker and token guidance.
- Expanded `fetch model list` again through the shared discovery core instead of more provider-specific branches: bounded OpenAI-compatible registry traversal now also follows continuation signals such as `next_url`, `links.next`, `nextPageToken`, and `next_cursor`, preserves already-fetched valid pages when a later page fails, and accepts wider payload keys such as `rows`/`records`, `value`/`values`, `uid`, `identifier`, `modelId`, and `provider_model_id`.
- Expanded that shared discovery core once more so `fetch model list` also tolerates `publisherModels`-style registries and resource-shaped model names such as `models/<id>` or `publishers/<owner>/models/<id>`, normalizing them back to usable model IDs without breaking existing path-style provider IDs such as Fireworks model names.
- Extended that same shared discovery path again so wrapped registries such as `data.provider_models`, `result.data.providerModels`, and `result.data.publisherModels` are treated like first-class inputs instead of being silently missed when providers add one more response envelope around the catalog.
- Extended the shared discovery collector once more so wrapped `registry`, `registries`, and `services` catalogs now enter the same bounded parser path instead of being ignored unless they happened to sit under a narrower already-supported key.
- Model-aware global token guidance now persists an explicit auto-managed tracking marker (`globalModelAwareMaxTokensTracking`) instead of relying only on value-equality heuristics. That keeps manual model changes, chunk-size auto-fill, partial/complete reset, and runtime max-token ceiling behavior aligned across settings reloads and later sessions, while discovered-model apply now follows its own provider-scoped override lane.
- Expanded generic `OpenAI Compatible` fetch-model-list behavior so known hosts such as OpenRouter, Requesty, Together, Huawei Cloud MaaS, Vercel AI Gateway, and local LiteLLM-style proxies now auto-resolve into the matching bounded discovery family instead of always falling back to a plain generic `/models` request.
- Extended that generic bounded-host upgrade so OVMS-style local `/v3` endpoints are recognized separately from LiteLLM-style local proxies, preserving OVMS's `/v3/models` plus legacy `/v1/config` fallback path even when users stay on the generic `OpenAI Compatible` preset.
- Unified OpenAI-compatible endpoint normalization across runtime and fetch-model-list so users can paste `/responses`, `/chat/completions`, or `/models` endpoint forms directly without breaking model discovery or request routing.
- Expanded fetch-model-list again with xAI's dedicated `/v1/language-models` registry plus bounded fallback to `/v1/models`, so Grok-facing setups get a narrower language-model list without introducing a second persisted catalog subsystem.
- Tightened the shared parser so alias-only model entries can still recover a usable identifier when upstream payloads omit the primary id field, while avoiding the bad tradeoff of expanding every alias into separate picker rows.
- Hardened shared endpoint normalization one more time so pasted OpenAI-compatible model endpoints remain usable even when users include query strings or hash fragments after `/models`, `/responses`, or `/chat/completions`.
- Added bounded `AIHubMix` model discovery through its hosted `/api/v1/models` registry, and wired generic `OpenAI Compatible` endpoints targeting `aihubmix.com` into that same family-aware discovery path.
- Added a first-class `GitHub Models` preset plus bounded discovery through its hosted `catalog/models` + `/v1/models` merge, and wired generic `OpenAI Compatible` endpoints targeting `models.github.ai` into that same family-aware discovery path.
- Added a first-class `PPIO` preset plus bounded discovery through its chat + embedding + reranker registry merge, and wired generic `OpenAI Compatible` endpoints targeting `api.ppinfra.com` into that same family-aware discovery path.
- Added a first-class `New API` preset that reuses the shared bounded OpenAI-compatible `/models` flow instead of requiring a separate heavy catalog subsystem.
- Added a first-class `OVMS` preset that prefers the current local `/v3/models` endpoint and only falls back to legacy `/v1/config` when needed, preserving bounded local discovery without broad localhost auto-detection claims.
- Added the `Relax input file restrictions` developer setting plus the shared supported-input reader layer.
- Extended advanced folder-task selection with profile-aware folder locking, temporary overrides, preview panels, and example/preset chips.

### Fixes

- Provider advanced settings now auto-expand when a provider already has saved advanced overrides, preserving visibility for existing `data.json` behavior instead of silently collapsing non-default live config.
- Added discovery prerequisite validation and endpoint normalization so `/chat/completions`, `/models`, and `/tags` style base URLs do not cause malformed model-list requests.
- Added canonical provider-name normalization for legacy persisted/imported aliases such as `Xiaomi` -> `Xiaomi MiMo`, preventing duplicate provider rows across settings load and profile import.
- Added model-aware token guidance in provider settings so the current model's known output-token cap is surfaced beside `Model`, provider override, and global `Max tokens`, with immediate re-render after edits.
- Added model-aware auto-sync for global token defaults: when `Max tokens` and `Chunk word count` are still following the default/auto-managed baseline, changing the typed selected model now updates them to the model's known ceiling and the matching recommended chunk size. Once the user manually diverges, later typed model changes no longer overwrite those values.
- Extended model-aware token guidance so explicit gateway/provider-prefixed model IDs from presets such as `AIHubMix`, `GitHub Models`, and other bounded gateway families can still drive `Max tokens` / chunk-size guidance when the upstream model owner is clear, while keeping generic bare-model guessing intentionally conservative for custom `OpenAI Compatible` endpoints.
- Unified task-aware input validation across sidebar actions, command entrypoints, batch adapters, and path-based diagram generation.
- Corrected relaxed-mode batch empty-folder notices so they describe supported inputs rather than hard-coded `.md` / `.txt` assumptions.
- Kept source-mutating and verbatim-sensitive flows intentionally restricted while widening only the safe allowlist.

### Verification

- Revalidated locally with serial repo-saga refresh, build, full Jest, i18n audit, render-host audit, repo-local Obsidian build/test shims, CLI help checks, and whitespace verification before release.

## 2026-05-25

### Bounded Product-Surface Recovery On Current Main

- Recovered bounded backup-branch product slices onto the rewritten current `main` without reviving the disproven dedicated-runtime topology.
- Current main now again includes settings reset, concept-note prerequisite guidance, concept synonym suppression, saved file-selection profiles for folder tasks, local knowledge retrieval, chapter split, and saved-artifact-aware diagram preview follow-through.
- Kept the recovery architecture-compatible with the current single-entry `main.js` + inline `srcdoc` runtime truth rather than replaying older detached runtime assumptions.
- Re-synchronized the shipped `1.8.9` truth across package metadata, the welcome-modal release digest, and the README family without reintroducing stale `render-host.mjs` packaging claims.

### Documentation And Archive Recovery

- Restored backup-branch release/doc artifacts for `1.8.6` through `1.8.9` under `docs/releases/` and re-aligned the current package-facing version surfaces to the actual latest recovered release boundary.
- Re-aligned README and progress documents so they no longer describe recovered current-main features as “missing on current main.”

### Verification Status

- Recovery acceptance was re-validated with build, Jest, UI-string audit, render-host audit, and whitespace checks before the final commit batch.

## 2026-05-24

### Bounded CLI/Public-Surface Restoration On Current Main

- Restored a bounded backup-branch slice that is truthful on the rewritten current `main`, instead of reviving the wider maintainer bridge that depends on unrecovered product features.
- Added `provider.profile.export-redacted`, `cli.public-surface.export`, and a derived `src/operations/publicCliSurface.ts` so the public-safe export surface now comes from the same registry/capability/contract stack as the rest of the automation metadata.
- Added handling tags for secret-bearing provider profile import/export paths and excluded raw provider export from the public-safe surface.
- Added a repo-local maintainer helper surface: `npm run cli:help` and `npm run cli:invoke -- --vault <vault> --operation <operation-id> [--pretty]`, intentionally limited to export-only operations with no input payload.
- Added localized UI strings, notices, tests, and maintainer documentation updates for the redacted export / public-surface slice.

### Repo-Saga Serial Execution Guardrail

- Added a repo-saga execution lock helper so `chronicle:update` and `chronicle:sync-repo-saga` fail fast instead of racing on shared clone/cache state.
- Documented the serial-execution rule in maintainer workflow docs and covered lock-release behavior in Jest.

## 1.8.4

### Highlights

- Diagram intent controls added across settings and sidebar/workbench flows
- Batch progress persistence and per-setting sync locality controls added
- Mermaid/preview/export reliability significantly hardened
- Release workflow and multilingual docs aligned with the real codebase delta
- Version metadata synchronized for the 1.8.4 release

### New Features

- **Diagram Intent Control**: Added preferred diagram intent selectors in settings and the Notemd Workbench/sidebar path.
- **Batch Progress Store**: Long-running batch flows now persist progress for better interrupt/resume behavior.
- **Sync Locality Control**: Added per-setting sync toggles so secret-like provider values can remain local.
- **LLM Response Cache**: Added in-memory caching for repeated identical LLM calls in the same session.
- **Batch Extract Specific Original Text**: Added a folder-scoped batch action for the configured original-text extraction workflow so the same question set can run across all eligible files in a selected folder.
- **Xiaomi MiMo Preset**: Added a first-class `Xiaomi MiMo` OpenAI-compatible preset with MiMo defaults and shared-runtime coverage.
- **Welcome Modal Release Digest**: The first-install welcome modal now embeds the latest two release summaries in a scrollable panel so new users can see what changed without leaving the plugin.

### Fixes

- **Diagram Enforcement**: Explicit diagram intent now blocks HTML fallback, retries with the requested type, and backfills missing node labels from ids.
- **Mermaid Stability**: Sanitized trailing whitespace, added parse-error retry, and aligned boundary handling with Obsidian Mermaid 11.4.1 expectations.
- **Artifact Saving**: Mermaid retry failures now still save best-effort output; Vega-Lite exports now save readable `.md` artifacts instead of raw `.json`.
- **Release Workflow Hardening**: `.github/workflows/release.yml` now pins supported `actions/checkout` and `actions/setup-node` majors.
- **README Contract Coverage**: Added dedicated tests to keep localized README version/sponsor/badge alignment from drifting again.
- **Concept-Note Path Guardrails**: Add-links / concept-extraction flows now warn when concept-note path prerequisites are not configured and can deep-link users into the correct settings section.
- **OpenAI-Compatible Endpoint Normalization**: Base URLs that already include `/chat/completions` or `/models` are now normalized before request assembly.
- **Settings Input Focus Stability**: Remaining conditional settings inputs now commit on blur/Enter instead of redrawing mid-typing, fixing the one-digit blur regression.
- **Safer Defaults And Processing Guidance**: `Customize Concept Note Path` and `Enable Mermaid Error Detection` now default to enabled; `Max Tokens` is ordered before `Chunk Word Count`, and the chunk field now documents and auto-fills the recommended one-third ratio when users have not customized it.

### Chores

- Added `docs/releases/1.8.4.md` and `docs/releases/1.8.4.zh-CN.md`.
- Refreshed architecture, progress, Drawnix feasibility, and maintainer release-workflow docs.
- Added `docs/brainstorms/2026-05-03-mainline-stabilization-and-ci-hardening-requirements*.md`.
- Added `.trellis/` to `.gitignore` and concise local-workflow-state protection rules to `AGENTS.md`.
- Kept the existing `1.8.3` historical entry below for traceability.

---

## 1.8.5

### Highlights

- Diagram command, sidebar action, workflow-builder, and workbench-visible copy now converge on canonical `Generate diagram` / `Preview diagram` wording while preserving legacy compatibility IDs.
- The `1.8.5` release truth is now synchronized across packaged assets, welcome-modal release digest, README metadata, and bilingual release notes.
- The next CLI implementation wave now includes the first checked-in packaging / semantic-verification convergence slice instead of leaving that phase only in brainstorm notes and task scaffolding.

### New Features

- **Canonical Diagram Labels**: Sidebar buttons, workflow-builder action help, command labels, localized tooltips, and workbench-visible notices now consistently present the canonical diagram action names.
- **Release Digest Refresh**: The first-install welcome modal now advertises `1.8.5` and `1.8.4` as the latest two updates, keeping the in-plugin onboarding summary aligned with the actual shipped release.
- **Maintainer Semantic Verification Helper**: The repo now ships `npm run verify:diagram-semantics`, which generates secret-free checklist templates with repo gates, vault-aware CLI checks, packaging-boundary reminders, and per-surface evidence sections.
- **Next-Phase Task Seeded**: Added a dedicated Trellis task shell for packaging / semantic-verification convergence so the next implementation batch can land with persisted context instead of ad-hoc chat memory.

### Fixes

- **Legacy Experimental Copy Cleanup**: Removed the remaining user-visible `experimental diagram` wording from diagram action labels, workbench logs, and completion/error notices where the runtime is already canonical internally.
- **Release Truth Alignment**: Version markers in `package.json`, `manifest.json`, `versions.json`, `README.md`, `README_zh.md`, and release-note references are now synchronized for `1.8.5`.
- **Welcome Modal Freshness**: The built-in recent-release digest no longer lags one patch behind the shipped plugin version.
- **Packaging-Boundary Truth Lock**: Maintainer docs and generated verification templates now explicitly state that `audit:render-host` proves the current single-entry `main.js` + inline `srcdoc` contract, not finished heavy-runtime isolation.

### Chores

- Added `docs/releases/1.8.5.md` and `docs/releases/1.8.5.zh-CN.md`.
- Kept the packaging / semantic-verification convergence direction anchored in current maintainer docs, generated helper output, and active Trellis task scaffolding.

---

## 1.8.3

### Highlights

- First-install Welcome Modal with i18n across all 22 locales
- Sponsor support: Give a Star on GitHub + Buy Me a Coffee (ko-fi)
- Cline-aligned output token resolution for unknown models
- Diagram edge field normalization for LLM JSON output compatibility
- Hard constraints documented for MermaidProcessor decomposition and legacy prompt retirement
- notebook-navigator cross-reference analysis with 5 improvement angles identified

### New Features

- **Welcome Modal**: Shown on first install with plugin capabilities overview, LLM setup hint, closing poetic message, and sponsor buttons. Fully i18n-backed (22 locales).
- **Sponsor Support**: Settings tab sponsor section with GitHub Star + ko-fi Coffee buttons. manifest.json fundingUrl for native Obsidian community browser display.

### Fixes

- **Cline-aligned token resolution**: Unknown models with default maxTokens now defer to the API provider instead of being capped at 8192.
- **Diagram edge normalization**: LLM outputs using `source`/`target` edge fields are now normalized to `from`/`to`, fixing validation failures with real API responses.

### Chores

- Hard constraints codified for MermaidProcessor decomposition: each sub-task requires real Obsidian verification with saved image validation.
- Legacy prompt retirement gated: original scenario usability must be fully preserved.
- notebook-navigator design reference analysis added to audit docs and roadmap.
- ko-fi link: https://ko-fi.com/jacobinwwey

---

## 1.8.3

### Lo mas destacado

- Ventana emergente de bienvenida para la primera instalacion, que cubre todos 22 idiomas
- Apoyo de patrocinio: Dar GitHub Agrega estrellas + Una taza de cafe por favor（ko-fi）
- Cline Procesamiento de tokens de salida de modelo desconocido alineado
- Los campos del borde del grafico estan estandarizados y son compatibles. LLM JSON Salida
- MermaidProcessor Se han documentado fuertes restricciones a la descomposicion y al pronto retiro del legado.
- notebook-navigator Analisis de referencias cruzadas, identificacion. 5 Direcciones de mejora

### Nuevas funciones

- **Ventana emergente de bienvenida**：Se muestra durante la primera instalacion, incluida una descripcion general de las capacidades del complemento.、LLM Configure indicaciones, versos finales y botones de patrocinio.。22 Idiomas completos i18n。
- **Apoyo de patrocinio**：Configurar la seccion de patrocinio de la pagina, incluyendo GitHub Agrega estrellas + ko-fi Boton de cafe。manifest.json fundingUrl Apoyo Obsidian Visualizacion nativa del navegador del complemento comunitario。

### Reparacion

- **Cline Analisis de tokens de alineacion**：Los modelos desconocidos usan el valor predeterminado maxTokens El tiempo ahora se compone de API A exclusivo criterio del Proveedor, que ya no se limita a 8192。
- **Normalizacion de los bordes del grafico**：LLM Uso de salida `source`/`target` Los campos de borde ahora estan normalizados a `from`/`to`，Reparar la verdad API La validacion de la respuesta fallo.。

### Varios

- MermaidProcessor Descomponer restricciones estrictas: cada subtarea debe ser verdadera Obsidian Verificacion y verificacion de preservacion de imagenes.。
- Umbral de retirada para versiones antiguas: la usabilidad de la escena original debe conservarse por completo。
- notebook-navigator Analisis de referencia de diseno agregado a la documentacion de auditoria y a la hoja de ruta.。
- ko-fi Enlaces：https://ko-fi.com/jacobinwwey

## [Unreleased]

### English
*   **Mainline Force-Rewrite Audit**: Added a fresh current-main audit plus a new unified follow-through matrix that explicitly separates rewritten `origin/main` shipped truth from backup-branch-only evidence, so progress docs no longer overclaim features missing from the live mainline.
*   **Clean-State Guardrails For Local Verification**: `.gitignore` now excludes root-level `render-host.mjs` plus local vault-generated artifacts under `docs/` such as error logs, provider diagnostics, preview exports, and saved diagram artifacts, preventing local Obsidian verification from dirtying the repository.
*   **Repo-Saga Serial Execution Guardrail**: `npm run chronicle:sync-repo-saga` and `npm run chronicle:update` now take a shared execution lock under `.cache/.repo-saga-execution.lock`, so overlapping local or CI chronicle refreshes fail fast instead of racing on the same repo-saga cache tree.
*   **Model-Aware Output Token Caps**: Added Cline-aligned known-model max-output-token metadata and now resolve the effective output cap from the actual selected model instead of hardcoded provider defaults. When the global max-token setting is still at the stock default, supported models automatically use their true known ceiling; when users set a custom global or provider-specific cap, requests are clamped to the model’s known maximum. This now applies across OpenAI-compatible providers plus Anthropic, Google, Azure OpenAI, and Ollama runtimes.
*   **Developer-Mode Diagnostics Panel**: Added a dedicated Settings developer panel gated by a new Developer mode switch, so normal users do not see developer-only controls.
*   **Selectable Diagnostic Call Modes + Stability Runs**: Developer diagnostics can now run with selectable call modes (including OpenAI-compatible forced transport modes) and can execute repeated stability runs with aggregated reporting.
*   **OpenAI-Compatible Non-Stream Stage In Stable Mode**: After a primary direct streaming failure, stable-mode OpenAI-compatible calls now attempt direct non-stream transport before falling back to `requestUrl`. This captures providers that return valid buffered responses but are unstable on streaming sockets.
*   **Protocol-Aware Streaming Fallback Across All LLM Paths**: Extended long-request fallback parsing beyond OpenAI-compatible providers so Anthropic Messages, Google Gemini, Azure OpenAI, and Ollama now also use protocol-aware streamed fallback handling on desktop `http/https` and non-desktop `fetch`. Legacy exported OpenAI-style provider wrappers now delegate to the same shared streamed fallback path instead of keeping buffered-only logic.
*   **Cross-Transport Partial Stream Debugging**: Shared debug output now preserves parsed partial stream text for Anthropic, Google/Azure-style SSE flows, and Ollama NDJSON fallbacks, not just OpenAI-compatible calls.
*   **Stable-Mode Primary Transport Preference (OpenAI-Compatible)**: In stable mode, OpenAI-compatible runtime calls now prefer direct desktop/web streaming transport as the primary long-request path before trying `requestUrl`. This reduces false-fail chains where `requestUrl` disconnects even though upstream providers eventually return successful non-stream responses.
*   **Regression Coverage**: Added focused runtime tests for Anthropic, Google, Azure OpenAI, Ollama, and the remaining direct OpenAI-style provider wrappers on streamed fallback success and interruption scenarios.
*   **Real Endpoint Diagnostic CLI**: Added `scripts/diagnose-llm-provider.js` (and `npm run diagnose:llm`) to run reproducible buffered/streaming long-request diagnostics against real provider endpoints with sanitized per-attempt timing, headers, partial bodies, and parsed stream fragments.
*   **Settings Developer Diagnostic Button**: Added `Developer provider diagnostic (long request)` in settings to run an in-plugin runtime probe for the active provider and persist a full report (`Notemd_Provider_Diagnostic_*.txt`) in vault root.
*   **Diagnostic Runtime Helper + Tests**: Added `src/providerDiagnostics.ts` and trigger-chain coverage in `src/tests/providerDiagnostics.test.ts` to lock report generation behavior for both success and provider-failure debug paths.
*   **Docs and Agent Guide Alignment**: Updated both READMEs and `AGENTS.md` so in-plugin diagnostics and CLI diagnostics are documented and required to stay semantically aligned.

### Chinese (chino)
*   **Linea principal Force Rewrite Auditoria**: Se agrego un nuevo documento de nueva auditoria y una matriz de promocion unificada para la linea principal actual, distinguiendo claramente lo reescrito. `origin/main` Envie el verdadero valor con evidencia que solo existe en la rama de respaldo para evitar la sobreestimacion continua de los documentos de progreso. live mainline Habilidades ya poseidas.。
*   **Verificado de forma nativa Clean-State guardia**: `.gitignore` El directorio raiz ahora se ignora `render-host.mjs` y `docs/` Descargar local vault Registro de errores generado、provider Diagnosticar archivos, obtener una vista previa de los productos exportados y los artefactos de graficos guardados para evitar ejecutar la maquina cada vez Obsidian El almacen esta sucio despues de la verificacion.。
*   **Repo-Saga Demonio de ejecucion en serie**: `npm run chronicle:sync-repo-saga` Con `npm run chronicle:update` Compartire ahora `.cache/.repo-saga-execution.lock` Ejecutar bloqueos para evitar local o CI Actualizar simultaneamente el mismo conjunto repo-saga Estado mutuo al almacenar en cache directorios。
*   **Salida basada en modelos Token Limite superior**: Recien agregado Cline Salida maxima de modelos conocidos alineados Token metadatos, y el tiempo de ejecucion ahora analiza el limite de salida efectivo en funcion del modelo realmente seleccionado por el usuario, en lugar de depender de uno codificado provider Valor predeterminado. Cuando el maximo global Token Los modelos compatibles utilizan automaticamente sus verdaderos limites superiores conocidos cuando mantienen los valores predeterminados del complemento; cuando el usuario configura manualmente global o provider Cuando se nivelan, las solicitudes se limitan al maximo conocido del modelo. Este comportamiento ahora se anula OpenAI-compatible Caminos y Anthropic、Google、Azure OpenAI、Ollama Tiempo de ejecucion。
*   **Panel de diagnostico del modo desarrollador**: Se agrego una nueva pagina de configuracion.“Developer mode”Un panel de desarrollador independiente controlado por el conmutador, que oculta los controles especificos del desarrollador a los usuarios normales de forma predeterminada.。
*   **Metodo de llamada de diagnostico opcional y multiples rondas de pruebas de estabilidad**: Los diagnosticos del desarrollador ahora pueden elegir el metodo de llamada (incluido OpenAI-compatible Modo de transmision forzada) y admite la ejecucion de pruebas de estabilidad en rondas especificas y la generacion de informes agregados.。
*   **OpenAI-compatible Se agrego una nueva etapa sin transmision al modo estable.**: Cuando falla la transmision directa primaria, en modo estable OpenAI-compatible Las llamadas ahora intentaran ser directas sin transmision antes de volver a `requestUrl`。Esto puede cubrir el problema de "el enlace de transmision es inestable pero el que no es de transmision puede regresar normalmente" Provider Escena。
*   **Todos LLM Alternativa de ruta de transmision basada en protocolos**: La capacidad de resolucion alternativa de solicitudes largas ha cambiado de OpenAI-compatible Ampliar a Anthropic Messages、Google Gemini、Azure OpenAI y Ollama，Haz Estos transport En el escritorio `http/https` versus no escritorio `fetch` El enlace alternativo de transmision con reconocimiento de protocolo se puede utilizar en todas las circunstancias. legado OpenAI Exportacion de estilo Provider La funcion de empaquetado tambien ha convergido al mismo conjunto de rutas alternativas de transmision compartida y ya no se conserva. buffered-only Vieja logica。
*   **a traves Transport Depuracion de transmision parcial**: La salida de depuracion compartida ahora no solo cubre OpenAI-compatible，Tambien para Anthropic、Google/Azure Estilo SSE，y Ollama NDJSON Reserva alternativa que conserva el "texto analizado parcialmente transmitido"”。
*   **Estrategia de prioridad de transmision principal en modo estable（OpenAI-Compatible）**: En estabilidad API En modo llamada，OpenAI-compatible El enlace del tiempo de ejecucion dara prioridad al escritorio./La transmision de paginas web sirve como ruta principal de solicitud larga y luego vuelve a `requestUrl`。Esto puede reducir“`requestUrl` El enlace se desconecto primero, pero el flujo ascendente finalmente regreso exitosamente, lo que provoco una falla de enlace falsa.。
*   **Cobertura de la prueba de regresion**: nuevo Anthropic、Google、Azure OpenAI、Ollama，Y el resto de conexiones directas OpenAI Estilo Provider Pruebas de tiempo de ejecucion dirigidas de funciones contenedoras en escenarios de exito de reversion de transmision e interrupcion a mitad de camino。
*   **reales Endpoint Diagnostico CLI**: nuevo `scripts/diagnose-llm-provider.js`（y `npm run diagnose:llm`），Puede afrontar directamente la verdad. Provider Ejecucion buffered/streaming Diagnostico de comparacion de solicitudes largas y salida del tiempo empleado en cada intento despues de la desensibilizacion, encabezados de respuesta, cuerpos de respuesta parciales y fragmentos de transmision analizados.。
*   **Boton de diagnostico del desarrollador de la pagina de configuracion**: Agregar nuevo en la pagina de configuracion `Developer provider diagnostic (long request)` El boton puede controlar directamente la actividad actual. Provider Inicie la prueba de tiempo de ejecucion en el complemento y guarde el informe completo en el directorio raiz del almacen.（`Notemd_Provider_Diagnostic_*.txt`）。
*   **Pruebas y modulos de tiempo de ejecucion de diagnostico**: nuevo `src/providerDiagnostics.ts`，y en `src/tests/providerDiagnostics.test.ts` El boton de finalizacion activa el correspondiente exito del enlace./Pruebas de ruta fallidas para garantizar que la salida del informe y la informacion de depuracion sean estables y regresivos。
*   **Alineacion de la documentacion con las pautas para agentes**: El chino y el ingles se han actualizado simultaneamente. README Con `AGENTS.md`，Aclarar los diagnosticos integrados y CLI El diagnostico debe mantener una semantica de protocolo coherente。

---

## [1.8.1] - 2026-04-13

### English
*   **Complete Supported UI Locale Coverage**: Finished localizing the remaining visible settings, workflow builder, sidebar tooltip, extracted-text settings, advanced settings, and output-path surfaces for every advertised UI locale.
*   **Stricter Regression Coverage**: Added focused tests so supported locales no longer silently fall back to English on those visible UI surfaces.
*   **Documentation Reality Check**: Updated the root READMEs and Language Hub to distinguish maintainer source docs, published README translations, and the exact in-app UI locale catalog.
*   **Version Alignment**: Synchronized release metadata and packaged documentation for `1.8.1`.

### Chinese (chino)
*   **Soporte completo UI Locale Alcance visible**: Completo todo el apoyo declarado. locale Finalizacion de la localizacion en interfaces visibles, como configuraciones restantes, generador de flujo de trabajo, mensajes de la barra lateral, configuraciones de extraccion de texto original, configuraciones avanzadas y configuracion de ruta de salida.。
*   **Mejorar la cobertura de las pruebas de regresion**: Se agregaron nuevas pruebas especificas para garantizar que sean compatibles. locale Ya no es visible arriba UI El silencio vuelve al ingles.。
*   **Calibracion de la realidad del documento**: Actualiza la raiz del repositorio. README Con el centro de idiomas, distinga claramente entre mantener documentos fuente y documentos publicados. README Traduccion y en la aplicacion UI locale Indice exacto。
*   **Alineacion de metadatos de version**: Ya `1.8.1` La informacion de la version y los documentos del paquete estan sincronizados.。

---

## [1.8.0] - 2026-04-09

### English
*   **First-Principles Language Support Architecture**: Added a unified language domain model that separates UI locale from task output language policy.
*   **UI i18n Foundation**: Introduced centralized locale catalogs for all supported UI locales (`en`, `ar`, `de`, `es`, `fa`, `fr`, `id`, `it`, `ja`, `ko`, `nl`, `pl`, `pt`, `pt-BR`, `ru`, `th`, `tr`, `uk`, `vi`, `zh-CN`, `zh-TW`) with fallback chaining and interpolation support.
*   **Runtime String Migration**: Migrated high-impact settings/sidebar/error-modal/runtime notices to shared i18n strings.
*   **Policy Unification Across Task Paths**: Consolidated task-language decisions in one policy layer and wired it into prompt, processing, research, and translation flows.
*   **Locale/RTL Hardening**: Added locale-aware timestamp formatting and RTL safety styling guards.
*   **Regression Harness**: Added reproducible baseline/compare scripts and preserved phase evidence for before/after robustness checks.
*   **Build Stability with Reference Repo**: Excluded `ref/**` from TypeScript/Jest/ESLint scopes so reference projects can coexist without breaking plugin build/test gates.

### Chinese (chino)
*   **Primeros principios de la arquitectura de soporte del lenguaje.**: Se agrego un nuevo modelo de dominio de lenguaje unificado para separar claramente UI Estrategias de lenguaje y lenguaje de salida de tareas.。
*   **UI i18n Infraestructura**: Para todos los apoyados UI locale（`en`、`ar`、`de`、`es`、`fa`、`fr`、`id`、`it`、`ja`、`ko`、`nl`、`pl`、`pt`、`pt-BR`、`ru`、`th`、`tr`、`uk`、`vi`、`zh-CN`、`zh-TW`）Introducir un directorio de idiomas centralizado y admitir la cadena de respaldo y la interpolacion de variables.。
*   **Migracion de redaccion publicitaria en tiempo de ejecucion**: Migre la pagina de configuracion, la barra lateral, la ventana emergente de error y las sugerencias clave del proceso principal para compartir i18n Sistema de cuerdas。
*   **Cerrar la estrategia del lenguaje de la tarea.**: Unifique la toma de decisiones del lenguaje de tareas con la capa de estrategia y conectela prompt、Rutas de procesamiento, investigacion y traduccion.。
*   **Locale/RTL Mejora de la robustez**: Se agrego formato de hora localizado y RTL Proteccion de estilo seguro de diseno。
*   **Volver a las capacidades de secuencias de comandos**: Aumentar la reproducibilidad baseline/compare Elaborar un guion y conservar pruebas comparativas graduales antes y despues para garantizar la solidez del proceso de transformacion.。
*   **Coexistencia de almacenes de referencia para generar estabilidad**: voluntad `ref/**` Exclusion TypeScript/Jest/ESLint Compile y pruebe el alcance para que la introduccion del almacen de referencia ya no destruya el control de acceso del proyecto principal del complemento.。

---

## [1.7.14] - 2026-03-30

### English
*   **Single-File CTA Visual Mapping**: Sidebar colorful CTA styling is now strictly mapped to single-file actions. Batch/folder-level actions no longer use CTA color treatment, reducing scope confusion and accidental batch triggers.
*   **Workflow CTA Rule Alignment**: Custom workflow buttons now inherit CTA styling only when every step is single-file. Mixed workflows that include batch steps are rendered as non-CTA to keep visual semantics consistent.
*   **Regression Coverage**: Added a sidebar DOM test to lock CTA mapping behavior for single-file actions vs batch/folder actions and default mixed workflow buttons.

### Chinese (chino)
*   **Fila unica CTA Mapeo visual**: Color de la barra lateral CTA Los estilos ahora corresponden estrictamente a la accion de "procesamiento de un solo archivo"; lote/Las acciones a nivel de carpeta ya no se utilizan. CTA Color para reducir el riesgo de errores de calculo sobre el rango y activacion falsa de lotes。
*   **flujo de trabajo CTA Alineacion de reglas**: Los botones de flujo de trabajo personalizados solo se aplican si "Todos los pasos son acciones de un solo archivo" CTA Estilo; siempre que contenga pasos por lotes, volvera a no ser CTA Estilo para mantener coherente la semantica visual。
*   **Cobertura de la prueba de regresion**: Barra lateral agregada DOM Probar, bloquear acciones de un solo archivo, por lotes/Acciones de carpeta y botones de flujo de trabajo hibrido predeterminados CTA Comportamiento de mapeo。

---

## [1.7.13] - 2026-03-30

### English
*   **Sidebar Interaction Polish**: Refined sidebar button interactions with clearer hover, pressed, and focus-visible states so action feedback is obvious during rapid workflows.
*   **CTA Readability Fix**: Improved text contrast on colorful CTA buttons (including `One-Click Extract` and `Batch generate from titles`) to avoid low-contrast white-on-light combinations across different Obsidian themes.
*   **Docked Footer Visibility Tuning**: Increased persistent footer sizing constraints and log minimum height so progress + log telemetry stays visible when multiple panels are expanded.

### Chinese (chino)
*   **Pulido interactivo de la barra lateral**: Los estados de desplazamiento, pulsacion y enfoque del teclado de los botones de la barra lateral se han refinado para que la informacion de operacion en flujos de trabajo de alta frecuencia sea mas clara.。
*   **CTA Correcciones de legibilidad**: Color mejorado CTA Botones (incluidos `One-Click Extract`、`Batch generate from titles`）Contraste de texto para evitar el problema de la visibilidad insuficiente del texto blanco sobre un fondo poco profundo bajo diferentes temas.。
*   **Optimice la visibilidad del area del muelle inferior.**: Se ajusto la restriccion de tamano del area inferior fija y la altura minima del tronco. Al expandir varios grupos, aun puede ver el progreso y registrar la informacion de manera estable.。

---

## [1.7.8] - 2026-03-29

### English
*   **OpenAI-Compatible Streaming Fallback**: Long-running OpenAI-compatible task calls now upgrade their desktop `http/https` and non-desktop `fetch` fallback attempts to streaming response parsing after an initial transient `requestUrl` disconnect. This helps slow gateways and reverse proxies return body chunks earlier instead of failing the whole request while waiting for one large buffered response.
*   **Parsed Partial Stream Debugging**: Shared deep-debug output now records both raw partial bodies and parsed partial stream text when a streamed fallback attempt is interrupted. This gives developers enough evidence to distinguish between transport resets and upstream provider-side error payloads.
*   **Regression Coverage**: Added focused tests for desktop and web streaming fallback assembly, plus interrupted streaming fallback diagnostics.

### Chinese (chino)
*   **OpenAI-compatible Reversion de transmision**: Consume mucho tiempo OpenAI-compatible La tarea se llama por primera vez. `requestUrl` Despues de una desconexion momentanea, el escritorio ahora `http/https` Frente a entornos que no son de escritorio `fetch` El respaldo intenta actualizar al analisis de respuesta de transmision. De esta manera, las puertas de enlace lentas y los servidores proxy inversos pueden regresar antes body Fragmentacion, en lugar de esperar la respuesta completa del bufer del bloque para determinar directamente que toda la solicitud fallo。
*   **Depuracion de fragmentos de transmision analizados**: La salida de depuracion de profundidad compartida ahora registra tanto el cuerpo de la respuesta parcial original como el "texto transmitido parcialmente analizado" cuando la transmision alternativa se interrumpe a mitad de camino. Los desarrolladores pueden distinguir mas claramente si se trata de un restablecimiento de la capa de transporte o un restablecimiento ascendente. Provider Se han devuelto errores que se pueden utilizar para localizar el problema./Fragmentos de contenido。
*   **Cobertura de la prueba de regresion**: Version de escritorio agregada y Web Prueba de ensamblaje de reversion de transmision y prueba de informacion de diagnostico cuando se interrumpe la reversion de transmision。

---

## [1.7.7] - 2026-03-26

### English
*   **Cross-Provider Deep Debugging**: The shared LLM transport/error path now records per-attempt debug metadata for every provider, including transport name, sanitized request URL and headers, elapsed duration, response headers, partial response bodies, and stack traces. This makes slow upstream gateway resets and proxy disconnects visible without relying on provider-specific logging.
*   **Connection Test Debug Consistency**: Provider connection probes now use the same instrumented request path as runtime calls, so debug mode exposes the same transport-level evidence during "Test Connection" failures.
*   **Non-Desktop Runtime Fallback**: When desktop Node transport is unavailable, transient `requestUrl` disconnects now retry the same attempt through browser `fetch`, extending runtime resilience and provider connection testing to mobile/non-desktop environments.
*   **Chinese Preset Refresh**: Synced selected China-focused preset defaults with current `cline` model baselines, including `Qwen` -> `qwen3-235b-a22b`, `Moonshot` -> `kimi-k2-0905-preview`, and `MiniMax` -> `MiniMax-M2.7`.
*   **Regression Coverage**: Added focused tests for shared debug metadata rendering and interrupted desktop fallback responses with partial-body capture.

### Chinese (chino)
*   **a traves Provider Depuracion en profundidad**: Compartido LLM Transmision/El enlace de manejo de errores ahora estara disponible para todos Provider Registro de metadatos de depuracion ampliados por dimensiones de prueba, incluidos transport Nombre, solicitud tras la desensibilizacion URL/Encabezados de solicitud, consumo de tiempo, encabezados de respuesta, cuerpo de respuesta parcial e informacion de pila. Asi que incluso si no hay Provider Los registros especificos tambien pueden ver directamente en que enlace se produjo el restablecimiento lento de la puerta de enlace ascendente o la desconexion del proxy.。
*   **Prueba de conexion y consistencia de depuracion.**: Provider La sonda de conexion ahora reutiliza la misma ruta de solicitud instrumentada que la llamada en tiempo de ejecucion, por lo que el modo de depuracion tambien genera el mismo nivel cuando falla la "Conexion de prueba". transport Evidencia。
*   **Respaldo cuando se ejecuta en dispositivos que no son de escritorio**: Cuando el escritorio Node Cuando la transmision no esta disponible，`requestUrl` La desconexion transitoria ahora cambiara al navegador dentro de la misma llamada. `fetch` Reintentar, combinando asi robustez en tiempo de ejecucion y Provider Las capacidades de prueba de conexion se amplian a los terminales moviles./Entornos que no son de escritorio。
*   **Actualizacion predeterminada en China**: Parte del area de China ha sido Provider El modelo predeterminado preestablecido se sincroniza con el actual. `cline` Linea de base, incluyendo `Qwen` -> `qwen3-235b-a22b`、`Moonshot` -> `kimi-k2-0905-preview`、`MiniMax` -> `MiniMax-M2.7`。
*   **Cobertura de la prueba de regresion**: Se agrego prueba de representacion de metadatos de depuracion compartida y version de escritorio. fallback Prueba de captura de parte del cuerpo de respuesta cuando la respuesta se desconecta a mitad de camino。

---

## [1.7.6] - 2026-03-26

### English
*   **Runtime Transport Robustness**: Long-running LLM task calls now switch from Obsidian `requestUrl` to desktop `http/https` transport after transient disconnects such as `ERR_CONNECTION_CLOSED`, then continue into the existing stable retry sequence only if the fallback also fails. This hardens slow translation and generation jobs against proxy or gateway drops.
*   **China Provider Expansion Round 2**: Added first-class presets for `Qwen Code`, `Z AI`, and `Huawei Cloud MaaS`, with routing coverage, connection-test coverage, and synchronized English/Chinese provider documentation.
*   **Sidebar Footer Stability**: Refined the sidebar footer into a docked status/log area with a clearer standby progress state so the log panel remains visible and the ready-state progress area is readable even when every section is expanded.
*   **Regression Coverage**: Added focused runtime fallback tests for every active transport path plus sidebar DOM tests for the docked footer and standby progress state.

### Chinese (chino)
*   **Robustez de transmision en tiempo de ejecucion mejorada**: Lleva mucho tiempo LLM Tareas encontradas `ERR_CONNECTION_CLOSED` Cuando la conexion se desconecta instantaneamente, ahora comenzara desde Obsidian de `requestUrl` Cambiar al escritorio `http/https` Transmision; Solo cuando la reversion tambien falle, se ingresara la secuencia de reintento estable original. Tareas lentas de traduccion y generacion para agentes./La tolerancia a la desconexion de la puerta de enlace se ha mejorado significativamente.。
*   **Region de China Provider Segunda ronda de expansion**: nuevo `Qwen Code`、`Z AI`、`Huawei Cloud MaaS` Tres ajustes preestablecidos de primera clase y prueba de enrutamiento en tiempo de ejecucion completa, cobertura de prueba de conexion, chino e ingles Provider Documentacion。
*   **Estabilidad mejorada del area inferior de la barra lateral.**: Organice aun mas la parte inferior de la barra lateral en un estado acoplado./Area de registro y mejora. Ready El progreso del modo de espera se muestra en el estado; Incluso si se expanden todos los grupos, el panel de registro no seguira comprimiendose hasta que se vuelva invisible.。
*   **Cobertura de la prueba de regresion**: Cobertura recien agregada de todos los activos. transport Pruebas de respaldo en tiempo de ejecucion de rutas y bloqueo docked footer Con standby Progresivo sidebar DOM Prueba。

---

## [1.7.5] - 2026-03-26

### English
*   **Provider Connection Test Robustness**: Connection tests now fall back to the stable retry sequence after the first transient network disconnect instead of failing immediately, aligning the "Test Connection" button with the runtime resilience already used by task execution.
*   **Full Transport Coverage**: The transient-failure fallback now covers every transport used by built-in provider presets, including OpenAI-compatible providers, Anthropic, Google, Azure OpenAI, and Ollama.
*   **Regression Coverage**: Added focused provider-support tests for both runtime API calls and connection-test probes so transient disconnect handling stays locked in across transports.
*   **Documentation**: Updated the English and Chinese READMEs plus version metadata to document the new provider-connection retry behavior for `1.7.5`.

### Chinese (chino)
*   **Provider Robustez mejorada de la prueba de conexion.**: La prueba de conexion ya no fallara inmediatamente despues de encontrar una desconexion transitoria de la red por primera vez. En cambio, volvera a una secuencia de reintento estable, lo que hara que el boton "Probar conexion" sea consistente con la solidez de la ruta de ejecucion de la tarea real.。
*   **Todos Transport Cobertura**: Este mecanismo de reserva de falla instantanea ahora cubre todos los dispositivos integrados. Provider Enlaces de transmision predeterminados utilizados, incluidos OpenAI-compatible、Anthropic、Google、Azure OpenAI Con Ollama。
*   **Cobertura de la prueba de regresion**: Se agregaron nuevas funciones para el tiempo de ejecucion. API Llame y conectese para probar el enlace de deteccion. Provider Apoyar las pruebas para garantizar la transport El procesamiento de desconexion instantanea no retrocedera.。
*   **Actualizacion de documentos**: El chino y el ingles se han actualizado simultaneamente. README Registros con metadatos de version. `1.7.5` de Provider Comportamiento de reintento de prueba de conexion。

---

## [1.7.4] - 2026-03-26

### English
*   **Sidebar Layout Stability**: Reworked the sidebar into a scrollable action area plus a persistent footer so the progress card and log output remain visible even when all action groups are expanded.
*   **Clearer Progress Feedback**: Moved the percentage text into a dedicated status pill, kept the progress bar visible in the ready state, and improved visual contrast for the sidebar progress area.
*   **Regression Coverage**: Added focused sidebar DOM tests to lock in the persistent footer layout and the new progress summary behavior.
*   **Documentation**: Updated the English and Chinese READMEs to reflect the pinned sidebar telemetry layout.

### Chinese (chino)
*   **Estabilidad del diseno de la barra lateral**: Reconstruya la barra lateral en un espacio de trabajo desplazable con un area inferior fija. Incluso si se expanden todos los grupos de acciones, la tarjeta de progreso y la salida del registro no desapareceran de la vista.。
*   **Comentarios de progreso mas claros**: Mueva el texto del porcentaje a una etiqueta de estado separada y mantengalo Ready La barra de progreso es visible en el estado y mejora el contraste visual del area de progreso de la barra lateral.。
*   **Cobertura de la prueba de regresion**: Barra lateral de enfoque agregada DOM Prueba y bloqueo del diseno inferior fijo con un nuevo comportamiento de visualizacion del resumen de progreso。
*   **Actualizacion de documentos**: Actualizar chino e ingles sincronicamente README，Suplemento de progreso de fondo fijo/Descripcion del diseno del registro。

---

## [1.6.5] - 2026-01-27

## Bug Fixes

### English
*   **Fix installation Error**: Delete the unused js files, Fix the Severe installation difficulties

### Chinese (chino)
*   **Resolver problemas de instalacion.**: Eliminar inutilesjsDocumentacion que soluciona problemas graves de instalacion。


---

## [1.6.4] - 2026-01-27

### English
*   **Search Engine Support**: Resolved issues with DuckDuckGo search by implementing a robust, modular architecture. The new `DuckDuckGoProvider` now uses DOMParser for reliable HTML parsing with a regex fallback, ensuring consistent search results even if the layout changes.
*   **Modular Architecture**: Refactored the search logic into a modular `SearchProvider` system, making it easier to add new search engines and maintain existing ones.
*   **Code Quality**: Integrated comprehensive unit tests for search providers to prevent regression.

### Chinese (chino)
*   **Soporte para motores de busqueda**: Resuelto implementando una arquitectura modular robustaDuckDuckGoPreguntas de busqueda. nuevo `DuckDuckGoProvider` Usar ahora DOMParser Haz confiable HTML Analisis, con un mecanismo alternativo de expresion regular para garantizar resultados de busqueda consistentes incluso cuando cambia el diseno.。
*   **Arquitectura modular**: Refactorizar la logica de busqueda para que sea modular `SearchProvider` Sistema que facilita la adicion de nuevos motores de busqueda y el mantenimiento de los existentes.。
*   **Calidad del codigo**: Pruebas unitarias integrales integradas para proveedores de busqueda para evitar regresiones.。

## [1.6.3] - 2026-01-27

### English
*   **API Error Debugging**: Fixed an issue where the "API Error Debugging Mode" would not show the full error response body for certain providers (like LMStudio 429 errors). Now, detailed JSON responses and status codes are correctly captured and logged when this mode is enabled, aiding significantly in troubleshooting connectivity and rate-limit issues.

### Chinese (chino)
*   **API Depuracion de errores**: Fijo“API El error "Modo de depuracion" no se puede mostrar para algunos proveedores (como LMStudio 429 error) con el texto completo de respuesta de error. Ahora, con este modo habilitado, detallado JSON Los codigos de respuesta y de estado ayudan enormemente a solucionar problemas de conexion y limitacion de velocidad。

## v1.6.2

### English
*   **Modularized API Error Handling**: Refactored error handling logic to ensure consistency across all tasks.
*   **Enhanced Debugging**: The "API Error Debugging Mode" now fully supports "Translate", "Search", and "Connection Test" tasks, providing detailed logs (HTTP status codes, raw responses) for deeper troubleshooting.

### Chinese (chino)
*   **ModularidadAPIManejo de errores**: Logica de manejo de errores reconstruida para garantizar la coherencia de todas las tareas.。
*   **Mejorar la depuracion**: “APIEl modo de depuracion de errores ahora es totalmente compatible con las tareas de traduccion, busqueda y prueba de conexion, proporcionando registros detallados.（HTTPcodigo de estado, respuesta sin procesar) para una solucion de problemas mas profunda。

---

## Bug Fixes

### English
*   **Fix Mermaid Table Corruption**: Resolved a critical issue where the "Batch Mermaid Fix" and "Deep Debug" features would incorrectly apply syntax fixes to Markdown tables (e.g., changing `| : --- |` to `| : -- "- |`), ensuring that modifications are strictly limited to code blocks within ```mermaid``` tags.
*   **Enhanced Table Protection**: Implemented robust safeguards in the deep debug processor to specifically ignore lines matching Markdown table separators (e.g., `| :--- |`) and lines containing `:-- :`, preserving table integrity even in aggressive fix modes.

### Chinese (chino)
*   **ReparacionMermaidLa mesa esta danada.**: Resolvio el problema de "LoteMermaidLas funciones "Reparacion" y "Depuracion profunda" aplican incorrectamente correcciones de sintaxis aMarkdownMesas (por ejemplo, colocar `| : --- |` Cambiar a `| : -- "- |`）La cuestion clave es garantizar que las modificaciones se limiten estrictamente a ```mermaid``` En bloques de codigo dentro de etiquetas.。
*   **Proteccion de mesa mejorada**: Se implemento una proteccion solida en el procesador de depuracion profunda para ignorar especificamente las coincidencias.MarkdownSeparadores de mesa (p. ej. `| :--- |`）y contiene `:-- :` Filas que mantienen la integridad de la tabla incluso en modo de reparacion agresivo。

---

## Code/Architecture Update

### English
*   **Modularized API Error Handling**: Refactored `llmUtils.ts` to introduce a centralized `handleProviderError` function. This function supports both concise error reporting (default) and verbose, "DeepSeek-style" debugging logs (status codes, raw responses), ensuring consistent error handling across all 10+ supported LLM providers.
*   **Automatic Error Logging**: Implemented a `saveErrorLog` utility in `fileUtils.ts`. This function captures the error message, stack trace, and the full session log from the reporter, saving it to a timestamped file (e.g., `Notemd_Error_Log_2023-10-27_10-00-00.txt`) in the vault root whenever a process fails. It also intelligently prompts users to enable debug mode if it's currently disabled.

### Chinese (chino)
*   **ModularidadAPIManejo de errores**: Refactorizado `llmUtils.ts`，Introducido centralizado `handleProviderError` Funcion. Esta funcion admite informes de errores concisos (predeterminado) y detallados.“DeepSeekRegistro de depuracion de estilo (codigo de estado, respuesta sin procesar) para garantizar que todos10Multiples compatiblesLLMEl proveedor tiene un manejo de errores consistente。
*   **Registro automatico de errores**: en `fileUtils.ts` Implementado en `saveErrorLog` herramienta. Esta funcion captura mensajes de error, seguimientos de pila y registros de sesion completos del reportero y los guarda en un archivo con marca de tiempo en la raiz de la boveda cuando el proceso falla (p. ej. `Notemd_Error_Log_2023-10-27_10-00-00.txt`）。Tambien solicitara inteligentemente al usuario que habilite el modo de depuracion si actualmente esta deshabilitado.。

---

## Implementation of Functionality

### English
*   **API Error Debugging Mode**: Added a new setting in the "Stable API calls" section.
    *   **Enabled**: Activates detailed logging for all API calls, including HTTP status codes and raw response text, aiding in troubleshooting connection issues.
    *   **Disabled**: Maintains the standard, clean user experience with concise error messages.
*   **Automatic Log File Generation**:
    *   When an error occurs during any major operation (processing files, generating content, research, etc.), a detailed log file is now automatically created in the vault root.
    *   This file includes the error context and session history, making it easier for users to report bugs and for developers to diagnose issues.

### Chinese (chino)
*   **APIModo de depuracion de errores**: En “estable”APISe ha agregado una nueva configuracion a la seccion "Llamadas"。
    *   **Habilitar**: Activar todoAPIRegistro detallado de llamadas, incluidoHTTPCodigo de estado y texto de respuesta sin formato para ayudar a solucionar problemas de conexion。
    *   **Discapacitado**: Mantenga una experiencia de usuario limpia y estandar y proporcione mensajes de error concisos.。
*   **Generacion automatica de archivos de registro**:
    *   Cuando se produce un error durante cualquier operacion importante (procesar archivos, generar contenido, investigar, etc.), ahora se crea automaticamente un archivo de registro detallado en el directorio raiz de la boveda.。
    *   Este archivo contiene contexto de error e historial de sesion, lo que facilita a los usuarios informar errores y a los desarrolladores diagnosticar problemas.。

---

## Implementation of Functionality

### English
*   **Extract Specific Original Text**:
    *   Introduced a new feature to extract verbatim text segments from notes based on user-defined questions.
    *   **Merged Query Mode**: Efficiently processes all questions in a single API call.
    *   **Translation Support**: Optionally includes translations of the extracted text.
    *   **Custom Output**: Configurable output paths and filenames.
    *   **Batch Mermaid Fix Enhancements**:
    *   **Advanced Fix Mode**: Added robust handling for unquoted Mermaid node labels containing nested brackets (e.g., `Node[Label [Text]]`) and special characters.
    *   **Note Conversion**: Added functionality to automatically convert `note right/left of` comments in Mermaid graphs to edge labels, ensuring better rendering and adherence to standard graph syntax.
    *   **Malformed Arrow Fix**: Implemented deep debugging logic to correct malformed arrow labels where the arrow syntax is incorrectly embedded within quotes (e.g., `-->"` becomes `" -->`), ensuring valid Mermaid syntax.
    *   **Standardize Pipe Labels**: Added logic to robustly handle and quote edge labels containing pipes (e.g., `|Text|` -> `|"Text"|`), resolving syntax errors in complex diagrams involving mathematical notation or loose pipe usage.
    *   **Merge Double Labels**: Introduced a fix for conflicting double edge labels (e.g., `-- "A" -->|"B"|`), merging them into a single descriptive label (`-- "A<br>(B)" -->`) to resolve rendering ambiguities.
    *   **Error Reporting**: Automatically generates a `mermaid_error_{foldername}.md` report listing files with remaining errors.
    *   **Move Error Files**: Added an option to automatically move files with persistent errors to a specific folder for manual review.

### Chinese (chino)
*   **Extraer contenido original especifico**:
    *   Se introdujo una nueva funcion para extraer pasajes de texto palabra por palabra de notas basadas en preguntas definidas por el usuario.。
    *   **Modo de consulta combinado**: En un soloAPIManejar eficientemente todos los problemas durante la llamada.。
    *   **Soporte de traduccion**: Opcionalmente incluya traduccion del texto extraido.。
    *   **Salida personalizada**: Ruta de salida configurable y nombre de archivo。
*   **loteMermaidReparacion y mejora**:
    *   **Modo de reparacion avanzada**: Se agrego soporte para contener corchetes anidados (p. ej. `Node[Etiquetas [texto]]`）Caracteres especiales y sin comillasMermaidManejo solido de etiquetas de nodos。
    *   **Conversion de anotaciones**: Anadido automatico Mermaid En el grafico `note right/left of` La capacidad de convertir anotaciones en etiquetas de lineas de conexion garantiza una mejor representacion y se ajusta a la sintaxis de graficos estandar.。
    *   **Reparacion de flechas deformadas.**: Se implemento una logica de depuracion profunda para corregir etiquetas de flechas con formato incorrecto donde la sintaxis de las flechas esta incrustada incorrectamente entre comillas (p. ej. `-->"` convertirse `" -->`），Asegurar Mermaid Validez gramatical。
    *   **Estandarizar las etiquetas de las tuberias**: Se agrego logica para un manejo solido y referencias de etiquetas de lineas de conectores que contienen caracteres de tuberia (p. ej. `|texto|` -> `|"texto"|`），Errores de sintaxis resueltos en diagramas complejos que implicaban el uso de simbolos matematicos o caracteres sueltos.。
    *   **Fusionar etiquetas duales**: Se introdujo soporte para etiquetas de doble borde en conflicto (p. ej. `-- "A" -->|"B"|`）Corrija para combinarlo en una sola etiqueta descriptiva.（`-- "A<br>(B)" -->`），Para resolver ambiguedades en la representacion.。
    *   **Informe de errores**: Generado automaticamente `mermaid_error_{foldername}.md` Informe, enumerando archivos que aun tienen errores.。    *   **Mover archivos incorrectos**: Se agrego una opcion para mover automaticamente archivos con errores persistentes a una carpeta especifica para su revision manual.。

---

## Code/Architecture Update

### English
*   **Robust Regex for Mermaid**: Implemented a sophisticated regex pattern in `mermaidProcessor.ts` to correctly identify and quote complex node labels without breaking existing valid syntax.
*   **Documentation Synchronization**: Fully synchronized `README.md` and `README_zh.md` to ensure all new features (Extract Text, Mermaid Fixes) are documented in both languages.

### Chinese (chino)
*   **MermaidExpresiones regulares robustas para**: en `mermaidProcessor.ts` Se implementan patrones complejos de expresiones regulares para identificar y hacer referencia correctamente a etiquetas de nodos complejos sin romper la sintaxis valida existente.。
*   **Sincronizacion de documentos**: Completamente sincronizado `README.md` y `README_zh.md`，Asegurate de que todas las funciones nuevas (extraer texto，MermaidFix) estan documentados en ambos idiomas.。

---
## Code/Architecture Update

### English
*   **Improved Progress Bar Logic**: Enhanced the logic for progress bar updates to ensure it accurately reflects the completion status of operations, preventing it from getting stuck at intermediate percentages.

### Chinese (chino)
*   **Logica de la barra de progreso mejorada**: Logica de actualizacion de la barra de progreso mejorada para garantizar que refleje con precision el estado de finalizacion de la operacion y evite que se quede atascada en el porcentaje medio.。

---
## Implementation of Functionality

### English
*   **Accurate UI Feedback for Wiki-Link Command**: The "Create Wiki-Link & Generate Note from Selection" command now provides accurate progress updates, reaching 100% completion and automatically closing the progress modal upon successful execution.

### Chinese (chino)
*   **Wiki-LinkPrecision de los pedidosUIComentarios**: “El comando Crear enlaces Wiki a partir de texto seleccionado y Generar notas ahora proporciona actualizaciones precisas del progreso tras una ejecucion exitosa.100%Completa y cierra automaticamente el cuadro modal de progreso.。

---
## Code/Architecture Update

### English
*   **Refined Concurrent Processing**: Implemented a staggered launch mechanism in the `createConcurrentProcessor` utility. This ensures that API calls within a parallel batch are spaced out by the configured `apiCallIntervalMs`, preventing request bursts and resolving potential 429 rate-limit errors from LLM providers.
*   **Modularized Syntax Fixing**: Refactored the `batchFixMermaidSyntaxInFolder` function by extracting the core logic into a new, reusable `fixMermaidSyntaxInFile` function. This improves code modularity and maintainability.

### Chinese (chino)
*   **Optimice el procesamiento concurrente**: en `createConcurrentProcessor` El mecanismo de inicio escalonado se implementa en la funcion de herramienta. Esto asegura que en el procesamiento por lotes paraleloAPILas llamadas se pueden configurar segun `apiCallIntervalMs` La ejecucion a intervalos evita rafagas de solicitudes y resuelve problemas causados porLLMEl potencial del proveedor429Error de limitacion de velocidad。
*   **Correccion de sintaxis modular**: Refactorizado `batchFixMermaidSyntaxInFolder` Funcion, extrae la logica central en una nueva y reutilizable `fixMermaidSyntaxInFile` En funcion. Esto mejora la modularidad y la mantenibilidad del codigo.。

---
## Implementation of Functionality

### English
*   **Enabled "Auto Mermaid Fix" Feature**: Implemented the core logic for the "Auto Mermaid Fix" feature by adding the `fixMermaidSyntaxInFile` function. This feature, when enabled in settings, automatically corrects Mermaid and LaTeX syntax in notes generated by various commands, ensuring diagram validity.
*   **Updated Documentation**: Updated `README.md` and `README_zh.md` to reflect the improved reliability of batch processing.

### Chinese (chino)
*   **Habilite “AutomaticoMermaidFuncion “reparar”**: Al agregar `fixMermaidSyntaxInFile` Funcion, realizando “automaticoMermaidLa logica central de la funcion "Reparacion". Una vez habilitada esta funcion en la configuracion, corregira automaticamente los errores en las notas generadas por varios comandos.MermaidyLaTeXGramatica para garantizar la validez de los graficos.。
*   **Actualizar documentacion**: Actualizado `README.md` y `README_zh.md`，Para reflejar la mejora de la confiabilidad del procesamiento por lotes.。

---

## Code/Architecture Update

### English

*   **Parallel Processing Framework**: Introduced a parallel processing framework for batch operations. This was achieved by implementing a custom `Semaphore` for concurrency control and a `createConcurrentProcessor` factory function in `utils.ts`.
*   **Refactored Batch Commands**: Refactored all major batch processing commands (`processFolderWithNotemdCommand`, `batchGenerateContentForTitles`, `batchExtractConceptsForFolderCommand`) in `main.ts` and `fileUtils.ts`. These commands now utilize the new concurrent processor, allowing for serial I/O operations while executing LLM API calls in parallel. This significantly improves performance for large folders.
*   **Enhanced Progress Reporting**: Updated the `ProgressReporter` interface and its UI implementations (`ProgressModal`, `NotemdSidebarView`) to display the number of active parallel tasks, providing users with more detailed feedback during batch operations.
*   **Robustness and Error Handling**:
    *   Resolved various TypeScript build errors, including incorrect import paths for `normalizeNameForFilePath` and type mismatches for `view.file?.basename`.
    *   Added safeguards to prevent runtime errors, such as ensuring a note is successfully created before attempting to generate content for it.

### Chinese (chino)

*   **Marco de procesamiento paralelo**: Introdujo un marco de procesamiento paralelo para operaciones por lotes. por en `utils.ts` Implementar la personalizacion en `Semaphore` (Semaforo) y `createConcurrentProcessor` Funcion de fabrica para completar este trabajo.。
*   **Refactorizar comandos de procesamiento por lotes**: Refactorizado `main.ts` y `fileUtils.ts` Todos los comandos principales de procesamiento por lotes en (`processFolderWithNotemdCommand`, `batchGenerateContentForTitles`, `batchExtractConceptsForFolderCommand`)。Estos comandos ahora aprovechan el nuevo procesador concurrente, lo que permite la ejecucion en paralelo. LLM API Serializar mientras llamas I/O operacion, mejorando asi significativamente el rendimiento cuando se trabaja con carpetas grandes。
*   **Informes de progreso mejorados**: Actualizado `ProgressReporter` Interfaces y sus UI Implementacion (`ProgressModal`, `NotemdSidebarView`)，para mostrar el numero de tareas paralelas activas para proporcionar a los usuarios comentarios mas detallados durante las operaciones por lotes。
*   **Robustez y manejo de errores**:
    *   Resuelto multiple TypeScript Errores de compilacion que incluyen `normalizeNameForFilePath` Rutas de importacion incorrectas y `view.file?.basename` Problema de discrepancia de tipos。
    *   Se agregaron medidas de seguridad para evitar errores de tiempo de ejecucion, como garantizar que las notas se hayan creado correctamente antes de intentar generar contenido para ellas.。

---

## Implementation of Functionality

### English

*   **New Batch Processing Settings**: Added new user settings in the UI to control the parallel processing behavior:
    *   `Enable Batch Parallelism`
    *   `Batch Concurrency`
    *   `Batch Size`
    *   `Delay Between Batches (ms)`
    *   `API Call Interval (ms)`
*   **New Command: "Create Wiki-Link & Generate Note from Selection"**:
    *   This new command streamlines the knowledge creation workflow.
    *   It allows a user to select text, which is then automatically converted to a `[[wiki-link]]`.
    *   A corresponding concept note is created in the designated "Concept Note Folder". If the note already exists, a backlink is added instead.
    *   Finally, its content is automatically generated by the LLM using the "Generate Content from Title" functionality.
*   **New Setting: "Auto-run Mermaid Syntax Fix"**: Added a setting to automatically run a syntax-fixing pass on notes after content generation tasks to ensure generated Mermaid diagrams are valid.
*   **Updated Documentation**: Updated `README.md` and `README_zh.md` to comprehensively document all new settings and the new "Create Wiki-Link & Generate Note" command.

### Chinese (chino)

*   **Configuracion de procesamiento por lotes agregada**: enUISe agregaron nuevas configuraciones de usuario para controlar el comportamiento del procesamiento paralelo：
    *   `Habilitar la paralelizacion por lotes`
    *   `Numero de concurrencia de procesamiento por lotes`
    *   `Tamano del lote`
    *   `Retraso del intervalo de lote (milisegundo)`
    *   `API Intervalo de llamada (milisegundo)`
*   **Nuevo comando: “Crear enlace wiki a partir del texto seleccionado y generar notas”**:
    *   Este nuevo comando simplifica el flujo de trabajo de creacion de conocimiento.。
    *   Permite a los usuarios seleccionar texto y luego lo convierte automaticamente a `[[Enlace wiki]]`。
    *   Cree una nota conceptual correspondiente en la "carpeta de notas conceptuales" especificada. Si la nota ya existe, se agregara un vinculo de retroceso.。
    *   Finalmente, utilice la funcion "Generar contenido a partir del titulo" LLM Generar contenido automaticamente para la nota.。
*   **Nueva configuracion: “Reparacion automatica despues de la compilacionMermaidGramatica”**: Se agrego una configuracion para ejecutar automaticamente correcciones de sintaxis en las notas despues de una tarea de generacion de contenido para garantizar su generacion.MermaidLos graficos funcionan。
*   **Actualizar documentacion**: Actualizado `README.md` y `README_zh.md`，Para documentar completamente todas las nuevas configuraciones y nuevos comandos para crear enlaces wiki y generar notas a partir del texto seleccionado.。

## 2026-05-01 — Cline-Aligned Output Token Handling and Diagram Pipeline Hardening

### Cline-Aligned Unknown Model maxOutputTokens

Problem: `resolveProviderTokenLimit` passed the global `maxTokens` setting (default 8192) for completely unknown models not in `KNOWN_MODEL_MAX_OUTPUT_TOKENS`. This was incorrect — forcing a fixed cap on models the system doesn't understand risks silently limiting output on high-capability models, or requesting unsupported `max_tokens` values on constrained models.

Fix: When a model is not known (no entry in `KNOWN_MODEL_MAX_OUTPUT_TOKENS`) AND the global `maxTokens` setting equals the default (untouched), the system now returns `undefined` — letting the API provider decide. This matches Cline's behavior exactly. User-set custom `maxTokens` values for unknown models are preserved (backward compatibility).

Scope: `resolveProviderTokenLimit` in `src/llmUtils.ts`. Affects all transports (OpenAI-compatible, Anthropic, Google, Azure OpenAI, Ollama).

Tests: Added 2 tests in `src/tests/llmUtilsProviderSupport.test.ts`:
- Unknown model + default → `max_tokens` not sent (API decides)
- Unknown model + custom value → user's value passed through

### Diagram Edge Field Normalization

Problem: Live LLM testing against DeepSeek revealed that LLM outputs use `source`/`target` edge field names, but `DiagramEdge` expects `from`/`to`. This caused validation failures when LLMs returned valid specs with the "wrong" field names.

Fix:
- `normalizeSpec` in `src/diagram/diagramSpecResponseParser.ts` now normalizes multiple edge field conventions: `from`/`source`/`sourceId`/`start` → `from`, `to`/`target`/`targetId`/`end` → `to`
- `buildDiagramSpecPrompt` in `src/diagram/prompts/diagramSpecPrompt.ts` now explicitly instructs LLMs to use `from`/`to` field names

### Live LLM Chain Tests

New test file `src/tests/liveChainTest.test.ts` (untracked, for manual execution):
- Tests real DeepSeek API calls from the test vault configuration
- Verifies chat completion, diagram spec generation, and full diagram pipeline
- All 5 tests pass against live DeepSeek API
