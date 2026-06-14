import * as fs from 'fs';
import * as path from 'path';

const repoRoot = path.join(__dirname, '..', '..');

function readDoc(relativePath: string): string {
    return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('mainline progress audit contract', () => {
    const progressDoc = readDoc('docs/brainstorms/2026-05-28-mainline-progress-audit-and-next-level-direction.md');
    const progressDocZh = readDoc(
        'docs/brainstorms/2026-05-28-mainline-progress-audit-and-next-level-direction.zh-CN.md'
    );
    const postRecoveryDoc = readDoc(
        'docs/brainstorms/2026-05-25-post-bounded-recovery-audit-and-next-level-direction.md'
    );
    const postRecoveryDocZh = readDoc(
        'docs/brainstorms/2026-05-25-post-bounded-recovery-audit-and-next-level-direction.zh-CN.md'
    );
    const matrixDoc = readDoc('docs/brainstorms/2026-05-20-unified-follow-through-matrix.md');
    const matrixDocZh = readDoc('docs/brainstorms/2026-05-20-unified-follow-through-matrix.zh-CN.md');

    test('records the current Stage-B2/C/D baseline and fixture anchor in both canonical progress docs', () => {
        expect(progressDoc).toContain('### 2.7 Current `890b21b` Stage-B2/C/D follow-through baseline');
        expect(progressDocZh).toContain('### 2.7 Actual `890b21b` Stage-B2/C/D Seguimiento de las lineas de base');
        expect(progressDoc).toContain('docs(progress): align post-recovery packaging truth');
        expect(progressDocZh).toContain('docs(progress): align post-recovery packaging truth');
        expect(progressDoc).toContain('earlier local-KB fixture anchor remains `824d07e`');
        expect(progressDocZh).toContain('Antes local-KB fixture El ancla permanece `824d07e`');
        expect(progressDoc).toContain('test(local-kb): cover chapter split showcase retrieval');
        expect(progressDocZh).toContain('test(local-kb): cover chapter split showcase retrieval');
        expect(progressDoc).toContain('`npm run verify:local-kb-fixtures`');
        expect(progressDocZh).toContain('`npm run verify:local-kb-fixtures`');
        expect(progressDoc).toContain('MiniSearch-backed retrieval path');
        expect(progressDocZh).toContain('MiniSearch-backed retrieval Camino');
    });

    test('locks the active PRD interpretation to landed implementation truth plus ongoing gates', () => {
        expect(progressDoc).toContain('Requirement-by-requirement status');
        expect(progressDocZh).toContain('Estado detallado actual');

        for (const marker of ['R1 local-KB task support', 'R2/R3 local-only', 'R4/R4a/R4b', 'R8 packaging']) {
            expect(progressDoc).toContain(marker);
        }

        for (const marker of ['R1 local-KB Apoyo a la mision', 'R2/R3 local-only', 'R4/R4a/R4b', 'R8 packaging']) {
            expect(progressDocZh).toContain(marker);
        }

        expect(progressDoc).toContain('On current main, R1 through R7 are implementation truth');
        expect(progressDocZh).toContain('En la linea principal actual，R1 llegar R7 Ya se da cuenta del valor de la verdad.');
        expect(progressDoc).toContain('R9 and R10 are continuing finish gates');
        expect(progressDocZh).toContain('R9 con R10 es continuo finish gate');
    });

    test('keeps diagnostics and packaging boundaries explicit instead of widening public claims', () => {
        for (const content of [progressDoc, progressDocZh, postRecoveryDoc, postRecoveryDocZh, matrixDoc, matrixDocZh]) {
            expect(content).toContain('`local-knowledge.inspect`');
            expect(content).toContain('`main.js`');
            expect(content).toContain('inline `srcdoc`');
        }

        expect(progressDoc).toContain('maintainer-only');
        expect(progressDocZh).toContain('maintainer-only');
        expect(postRecoveryDoc).toContain('maintainer-only');
        expect(postRecoveryDocZh).toContain('maintainer-only');
        expect(matrixDoc).toContain('maintainer-only');
        expect(matrixDocZh).toContain('maintainer-only');
        expect(progressDoc).toContain('not a public CLI expansion');
        expect(progressDocZh).toContain('No public CLI Expansion');
        expect(progressDoc).toContain('no dedicated runtime asset is claimed');
        expect(progressDocZh).toContain('Sin reclamaciones dedicated runtime asset');
        expect(progressDoc).toContain('`createRenderHostBundleBuildOptions()` remains candidate-only');
        expect(progressDoc).toContain('not consumed by `esbuild.config.mjs`');
        expect(progressDocZh).toContain('`createRenderHostBundleBuildOptions()` Sigue asi candidate-only');
        expect(progressDocZh).toContain('No puede ser `esbuild.config.mjs` Consumo');
        expect(matrixDoc).toContain('`createRenderHostBundleBuildOptions()` candidate-only');
        expect(matrixDoc).toContain('production `esbuild.config.mjs` path');
        expect(matrixDocZh).toContain('`createRenderHostBundleBuildOptions()`');
        expect(matrixDocZh).toContain('candidate-only');
        expect(matrixDocZh).toContain('production `esbuild.config.mjs`');
        expect(matrixDoc).toContain('not existence re-proof');
        expect(matrixDocZh).toContain('No sigas haciendo reconfirmaciones existenciales');
    });

    test('keeps the post-recovery audit aligned to current release and provider-control truth', () => {
        expect(postRecoveryDoc).toContain('shipped through the `1.9.2` boundary');
        expect(postRecoveryDocZh).toContain('Enviado a `1.9.2` Limites');
        expect(postRecoveryDoc).toContain('`createRenderHostBundleBuildOptions()` remains candidate-only');
        expect(postRecoveryDocZh).toContain('`createRenderHostBundleBuildOptions()` Mantendra candidate-only');
        expect(postRecoveryDoc).toContain('provider settings/model discovery is no longer an unlanded UX architecture gap');
        expect(postRecoveryDocZh).toContain('provider settings/model discovery Ya no esta desconectado UX architecture gap');
        expect(postRecoveryDoc).toContain('keep the landed provider settings/model-discovery control plane shared-core and lightweight');
        expect(postRecoveryDocZh).toContain('Deja lo que ha aterrizado provider settings/model-discovery control plane');

        for (const staleMarker of [
            'shipped `1.9.0`,',
            'through hardcoded branching on `activeProvider.name`',
            'does **not** yet describe',
            'current main does **not** already satisfy the requested provider-settings UX',
            'stop hardcoding provider settings behavior',
            'first-batch discovery support should stay narrow',
            'current hardcoded provider panel cannot'
        ]) {
            expect(postRecoveryDoc).not.toContain(staleMarker);
        }

        for (const staleMarker of [
            'Publicado `1.9.0`',
            'Todavia paso `activeProvider.name` Ramas codificadas de',
            'eso **Todavia no** Expresion',
            'Actual main **No** Se han cumplido los requisitos del usuario. provider-settings UX',
            'Primero deje de codificar provider settings Comportamiento',
            'Primer lote discovery El apoyo sigue siendo estrecho',
            'Actualmente codificado provider panel No'
        ]) {
            expect(postRecoveryDocZh).not.toContain(staleMarker);
        }
    });

    test('keeps the unified matrix aligned with the same current-head evidence and next direction', () => {
        expect(matrixDoc).toContain('Current execution baseline for this matrix update:');
        expect(matrixDocZh).toContain('La linea base de ejecucion actual de esta actualizacion de matriz.：');
        expect(matrixDoc).toContain('`890b21b`');
        expect(matrixDocZh).toContain('`890b21b`');
        expect(matrixDoc).toContain('docs(progress): align post-recovery packaging truth');
        expect(matrixDocZh).toContain('docs(progress): align post-recovery packaging truth');
        expect(matrixDoc).toContain('`824d07e`');
        expect(matrixDocZh).toContain('`824d07e`');
        expect(matrixDoc).toContain(
            'real-note-style chapter-split showcase retrieval plus real-note/query diversity beyond the chapter-split showcase through the live MiniSearch path'
        );
        expect(matrixDocZh).toContain('real-note-style chapter-split showcase retrieval');
        expect(matrixDocZh).toContain('chapter-split showcase La realidad mas alla note/query Diversidad');
        expect(matrixDocZh).toContain('MiniSearch path');
        expect(matrixDoc).toContain('cross-folder task-contract retrieval, RAG-quality evaluation notes, and low-signal navigation-source diagnostics');
        expect(matrixDocZh).toContain('Recuperacion de contratos de tareas entre carpetas、RAG Notas de evaluacion de calidad y fuentes de navegacion con baja senal. diagnostics');
        expect(matrixDoc).toContain('evaluation depth, maintainer-example alignment, and packaging-boundary discipline');
        expect(matrixDocZh).toContain('Profundidad de la evaluacion、maintainer Ejemplo de alineacion con packaging Disciplina limite');
        expect(matrixDoc).toContain('candidate-only production-build guard');
        expect(matrixDocZh).toContain('candidate-only production-build guard');
    });
});
