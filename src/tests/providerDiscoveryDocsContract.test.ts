import * as fs from 'fs';
import * as path from 'path';

describe('provider discovery docs contract', () => {
    const repoRoot = path.join(__dirname, '..', '..');
    const readmeEn = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8');
    const readmeZh = fs.readFileSync(path.join(repoRoot, 'README_zh.md'), 'utf8');
    const changeLog = fs.readFileSync(path.join(repoRoot, 'change.md'), 'utf8');
    const unifiedMatrixZh = fs.readFileSync(
        path.join(repoRoot, 'docs', 'brainstorms', '2026-05-20-unified-follow-through-matrix.zh-CN.md'),
        'utf8'
    );
    const providerPlanEn = fs.readFileSync(
        path.join(repoRoot, 'docs', 'brainstorms', '2026-05-27-provider-settings-simplification-and-model-discovery-plan.md'),
        'utf8'
    );
    const providerPlanZh = fs.readFileSync(
        path.join(repoRoot, 'docs', 'brainstorms', '2026-05-27-provider-settings-simplification-and-model-discovery-plan.zh-CN.md'),
        'utf8'
    );

    test('README surfaces mention the current bounded discovery families', () => {
        expect(readmeEn).toContain('selected official OpenAI-compatible `/models` presets');
        expect(readmeEn).toContain('Together\'s dedicated `/models` response shape');
        expect(readmeEn).toContain('Huawei Cloud MaaS\'s dedicated `v2/models` registry endpoint');
        expect(readmeEn).toContain('a bounded Vercel AI Gateway merge of the official `/v1/models` catalog plus `v3/ai/config`');
        expect(readmeEn).toContain('`OpenRouter` now uses a bounded merge of its chat and embedding catalogs');
        expect(readmeEn).toContain('Anthropic and Google discovery now also follow bounded multi-page registry traversal');
        expect(readmeEn).toContain('`AIHubMix`');
        expect(readmeEn).toContain('`PPIO`');
        expect(readmeEn).toContain('`New API`');
        expect(readmeEn).toContain('`OVMS`');
        expect(readmeEn).toContain('`LiteLLM`');
        expect(readmeEn).toContain('known official host such as OpenAI, DashScope/Qwen, Xiaomi MiMo, Fireworks, or Hugging Face');
        expect(readmeEn).toContain('OVMS-style local `/v3` endpoints');
        expect(readmeEn).toContain('`/responses`, `/chat/completions`, or `/models`');
        expect(readmeZh).toContain('Un lote de verificados OpenAI-compatible `/models` Predeterminado');
        expect(readmeZh).toContain('Together Exclusivo `/models` Formulario de respuesta');
        expect(readmeZh).toContain('Huawei Cloud MaaS Exclusivo `v2/models` Interfaz de registro de modelos');
        expect(readmeZh).toContain('Vercel AI Gateway Al funcionario `/v1/models` Con `v3/ai/config` Fusion limitada de fuente dual');
        expect(readmeZh).toContain('`OpenRouter` Ahora habra fusion de limites. chat Con embedding catalog');
        expect(readmeZh).toContain('Anthropic Con Google en provider Volver a la paginacion catalog Cuando, los resultados del modelo tambien se fusionaran de acuerdo con el recorrido delimitado de varias paginas.');
        expect(readmeZh).toContain('`AIHubMix`');
        expect(readmeZh).toContain('`PPIO`');
        expect(readmeZh).toContain('`New API`');
        expect(readmeZh).toContain('`OVMS`');
        expect(readmeZh).toContain('`LiteLLM`');
        expect(readmeZh).toContain('OpenAI、DashScope/Qwen、Xiaomi MiMo、Fireworks、Hugging Face Tal funcionario conocido host');
        expect(readmeZh).toContain('OVMS Estilo local `/v3` Punto final');
        expect(readmeZh).toContain('`/responses`、`/chat/completions` o `/models`');
        expect(readmeEn).toContain('The generic `OpenAI Compatible` entry now auto-upgrades to the matching bounded discovery family for known hosts');
        expect(readmeZh).toContain('universales `OpenAI Compatible` Los valores predeterminados ahora seran conocidos host');
    });

    test('change log describes the broader bounded discovery support truthfully', () => {
        expect(changeLog).toContain('Together\'s dedicated `/models` response shape');
        expect(changeLog).toContain('LiteLLM');
        expect(changeLog).toContain('Huawei Cloud MaaS');
        expect(changeLog).toContain('AIHubMix');
        expect(changeLog).toContain('PPIO');
        expect(changeLog).toContain('New API');
        expect(changeLog).toContain('OVMS');
        expect(changeLog).toContain('official `/v1/models` catalog plus `v3/ai/config`');
        expect(changeLog).toContain('Qwen/Doubao/Moonshot/GLM/SiliconFlow/Groq/Fireworks/Nebius/Cerebras/OpenRouter/Requesty');
        expect(changeLog).toContain('known official hosts can also reuse upstream provider token-cap metadata for bare model IDs');
        expect(changeLog).toContain('OVMS-style local `/v3` endpoints');
        expect(changeLog).toContain('`/responses`, `/chat/completions`, or `/models` endpoint forms');
    });

    test('planning docs stay aligned with the current bounded discovery truth', () => {
        expect(providerPlanEn).toContain('Together\'s dedicated `/models` array response');
        expect(providerPlanEn).toContain('Huawei Cloud MaaS\'s `v2/models` registry endpoint');
        expect(providerPlanEn).toContain('Vercel AI Gateway\'s bounded `/v1/models` + `v3/ai/config` merge');
        expect(providerPlanEn).toContain('LiteLLM\'s explicit proxy-family `/models` + `/model/info` merge');
        expect(providerPlanEn).toContain('PPIO\'s bounded chat + embedding + reranker registry merge');
        expect(providerPlanEn).toContain('OVMS\'s preferred local `/v3/models` with bounded `/v1/config` fallback');
        expect(providerPlanEn).toContain('Google and Anthropic now also traverse bounded pages');
        expect(providerPlanEn).toContain('reuses official-provider token-cap metadata for bare model IDs');
        expect(providerPlanZh).toContain('Together Dedicado `/models` Respuesta de matriz');
        expect(providerPlanZh).toContain('Huawei Cloud MaaS Camina solo `v2/models` registry endpoint');
        expect(providerPlanZh).toContain('Vercel AI Gateway Camine dentro de los limites `/v1/models` + `v3/ai/config` Fusion de doble fuente');
        expect(providerPlanZh).toContain('LiteLLM Ve explicitamente proxy-family de `/models` + `/model/info` Fusion limitada');
        expect(providerPlanZh).toContain('PPIO Camina solo chat + embedding + reranker Fusion limitada de tres vias');
        expect(providerPlanZh).toContain('OVMS Vaya primero a lo local `/v3/models`、Regresar si es necesario `/v1/config`');
        expect(providerPlanZh).toContain('Google Con Anthropic en provider Al regresar al directorio del modelo de paginacion, tambien se realizara un recorrido delimitado de varias paginas.');
        expect(providerPlanZh).toContain('bare model ID Reutilizar oficial provider de token-cap Metadatos');
        expect(providerPlanEn).toContain('OVMS-style local `/v3` endpoints');
        expect(providerPlanEn).toContain('including `/responses` endpoint forms');
        expect(providerPlanZh).toContain('OVMS Estilo local `/v3` Punto final');
        expect(providerPlanZh).toContain('Incluye `/responses` Este tipo de forma de punto final');
        expect(providerPlanEn).toContain('selected official OpenAI-compatible `GET /models` presets');
        expect(providerPlanZh).toContain('Un lote de verificados OpenAI-compatible `GET /models` Predeterminado');
        expect(unifiedMatrixZh).toContain('Together Exclusivo `/models` Respuesta');
        expect(unifiedMatrixZh).toContain('Vercel AI Gateway Limitado `/v1/models` + `v3/ai/config` Fusion de doble fuente');
        expect(unifiedMatrixZh).toContain('PPIO de chat + embedding + reranker Descubrimiento acotado de tres vias');
        expect(unifiedMatrixZh).toContain('OVMS Prioridad `/v3/models` Y reversion limitada `/v1/config`');
        expect(unifiedMatrixZh).toContain('Groq、Fireworks');
        expect(unifiedMatrixZh).toContain('OVMS Estilo local `/v3` Punto final');
        expect(unifiedMatrixZh).toContain('`/responses`、`/chat/completions`、`/models` Este tipo endpoint Formulario');
    });
});
