import * as fs from 'fs';
import * as path from 'path';

describe('translated README english leak audit', () => {
    const repoRoot = path.join(__dirname, '..', '..');
    const readmeFiles = fs.readdirSync(repoRoot)
        .filter(file => /^README_.*\.md$/.test(file))
        .map(file => path.join(repoRoot, file));

    const forbiddenEnglishPhrases = [
        '[Language Hub](./docs/i18n/README.md)',
        'Release Workflow (English)',
        'Release Workflow (简体中文)',
        '**Batch Translate**:',
        '**Web Research & Summarization**:',
        '**Content Generation from Title**:',
        '**Summarise as Mermaid diagram**:',
        '**Use Different Providers for Tasks**:',
        '**Select different languages for different tasks**:',
        '**Enable Stable API Calls (Retry Logic)**:',
        '**API Error Debugging Mode**:',
        'AI-Powered Multi-Languages Knowledge Enhancement',
        'generate xx concepts md file',
        '#### Processed File Output',
        '#### Concept Note Output',
        '[Installation](#installation)',
        '[Configuration](#configuration)'
    ];

    const fileSpecificForbiddenEnglishPhraseEntries: Array<[string, string[]]> = [
        ['README_ru.md', [
            '### Multi-Model Configuration',
            '1. **Active Provider**:',
            '2. **Provider Settings**:',
            '3. **Test Connection**:',
            '4. **Manage Provider Configurations**:',
            '5. **Preset Coverage**:',
            '### Языковая архитектура (UI Locale vs Task Output Language)',
            '### Stable API Call Settings',
            '#### Output concept-note',
            '#### Output concept log file',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '#### One-click Workflow Buttons',
            '#### Duplicate Check Scope',
            '#### Web Research Provider',
            '#### Focused Learning Domain',
            '#### Output обработанных файлов',
            '#### Задача Extract Concepts',
            '### Developer diagnostics и debug log (опционально)',
            '#### Настройки custom prompt',
            '### Быстрые workflow и sidebar'
        ]],
        ['README_nl.md', [
            '#### Concept Log File Output',
            '#### Extract Concepts Task',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '#### Processing Parameters',
            '#### Content Generation',
            '#### One-click Workflow Buttons',
            '#### Custom Prompt Settings',
            '#### Duplicate Check Scope',
            '#### Web Research Provider',
            '#### Focused Learning Domain',
            '#### Translation',
            '### Quick Workflows en zijbalk',
            '### Developer Diagnostics en debuglogs (optioneel)',
            '#### Aangepaste promptinstellingen',
            '#### Webonderzoeksprovider',
            '### Snelle workflows en zijbalk',
            '### LLM-providerconfiguratie',
            '## Ondersteunde LLM-providers',
            '### LLM-providercalls (configureerbaar)'
        ]],
        ['README_no.md', [
            '### Stable API Call Settings',
            '### LLM Provider Calls (konfigurerbart)',
            '### Web Research Calls (valgfritt)',
            '### Developer Diagnostics & Debug Logs (valgfritt)',
            '#### Oppgaven "Extract Concepts"',
            '#### Tilpassede promptinnstillinger'
        ]],
        ['README_da.md', [
            '### Stable API Call Settings',
            '#### Extract Concepts Task',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '#### One-click Workflow Buttons',
            '#### Custom Prompt Settings',
            '#### Duplicate Check Scope',
            '#### Web Research Provider',
            '#### Focused Learning Domain',
            '### LLM Provider Calls (konfigurerbare)',
            '### Web Research Calls (valgfrit)',
            '### Developer Diagnostics & Debug Logs (valgfrit)',
            '#### Output for konceptnoter',
            '#### Output for concept log file',
            '#### Indstillinger for brugerdefinerede prompts',
            '### Hurtige workflows og sidepanel',
            '### Udviklerdiagnostik og debug-logs (valgfrit)'
        ]],
        ['README_bn.md', [
            '### LLM provider configuration',
            '### Multi-model configuration',
            '### Stable API call settings',
            '#### Processed file output',
            '#### Concept note output',
            '#### Concept log file output',
            '#### Extract Concepts task',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '#### Processing parameters',
            '#### One-click workflow button',
            '#### Custom prompt settings',
            '#### Duplicate check scope',
            '#### Web research provider',
            '### Quick workflow',
            '### LLM provider call (কনফিগারযোগ্য)',
            '### Web research call (ঐচ্ছিক)',
            '### Developer diagnostics ও debug logs (ঐচ্ছিক)'
        ]],
        ['README_ms.md', [
            '#### Output File yang Diproses',
            '#### Output Catatan Konsep',
            '#### Output File Log Konsep',
            '### Workflow Cepat & Sidebar'
        ]],
        ['README_sv.md', [
            '### Stable API Call Settings',
            '#### Utdata för concept log file',
            '#### Extract Concepts Task',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '#### One-click Workflow Buttons',
            '#### Custom Prompt Settings',
            '#### Duplicate Check Scope',
            '#### Web Research Provider',
            '#### Focused Learning Domain',
            '### LLM Provider Calls (konfigurerbara)',
            '### Web Research Calls (valfritt)',
            '### Developer Diagnostics & Debug Logs (valfritt)',
            '#### Anpassade promptinställningar'
        ]],
        ['README_cs.md', [
            '#### Úloha Extract Concepts',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '#### Tlačítka one-click workflow',
            '#### Web Research Provider',
            '#### Focused Learning Domain',
            '### Quick Workflows a Sidebar',
            '### Web Research volání (volitelné)',
            '### Developer diagnostics a debug logy (volitelné)',
            '#### Výstup concept note',
            '#### Nastavení vlastních promptů'
        ]],
        ['README_hi.md', [
            '### Stable API call settings',
            '#### Processed file output',
            '#### Concept note output',
            '#### Concept log file output',
            '#### Extract Concepts task',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '#### Processing parameters',
            '#### One-click workflow buttons',
            '#### Custom prompt settings',
            '#### Duplicate check scope',
            '#### Web research provider',
            '### LLM provider calls (कॉन्फ़िगर करने योग्य)',
            '### Web research calls (वैकल्पिक)',
            '### Developer diagnostics और debug logs (वैकल्पिक)'
        ]],
        ['README_vi.md', [
            '### Cài đặt stable API call',
            '#### Tác vụ Extract Concepts',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '### Quick Workflows và Sidebar',
            '### Chẩn đoán dành cho developer và debug log (tùy chọn)',
            '### Mở rộng knowledge graph',
            '#### Đầu ra concept note',
            '#### Nút one-click workflow',
            '#### Cài đặt custom prompt'
        ]],
        ['README_uk.md', [
            '1. **Active Provider**:',
            '2. **Provider Settings**:',
            '3. **Test Connection**:',
            '4. **Manage Provider Configurations**:',
            '5. **Preset Coverage**:',
            '### Мовна архітектура (UI Locale vs Task Output Language)',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '### Quick Workflows і Sidebar',
            '#### Вихід concept note',
            '#### Кнопки one-click workflow',
            '#### Налаштування власних prompt',
            '### Діагностика для розробників і debug-логи (необов\'язково)'
        ]],
        ['README_id.md', [
            '1. **Active Provider**:',
            '2. **Provider Settings**:',
            '3. **Test Connection**:',
            '4. **Manage Provider Configurations**:',
            '5. **Preset Coverage**:',
            '### Arsitektur Bahasa (UI Locale vs Task Output Language)',
            '#### Create minimal concept notes',
            '### Workflow Cepat & Sidebar'
        ]],
        ['README_he.md', [
            '### הגדרות Stable API Call',
            '#### פלט Concept Note',
            '#### משימת Extract Concepts',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '### diagnostics למפתחים ו-debug logs (אופציונלי)',
            '#### הגדרות prompt מותאם'
        ]],
        ['README_el.md', [
            '#### Εργασία Extract Concepts',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '### Διαγνωστικά προγραμματιστών και debug logs (προαιρετικά)',
            '#### Έξοδος concept note',
            '#### Κουμπιά one-click ροών εργασίας',
            '#### Ρυθμίσεις προσαρμοσμένων prompts'
        ]],
        ['README_hu.md', [
            '#### Extract Concepts feladat',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '#### Egyéni promptbeállítások'
        ]],
        ['README_fi.md', [
            '#### "Extract Concepts" -tehtävä',
            '#### Mukautettujen promptien asetukset',
            '### Kehittäjädiagnostiikka ja debug-lokit (valinnainen)'
        ]],
        ['README_pl.md', [
            '#### Przyciski przepływu pracy One-click',
            '#### Ustawienia niestandardowych promptów',
            '### Szybkie workflow i pasek boczny',
            '### Diagnostyka deweloperska i logi debugowania (opcjonalne)'
        ]],
        ['README_ro.md', [
            '#### Sarcina Extract Concepts',
            '#### Extract Specific Original Text',
            '#### Batch Mermaid Fix',
            '#### Butoane de flux one-click',
            '#### Setări pentru prompturi personalizate',
            '### Fluxuri rapide și sidebar',
            '### Diagnosticare pentru dezvoltatori și loguri de debug (opționale)'
        ]],
        ['README_ja.md', [
            '#### 翻訳 (Translate)',
            '#### コンテンツ生 成 (Content Generation)'
        ]],
        ['README_ko.md', [
            '#### 번역 (Translate)',
            '#### 콘텐츠 생성 (Content Generation)'
        ]],
        ['README_th.md', [
            '#### การตั้งค่า prompt แบบกำหนดเอง'
        ]],
        ['README_zh.md', [
            '### LLM Configuracion del proveedor (LLM Provider Configuration)',
            '### Configuracion multimodelo (Multi-Model Configuration)',
            '### 语言架构（UI 语言 vs Idioma de salida de la tarea）',
            '### 稳定 API 调用设置 (Stable API Call Settings)',
            '#### Procesar la salida del archivo (Processed File Output)',
            '#### Salida de la nota conceptual (Concept Note Output)',
            '#### Salida del archivo de registro conceptual (Concept Log File Output)',
            '#### Parametros de procesamiento (Processing Parameters)',
            '#### 翻译（Translate）',
            '#### 内容生 成 (Content Generation)',
            '#### Repetir el alcance de la inspeccion (Duplicate Check Scope)',
            '#### Proveedor de investigaciones en linea (Web Research Provider)',
            '#### Centrarse en areas de estudio (Focused Learning Domain)',
            '### LLM Provider Llamada (configurable）',
            '**Proveedor de actividades (Active Provider)**',
            'Configuracion del proveedor (Provider Settings)',
            '**API 密钥 (API Key)**',
            '**基础 URL / 端 点 (Base URL / Endpoint)**',
            '**模型 (Model)**',
            '**温度 (Temperature)**',
            '**API 版本 (仅限 Azure) (API Version (Azure Only))**',
            '**测试连接 (Test Connection)**',
            '**Administrar la configuracion del proveedor (Manage Provider Configurations)**',
            '**Cobertura predeterminada (Preset Coverage)**',
            'Utilice diferentes proveedores para las tareas (Use Different Providers for Tasks)',
            '启用稳定 API Llamar (logica de reintento)）(Enable Stable API Calls (Retry Logic))',
            '**重试间隔 (秒) (Retry Interval (seconds))**',
            '**Numero maximo de reintentos (Maximum Retries)**',
            '**API Modo de depuracion de errores (API Error Debugging Mode)**',
            '**Modo desarrollador (Developer Mode)**',
            '**开发者 Provider Diagnostico (solicitud larga）(Developer Provider Diagnostic (Long Request))**',
            '**Metodo de llamada de diagnostico (Diagnostic Call Mode)**',
            '**运行诊断 (Run Diagnostic)**',
            '**Ejecute pruebas de estabilidad (Run Stability Test)**',
            '**诊断超时 (Diagnostic Timeout)**',
            'Personalice la ruta para guardar los archivos procesados. (Customize Processed File Save Path)',
            '**Procesamiento de rutas de carpetas de archivos (Processed File Folder Path)**',
            'Utilice un nombre de archivo de salida personalizado para "Agregar enlace" (Use Custom Output Filename for ‘Add Links’)',
            'Sufijo personalizado/Reemplazar la cuerda (Custom Suffix/Replacement String)',
            'Elimine las barreras de codigo al agregar enlaces (Remove Code Fences on Add Links)',
            'Personaliza la ruta de la nota conceptual (Customize Concept Note Path)',
            '**Ruta de la carpeta de notas conceptuales (Concept Note Folder Path)**',
            'Generar archivos de registro de conceptos (Generate Concept Log File)',
            'Personalizar la ruta para guardar el archivo de registro (Customize Log File Save Path)',
            '**Ruta de la carpeta de registro de conceptos (Concept Log Folder Path)**',
            'Personalizar el nombre del archivo de registro (Customize Log File Name)',
            '**Nombre del archivo de registro de conceptos (Concept Log File Name)**',
            '**Habilitar la paralelizacion por lotes (Enable Batch Parallelism)**',
            '**Numero de simultaneidades de procesamiento por lotes (Batch Concurrency)**',
            '**Tamano del lote (Batch Size)**',
            '**Retraso del intervalo de lote (毫秒) (Delay Between Batches (ms))**',
            '**API 调用间隔 (毫秒) (API Call Interval (ms))**',
            '**分块字数 (Chunk Word Count)**',
            '**Habilite la deteccion de duplicados (Enable Duplicate Detection)**',
            '**Numero maximo de fichas (Max Tokens)**',
            'Habilite la investigacion en "Generar a partir de titulos" (Enable Research in “Generate from Title”)',
            'Utilice una carpeta de salida personalizada para "Generar desde el encabezado" (Use Custom Output Folder for ‘Generate from Title’)',
            '**Personalizar el nombre de la carpeta de salida (Custom Output Folder Name)**',
            'Patron de rango de verificacion repetido (Duplicate Check Scope Mode)',
            '**包含/Excluir carpetas (Include/Exclude Folders)**',
            '**Proveedor de busqueda (Search Provider)**',
            '**Tavily API 密钥 (Tavily API Key)**',
            '**Tavily Numero maximo de resultados (Tavily Max Results)**',
            '**Tavily 搜索深度 (Tavily Search Depth)**',
            '**DuckDuckGo Numero maximo de resultados (DuckDuckGo Max Results)**',
            '**DuckDuckGo Tiempo de espera para la recuperacion de contenido (DuckDuckGo Content Fetch Timeout)**',
            '**Numero maximo de tokens de contenido de investigacion (Max Research Content Tokens)**'
        ]],
        ['README_zh_Hant.md', [
            '### LLM Configuracion del proveedor (LLM Provider Configuration)',
            '### Configuracion multimodelo (Multi-Model Configuration)',
            '### 語言架構（UI 語言 vs Idioma de salida de la tarea）',
            '### 穩定 API 呼叫設定 (Stable API Call Settings)',
            '#### Procesar la salida del archivo (Processed File Output)',
            '#### Salida de la nota conceptual (Concept Note Output)',
            '#### Salida del archivo de registro conceptual (Concept Log File Output)',
            '#### 處理參數 (Processing Parameters)',
            '#### 翻譯（Translate）',
            '#### 內容生 成 (Content Generation)',
            '#### Repetir el alcance de la inspeccion (Duplicate Check Scope)',
            '#### Proveedores de investigacion en linea (Web Research Provider)',
            '#### Centrarse en areas de estudio (Focused Learning Domain)',
            '### LLM Provider Llamada (configurable）',
            '**Proveedores de eventos (Active Provider)**',
            'Configuracion del proveedor (Provider Settings)',
            '**API 金鑰 (API Key)**',
            '**基 礎 URL / 端點 (Base URL / Endpoint)**',
            '**模型 (Model)**',
            '**溫度 (Temperature)**',
            '**API 版本 (僅限 Azure) (API Version (Azure Only))**',
            '**測試連線 (Test Connection)**',
            '**Gestionar la configuracion del proveedor. (Manage Provider Configurations)**',
            '**Cobertura predeterminada (Preset Coverage)**',
            'Utilice diferentes proveedores para las tareas (Use Different Providers for Tasks)',
            '啟用穩定 API Llamar (logica de reintento)）(Enable Stable API Calls (Retry Logic))',
            '**重試間隔 (秒) (Retry Interval (seconds))**',
            '**Numero maximo de reintentos (Maximum Retries)**',
            '**API Modo de depuracion de errores (API Error Debugging Mode)**',
            '**Modo desarrollador (Developer Mode)**',
            '**開發者 Provider Diagnostico (solicitud larga）(Developer Provider Diagnostic (Long Request))**',
            '**Metodo de llamada de diagnostico (Diagnostic Call Mode)**',
            '**執行診斷 (Run Diagnostic)**',
            '**Realizar pruebas de estabilidad. (Run Stability Test)**',
            '**診斷逾時 (Diagnostic Timeout)**',
            'Personaliza la ruta de almacenamiento de los archivos procesados. (Customize Processed File Save Path)',
            '**Rutas de carpetas de archivos de proceso (Processed File Folder Path)**',
            '為「Agregar enlaces」Utilice un nombre de archivo de salida personalizado (Use Custom Output Filename for ‘Add Links’)',
            'Sufijo personalizado/取代字串 (Custom Suffix/Replacement String)',
            'Elimine la valla de codigo al agregar enlaces (Remove Code Fences on Add Links)',
            'Personaliza la ruta de la nota conceptual (Customize Concept Note Path)',
            '**Ruta de la carpeta de notas conceptuales (Concept Note Folder Path)**',
            'Generar archivos de registro de conceptos (Generate Concept Log File)',
            'Personalizar la ruta de almacenamiento del archivo de registro (Customize Log File Save Path)',
            '**Ruta de la carpeta de registro de conceptos (Concept Log Folder Path)**',
            'Personalizar el nombre del archivo de registro (Customize Log File Name)',
            '**Nombre del archivo de registro de conceptos (Concept Log File Name)**',
            '**Habilitar la paralelizacion por lotes (Enable Batch Parallelism)**',
            '**Numero de lotes simultaneos (Batch Concurrency)**',
            '**批次大小 (Batch Size)**',
            '**Retraso del intervalo de lote (毫秒) (Delay Between Batches (ms))**',
            '**API 呼叫間隔 (毫秒) (API Call Interval (ms))**',
            '**分塊字數 (Chunk Word Count)**',
            '**Habilite la deteccion de duplicados (Enable Duplicate Detection)**',
            '**Numero maximo de varitas (Max Tokens)**',
            '在「Generar a partir del titulo」Permitir la investigacion en (Enable Research in “Generate from Title”)',
            '為「Generar a partir del titulo」Utilice carpetas de salida personalizadas (Use Custom Output Folder for ‘Generate from Title’)',
            '**Personalizar el nombre de la carpeta de salida (Custom Output Folder Name)**',
            'Patron de rango de verificacion repetido (Duplicate Check Scope Mode)',
            '**包含/Excluir carpetas (Include/Exclude Folders)**',
            '**Busqueda de proveedores (Search Provider)**',
            '**Tavily API 金鑰 (Tavily API Key)**',
            '**Tavily Numero maximo de resultados (Tavily Max Results)**',
            '**Tavily 搜尋深度 (Tavily Search Depth)**',
            '**DuckDuckGo Numero maximo de resultados (DuckDuckGo Max Results)**',
            '**DuckDuckGo Tiempo de espera para la recuperacion de contenido (DuckDuckGo Content Fetch Timeout)**',
            '**Numero maximo de cetros de contenidos de investigacion (Max Research Content Tokens)**'
        ]]
    ];

    const duplicatedReadmeNames = fileSpecificForbiddenEnglishPhraseEntries.reduce<Map<string, number>>((counts, [readmeName]) => {
        counts.set(readmeName, (counts.get(readmeName) || 0) + 1);
        return counts;
    }, new Map());

    const duplicateFileSpecificAuditBlocks = Array.from(duplicatedReadmeNames.entries())
        .filter(([, count]) => count > 1)
        .map(([readmeName]) => readmeName);

    const fileSpecificForbiddenEnglishPhrases = Object.fromEntries(fileSpecificForbiddenEnglishPhraseEntries);

    test('does not define duplicate file-specific audit blocks', () => {
        expect(duplicateFileSpecificAuditBlocks).toEqual([]);
    });

    test('does not leave known english UI and workflow phrases in translated README variants', () => {
        for (const readmePath of readmeFiles) {
            const source = fs.readFileSync(readmePath, 'utf8');
            const readmeName = path.basename(readmePath);

            for (const phrase of forbiddenEnglishPhrases) {
                expect(source).not.toContain(phrase);
            }

            for (const phrase of fileSpecificForbiddenEnglishPhrases[readmeName] || []) {
                expect(source).not.toContain(phrase);
            }
        }
    });
});
