import { refineMermaidBlocks } from '../mermaidProcessor';

describe('Mermaid Fix Mode Tests', () => {

    test('should fix unquoted labels with nested brackets (Example 1)', async () => {
        const content = `\`\`\`mermaid
graph LR
CorpBonds -- "Cost of Capital" --> Investment[Corporate Investment "[Inversion corporativa]"];
\`\`\``;
        const expected = `\`\`\`mermaid
graph LR
CorpBonds -- "Cost of Capital" --> Investment["Corporate Investment [Inversion corporativa]"];
\`\`\``;
        const result = await refineMermaidBlocks(content);
        expect(result).toBe(expected);
    });

    test('should fix unquoted labels with nested brackets (Example 2)', async () => {
        const content = `\`\`\`mermaid
graph LR
MBS -- "Housing Demand" --> Consumption[Consumption [Consumo]];
\`\`\``;
        const expected = `\`\`\`mermaid
graph LR
MBS -- "Housing Demand" --> Consumption["Consumption [Consumo]"];
\`\`\``;
        const result = await refineMermaidBlocks(content);
        expect(result).toBe(expected);
    });

    test('should fix unquoted labels with nested brackets (Example 3 - White Dwarf)', async () => {
        const content = `\`\`\`mermaid
graph TD
PlanetaryNebula --> WhiteDwarf[enana blanca [White Dwarf]];
\`\`\``;
        const expected = `\`\`\`mermaid
graph TD
PlanetaryNebula --> WhiteDwarf["enana blanca [White Dwarf]"];
\`\`\``;
        const result = await refineMermaidBlocks(content);
        expect(result).toBe(expected);
    });

    test('should NOT fix interference items (already quoted)', async () => {
        const content = `\`\`\`mermaid
graph LR
GovCurve -- "Mortgage Rates" --> MBS["MBS Pricing [MBSPrecios]["];
\`\`\``;
        const result = await refineMermaidBlocks(content);
        expect(result).toBe(content);
    });

    test('should handle full example block correctly', async () => {
        const content = `\`\`\`mermaid
graph LR
subgraph "Monetary Policy Transmission Transmision de la politica monetaria"
CentralBank["Central Bank Rate Tasas de interes del banco central"] --> Interbank["Interbank Rates Tasa de interes interbancaria"];
Interbank --> GovCurve["Sovereign Yield Curve Curva de rendimiento del Tesoro"];

GovCurve -- "Risk-Free Benchmark" --> CorpBonds["Corporate Bond Yields Rendimientos de los bonos corporativos"];
GovCurve -- "Mortgage Rates" --> MBS["MBS Pricing [MBSPrecios]["];

CorpBonds -- "Cost of Capital" --> Investment[Corporate Investment "[Inversion corporativa]"];
MBS -- "Housing Demand" --> Consumption[Consumption [Consumo]];
end

style CentralBank fill:#fff9c4,stroke:#fbc02d
style GovCurve fill:#e0f2f1,stroke:#00695c
\`\`\``;
        
        const expected = `\`\`\`mermaid
graph LR
subgraph "Monetary Policy Transmission Transmision de la politica monetaria"
CentralBank["Central Bank Rate Tasas de interes del banco central"] --> Interbank["Interbank Rates Tasa de interes interbancaria"];
Interbank --> GovCurve["Sovereign Yield Curve Curva de rendimiento del Tesoro"];

GovCurve -- "Risk-Free Benchmark" --> CorpBonds["Corporate Bond Yields Rendimientos de los bonos corporativos"];
GovCurve -- "Mortgage Rates" --> MBS["MBS Pricing [MBSPrecios]["];

CorpBonds -- "Cost of Capital" --> Investment["Corporate Investment [Inversion corporativa]"];
MBS -- "Housing Demand" --> Consumption["Consumption [Consumo]"];
end

style CentralBank fill:#fff9c4,stroke:#fbc02d
style GovCurve fill:#e0f2f1,stroke:#00695c
\`\`\``;
        
        const result = await refineMermaidBlocks(content);
        expect(result).toBe(expected);
    });

    test('should fix broken edge labels with --["...["--> pattern', async () => {
        const content = `\`\`\`mermaid
graph LR
CapRate --["Inverse Relationship["--> PropValue;
WACC --["Hurdle Rate["--> Acquisitions;
\`\`\``;
        const expected = `\`\`\`mermaid
graph LR
CapRate -- "Inverse Relationship" --> PropValue;
WACC -- "Hurdle Rate" --> Acquisitions;
\`\`\``;
        const result = await refineMermaidBlocks(content);
        expect(result).toBe(expected);
    });

    test('should quote labels containing pipe characters', async () => {
        const content = `\`\`\`mermaid
graph LR
B -- Explicit Prior pθ --> B_Out[Posterior pθ|D];
\`\`\``;
        const expected = `\`\`\`mermaid
graph LR
B -- Explicit Prior pθ --> B_Out["Posterior pθ|D"];
\`\`\``;
        const result = await refineMermaidBlocks(content);
        expect(result).toBe(expected);
    });

    test('should convert inline comments to labeled arrows and fix end quotes', async () => {
        const content = `\`\`\`mermaid
graph TD
subgraph "Synchronization Approaches"
Kuramoto["Standard Kuramoto Model"]
aPS["a-PS Augmented Phase Sync"]
PLL["Phase-Locked Loop"]
Consensus["Consensus Algorithms"]
end

subgraph "Key Characteristics"
Pairwise["Pairwise Interaction"]
Network["Network Synchronization N > 2"]
Adaptive["Adaptive Coupling / Control"]
HigherOrder["Higher-Order Terms"]
Delay["Explicit Delay Handling"]
Reference["External Reference Tracking"]
StateConv["General State Convergence"]
end

Kuramoto --> Pairwise;
Kuramoto --> Network;

aPS --> Pairwise;
aPS --> Network;
aPS --> Adaptive;
aPS --> HigherOrder;
aPS --> Delay;

PLL --> Pairwise;
PLL --> Reference;

Consensus --> Pairwise;
Consensus --> Network;
Consensus --> StateConv;
Consensus --> Adaptive; # Some advanced consensus
Consensus --> Delay; # Some advanced consensus

style aPS fill:#ccf,stroke:#333,stroke-width:2px
\`\`\``;
        const expected = `\`\`\`mermaid
graph TD
subgraph "Synchronization Approaches"
Kuramoto["Standard Kuramoto Model"]
aPS["a-PS Augmented Phase Sync"]
PLL["Phase-Locked Loop"]
Consensus["Consensus Algorithms"]
end

subgraph "Key Characteristics"
Pairwise["Pairwise Interaction"]
Network["Network Synchronization N > 2"]
Adaptive["Adaptive Coupling / Control"]
HigherOrder["Higher-Order Terms"]
Delay["Explicit Delay Handling"]
Reference["External Reference Tracking"]
StateConv["General State Convergence"]
end

Kuramoto --> Pairwise;
Kuramoto --> Network;

aPS --> Pairwise;
aPS --> Network;
aPS --> Adaptive;
aPS --> HigherOrder;
aPS --> Delay;

PLL --> Pairwise;
PLL --> Reference;

Consensus --> Pairwise;
Consensus --> Network;
Consensus --> StateConv;
Consensus -- "Some advanced consensus" --> Adaptive;
Consensus -- "Some advanced consensus" --> Delay;

style aPS fill:#ccf,stroke:#333,stroke-width:2px
\`\`\``;
        const result = await refineMermaidBlocks(content);
        expect(result).toBe(expected);
    });
});
